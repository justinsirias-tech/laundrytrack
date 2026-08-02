require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Support base64 photos

// Configure PostgreSQL pool
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: { rejectUnauthorized: false }
});

let dbInitialized = false;
let dbInitPromise = null;
const ensureDb = async () => {
    if (dbInitialized) return;
    if (!dbInitPromise) {
        // initDatabase is defined further down, but hoisting works if we call it at runtime
        dbInitPromise = initDatabase().then(() => { dbInitialized = true; });
    }
    await dbInitPromise;
};

app.use('/api', async (req, res, next) => {
    console.log(`[API Request] ${req.method} ${req.path}`);
    try {
        console.log('Ensuring DB...');
        await ensureDb();
        console.log('DB Ensured.');
    } catch (e) {
        console.error('Failed to initialize DB', e);
    }
    next();
});

// Default clothing categories and standard types
const DEFAULT_CLOTHING_TYPES = [
    'Shirt', 'Formal', 'Blouse', 'Pants', 'Shorts', 
    'Underwear', 'Dress', 'Jacket', 'Socks', 'Shoes', 
    'Hat', 'Scarf', 'Gloves', 'Bedding', 'Bag', 
    'Other', 'Neck Tie', 'Overcoat', 'Suit'
];

const DEFAULT_CATEGORIES = [
    { id: 'cat-1', name: 'Tops', items: ['Shirt', 'Formal', 'Blouse', 'Jacket', 'Overcoat', 'Suit'] },
    { id: 'cat-2', name: 'Bottoms', items: ['Pants', 'Shorts', 'Underwear', 'Dress'] },
    { id: 'cat-3', name: 'Accessories', items: ['Socks', 'Shoes', 'Hat', 'Scarf', 'Gloves', 'Neck Tie', 'Bag'] },
    { id: 'cat-4', name: 'Bedding', items: ['Bedding'] }
];

const DEFAULT_CLOTHING_BRANDS = [
    'Uniqlo', 'Nike', 'Adidas', 'Zara', 'H&M', 'G2000',
    'Giordano', 'Baleno', 'Bossini', 'Fila', 'Champion',
    'Converse', 'Vans', 'Supreme', 'Off-White', 'Puma',
    'Under Armour', 'Lacoste', 'Calvin Klein', 'Ralph Lauren',
    "Levi's", 'Tommy Hilfiger', 'Chanel', 'Gucci', 'Prada',
    'Dior', 'Louis Vuitton', 'Balenciaga', 'Burberry', 'Moncler',
    'Saint Laurent', 'Fendi', 'Patagonia', 'The North Face', 'New Balance',
    'Reebok', 'Guess', 'Diesel', 'GAP', 'Forever 21',
    'Mango', 'Bape', 'Stussy', 'Versace', 'Hermès',
    'Armani', 'Givenchy', 'Valentino', 'Dolce & Gabbana', 'Kenzo',
    'Asics', 'Superdry', 'Massimo Dutti'
];

// Initialize Database Schema and Seed Data
const initDatabase = async () => {
    const client = await pool.connect();
    try {
        console.log('Connecting to Google Cloud SQL PostgreSQL database...');
        await client.query('BEGIN');

        // Create tables
        await client.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id VARCHAR(50) PRIMARY KEY,
                customer_name VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                service_type VARCHAR(100) NOT NULL,
                status VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                order_date VARCHAR(50) NOT NULL
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
                type VARCHAR(100) NOT NULL,
                brand VARCHAR(100),
                color VARCHAR(50) NOT NULL,
                color_hex VARCHAR(20) NOT NULL,
                issue_image TEXT,
                issue_level VARCHAR(20) NOT NULL
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS clothing_types (
                name VARCHAR(100) PRIMARY KEY
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS clothing_brands (
                name VARCHAR(100) PRIMARY KEY
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS item_categories (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(100) NOT NULL
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS category_items (
                category_id VARCHAR(50) REFERENCES item_categories(id) ON DELETE CASCADE,
                clothing_type VARCHAR(100) REFERENCES clothing_types(name) ON DELETE CASCADE,
                PRIMARY KEY (category_id, clothing_type)
            )
        `);

        // Create indexes to optimize query performance
        await client.query('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id)');

        // Run migrations for order_items table schema
        await client.query('ALTER TABLE order_items ADD COLUMN IF NOT EXISTS service_type VARCHAR(100)');
        await client.query('ALTER TABLE order_items ADD COLUMN IF NOT EXISTS defect_image TEXT');
        await client.query('ALTER TABLE order_items ADD COLUMN IF NOT EXISTS tracking_id VARCHAR(100)');
        await client.query('ALTER TABLE clothing_types ADD COLUMN IF NOT EXISTS name_th VARCHAR(255)');
        await client.query('ALTER TABLE clothing_types ADD COLUMN IF NOT EXISTS name_my VARCHAR(255)');
        await client.query('ALTER TABLE item_categories ADD COLUMN IF NOT EXISTS name_th VARCHAR(255)');
        await client.query('ALTER TABLE item_categories ADD COLUMN IF NOT EXISTS name_my VARCHAR(255)');

        // Create table for status checklist verifications and audit logs
        await client.query(`
            CREATE TABLE IF NOT EXISTS item_verification_logs (
                id SERIAL PRIMARY KEY,
                order_id VARCHAR(50) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                tracking_id VARCHAR(100) NOT NULL,
                status VARCHAR(50) NOT NULL,
                checked BOOLEAN NOT NULL DEFAULT FALSE,
                verified_by VARCHAR(100) NOT NULL,
                verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        // Create table for staff users and roles
        await client.query(`
            CREATE TABLE IF NOT EXISTS app_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL,
                pin VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create table for department checklist verifications
        await client.query(`
            CREATE TABLE IF NOT EXISTS department_verifications (
                id SERIAL PRIMARY KEY,
                order_id VARCHAR(50) NOT NULL,
                department VARCHAR(50) NOT NULL,
                tracking_id VARCHAR(100) NOT NULL,
                checked BOOLEAN NOT NULL DEFAULT TRUE,
                notes TEXT,
                verified_by VARCHAR(100) NOT NULL,
                verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await client.query('ALTER TABLE department_verifications DROP CONSTRAINT IF EXISTS department_verifications_order_id_fkey');

        // Create table for discrepancy audit logs
        await client.query(`
            CREATE TABLE IF NOT EXISTS discrepancy_logs (
                id SERIAL PRIMARY KEY,
                order_id VARCHAR(50) NOT NULL,
                department VARCHAR(50) NOT NULL,
                previous_department VARCHAR(50) NOT NULL,
                discrepancy_details TEXT NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                approved_by VARCHAR(100),
                approved_at TIMESTAMP
            )
        `);
        await client.query('ALTER TABLE discrepancy_logs DROP CONSTRAINT IF EXISTS discrepancy_logs_order_id_fkey');

        // Create table for order activity history logs
        await client.query(`
            CREATE TABLE IF NOT EXISTS order_activity_logs (
                id SERIAL PRIMARY KEY,
                order_id VARCHAR(50) NOT NULL,
                actor_name VARCHAR(100) NOT NULL,
                actor_role VARCHAR(50) NOT NULL,
                action_type VARCHAR(50) NOT NULL,
                details TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query('CREATE INDEX IF NOT EXISTS idx_dept_verifications ON department_verifications (order_id, department)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_discrepancies_order_id ON discrepancy_logs (order_id)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_activity_logs_order_id ON order_activity_logs (order_id)');

        await client.query('COMMIT');
        console.log('Database tables successfully initialized.');

        // Seed default staff users if empty
        const usersCount = await client.query('SELECT COUNT(*) FROM app_users');
        if (parseInt(usersCount.rows[0].count) === 0) {
            console.log('Seeding default staff users into database...');
            const defaultUsers = [
                { username: 'admin', name: 'Manager / Admin', role: 'Manager', pin: '1234' },
                { username: 'checker1', name: 'Sarah (Checker)', role: 'Checker/Cashier', pin: '1111' },
                { username: 'washer1', name: 'John (Washer)', role: 'Washer', pin: '2222' },
                { username: 'ironing1', name: 'Nok (Ironing)', role: 'Ironing', pin: '3333' },
                { username: 'packing1', name: 'Somchai (Packing)', role: 'Packing', pin: '4444' }
            ];
            for (const u of defaultUsers) {
                await client.query(
                    'INSERT INTO app_users (username, name, role, pin) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
                    [u.username, u.name, u.role, u.pin]
                );
            }
        }

        // Seed default clothing types if empty
        const typesCount = await client.query('SELECT COUNT(*) FROM clothing_types');
        if (parseInt(typesCount.rows[0].count) === 0) {
            console.log('Seeding default clothing types into database...');
            for (const name of DEFAULT_CLOTHING_TYPES) {
                await client.query('INSERT INTO clothing_types (name) VALUES ($1) ON CONFLICT DO NOTHING', [name]);
            }
        }

        // Seed default categories if empty
        const catsCount = await client.query('SELECT COUNT(*) FROM item_categories');
        if (parseInt(catsCount.rows[0].count) === 0) {
            console.log('Seeding default categories and assignments into database...');
            for (const cat of DEFAULT_CATEGORIES) {
                await client.query('INSERT INTO item_categories (id, name) VALUES ($1, $2)', [cat.id, cat.name]);
                for (const item of cat.items) {
                    await client.query('INSERT INTO category_items (category_id, clothing_type) VALUES ($1, $2) ON CONFLICT DO NOTHING', [cat.id, item]);
                }
            }
        }

        // Seed default clothing brands
        const brandsCount = await client.query('SELECT COUNT(*) FROM clothing_brands');
        if (parseInt(brandsCount.rows[0].count) === 0) {
            console.log('Syncing default clothing brands in database...');
            for (const name of DEFAULT_CLOTHING_BRANDS) {
                await client.query('INSERT INTO clothing_brands (name) VALUES ($1) ON CONFLICT DO NOTHING', [name]);
            }
        }

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error initializing database:', err);
    } finally {
        client.release();
    }
};

// --- API ENDPOINTS ---

// 1. Get all orders
app.get('/api/orders', async (req, res) => {
    console.log('GET /api/orders route handler entered');
    try {
        console.log('Querying orders...');
        const ordersRes = await pool.query('SELECT * FROM orders ORDER BY created_at ASC');
        console.log('Orders query complete. Querying items...');
        const itemsRes = await pool.query('SELECT * FROM order_items');
        console.log('Items query complete.');
        
        // Group items by order ID
        const itemsMap = {};
        itemsRes.rows.forEach(item => {
            if (!itemsMap[item.order_id]) {
                itemsMap[item.order_id] = [];
            }
            itemsMap[item.order_id].push({
                type: item.type,
                brand: item.brand,
                color: item.color,
                colorHex: item.color_hex,
                issueImage: item.issue_image,
                issueLevel: item.issue_level,
                serviceType: item.service_type || 'Same as Order',
                defectImage: item.defect_image || '',
                trackingId: item.tracking_id || ''
            });
        });
        
        const formattedOrders = ordersRes.rows.map(order => ({
            id: order.id,
            customerName: order.customer_name,
            phone: order.phone,
            serviceType: order.service_type,
            status: order.status,
            date: order.order_date,
            items: itemsMap[order.id] || []
        }));
        
        console.log('Sending response for GET /api/orders');
        res.json(formattedOrders);
    } catch (err) {
        console.error('Error in GET /api/orders:', err);
        res.status(500).json({ error: err.message });
    }
});

// 2. Create a new order
app.post('/api/orders', async (req, res) => {
    const { id, customerName, phone, serviceType, status, date, items } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Insert order
        await client.query(
            'INSERT INTO orders (id, customer_name, phone, service_type, status, order_date) VALUES ($1, $2, $3, $4, $5, $6)',
            [id, customerName, phone, serviceType, status, date]
        );
        
        // Insert items
        if (items && items.length > 0) {
            for (const item of items) {
                await client.query(
                    'INSERT INTO order_items (order_id, type, brand, color, color_hex, issue_image, issue_level, service_type, defect_image, tracking_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                    [id, item.type, item.brand, item.color, item.colorHex, item.issueImage, item.issueLevel, item.serviceType || 'Same as Order', item.defectImage || '', item.trackingId || '']
                );
            }
        }
        
        await client.query('COMMIT');
        res.status(201).json({ success: true, orderId: id });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// 3. Update order status (Kanban drag-and-drop)
app.put('/api/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 4. Get standard clothing types (Items library)
app.get('/api/clothing-types', async (req, res) => {
    try {
        const result = await pool.query('SELECT name, name_th, name_my FROM clothing_types ORDER BY name ASC');
        res.json(result.rows.map(r => ({ name: r.name, name_th: r.name_th || '', name_my: r.name_my || '' })));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 5. Add or update item in library
app.post('/api/clothing-types', async (req, res) => {
    const { name, name_th, name_my } = req.body;
    try {
        await pool.query(
            `INSERT INTO clothing_types (name, name_th, name_my) VALUES ($1, $2, $3) 
             ON CONFLICT (name) DO UPDATE SET 
                name_th = COALESCE(EXCLUDED.name_th, clothing_types.name_th),
                name_my = COALESCE(EXCLUDED.name_my, clothing_types.name_my)`,
            [name, name_th || '', name_my || '']
        );
        res.status(201).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Update item Thai / Myanmar name specifically
app.put('/api/clothing-types/:name', async (req, res) => {
    const { name } = req.params;
    const { name_th, name_my } = req.body;
    try {
        if (name_th !== undefined) {
            await pool.query('UPDATE clothing_types SET name_th = $1 WHERE name = $2', [name_th, name]);
        }
        if (name_my !== undefined) {
            await pool.query('UPDATE clothing_types SET name_my = $1 WHERE name = $2', [name_my, name]);
        }
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 6. Delete item from library
app.delete('/api/clothing-types/:name', async (req, res) => {
    const { name } = req.params;
    try {
        await pool.query('DELETE FROM clothing_types WHERE name = $1', [name]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 7. Get category board & assignments
app.get('/api/categories', async (req, res) => {
    try {
        const catRes = await pool.query('SELECT * FROM item_categories ORDER BY id ASC');
        const mapRes = await pool.query('SELECT * FROM category_items');
        
        const itemsMap = {};
        mapRes.rows.forEach(row => {
            if (!itemsMap[row.category_id]) {
                itemsMap[row.category_id] = [];
            }
            itemsMap[row.category_id].push(row.clothing_type);
        });
        
        const formatted = catRes.rows.map(cat => ({
            id: cat.id,
            name: cat.name,
            name_th: cat.name_th || '',
            name_my: cat.name_my || '',
            items: itemsMap[cat.id] || []
        }));
        
        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 8. Create or update category
app.post('/api/categories', async (req, res) => {
    const { id, name, name_th, name_my } = req.body;
    try {
        await pool.query(
            `INSERT INTO item_categories (id, name, name_th, name_my) VALUES ($1, $2, $3, $4) 
             ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, name_th = EXCLUDED.name_th, name_my = EXCLUDED.name_my`,
            [id, name, name_th || '', name_my || '']
        );
        res.status(201).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Update category specifically
app.put('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (name_th !== undefined && name !== undefined) {
            await pool.query('UPDATE item_categories SET name = $1, name_th = $2 WHERE id = $3', [name, name_th, id]);
        } else if (name_th !== undefined) {
            await pool.query('UPDATE item_categories SET name_th = $1 WHERE id = $2', [name_th, id]);
        } else if (name !== undefined) {
            await pool.query('UPDATE item_categories SET name = $1 WHERE id = $2', [name, id]);
        }
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 9. Delete category
app.delete('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM item_categories WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 10. Assign item to category (drag & drop)
app.post('/api/categories/assign', async (req, res) => {
    const { itemType, targetCatId } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Remove from existing category assignments
        await client.query('DELETE FROM category_items WHERE clothing_type = $1', [itemType]);
        
        // Insert new assignment if target is provided
        if (targetCatId) {
            await client.query(
                'INSERT INTO category_items (category_id, clothing_type) VALUES ($1, $2)',
                [targetCatId, itemType]
            );
        }
        
        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// 11. Get all clothing brands
app.get('/api/clothing-brands', async (req, res) => {
    try {
        const result = await pool.query('SELECT name FROM clothing_brands ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 12. Create a new clothing brand
app.post('/api/clothing-brands', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    try {
        await pool.query('INSERT INTO clothing_brands (name) VALUES ($1) ON CONFLICT DO NOTHING', [name]);
        res.json({ success: true, name: name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 13. Get all item verifications (for global admin logs)
app.get('/api/item-verifications', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM item_verification_logs ORDER BY verified_at DESC LIMIT 500');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 14. Get latest checked state of items in order for a specific board status
app.get('/api/item-verifications/order/:orderId/status/:status', async (req, res) => {
    const { orderId, status } = req.params;
    try {
        const query = `
            SELECT DISTINCT ON (tracking_id) tracking_id, checked, verified_by, verified_at
            FROM item_verification_logs
            WHERE order_id = $1 AND status = $2
            ORDER BY tracking_id, verified_at DESC
        `;
        const result = await pool.query(query, [orderId, status]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 15. Get all verification logs for a specific order
app.get('/api/item-verifications/order/:orderId', async (req, res) => {
    const { orderId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM item_verification_logs WHERE order_id = $1 ORDER BY verified_at DESC', [orderId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 16. Save an item verification log
app.post('/api/item-verifications', async (req, res) => {
    const { orderId, trackingId, status, checked, verifiedBy } = req.body;
    try {
        const query = `
            INSERT INTO item_verification_logs (order_id, tracking_id, status, checked, verified_by)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const result = await pool.query(query, [orderId, trackingId, status, checked, verifiedBy || 'Staff']);
        res.status(201).json({ success: true, log: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- USER MANAGEMENT ENDPOINTS ---
// Get all staff users
app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, name, role, pin, created_at FROM app_users ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Add staff user
app.post('/api/users', async (req, res) => {
    const { username, name, role, pin } = req.body;
    if (!username || !name || !role || !pin) {
        return res.status(400).json({ error: 'All fields (username, name, role, pin) are required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO app_users (username, name, role, pin) VALUES ($1, $2, $3, $4) RETURNING id, username, name, role, pin, created_at',
            [username.trim(), name.trim(), role.trim(), pin.trim()]
        );
        res.status(201).json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Update staff user
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, role, pin } = req.body;
    try {
        const result = await pool.query(
            'UPDATE app_users SET name = $1, role = $2, pin = $3 WHERE id = $4 RETURNING id, username, name, role, pin, created_at',
            [name.trim(), role.trim(), pin.trim(), id]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Delete staff user
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM app_users WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Verify staff PIN
app.post('/api/users/verify-pin', async (req, res) => {
    const { pin } = req.body;
    try {
        const result = await pool.query('SELECT id, username, name, role FROM app_users WHERE pin = $1', [pin]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid PIN' });
        }
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- DEPARTMENT VERIFICATION & PENDING CHECKLISTS ENDPOINTS ---
// Submit department checklist verification & check for discrepancies
app.post('/api/department-verifications', async (req, res) => {
    const { orderId, department, verifications, verifiedBy } = req.body;
    if (!orderId || !department || !Array.isArray(verifications)) {
        return res.status(400).json({ error: 'Invalid request body' });
    }
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        await client.query('DELETE FROM department_verifications WHERE order_id = $1 AND department = $2', [orderId, department]);
        
        for (const item of verifications) {
            await client.query(
                'INSERT INTO department_verifications (order_id, department, tracking_id, checked, notes, verified_by) VALUES ($1, $2, $3, $4, $5, $6)',
                [orderId, department, item.trackingId, item.checked, item.notes || '', verifiedBy || 'Staff']
            );
        }
        
        const deptOrder = ['Checker/Cashier', 'Washer', 'Ironing', 'Packing'];
        const currentIdx = deptOrder.indexOf(department);
        let discrepancyFound = false;
        let discrepancyDetails = '';
        let prevDeptName = '';
        
        if (currentIdx > 0) {
            const prevVerifsRes = await client.query(
                `SELECT department, tracking_id, checked FROM department_verifications WHERE order_id = $1 ORDER BY verified_at DESC`,
                [orderId]
            );
            
            for (let i = currentIdx - 1; i >= 0; i--) {
                const targetDept = deptOrder[i];
                const prevDeptItems = prevVerifsRes.rows.filter(r => r.department === targetDept);
                if (prevDeptItems.length > 0) {
                    prevDeptName = targetDept;
                    const currentCheckedCount = verifications.filter(v => v.checked).length;
                    const prevCheckedCount = prevDeptItems.filter(v => v.checked).length;
                    
                    if (currentCheckedCount !== prevCheckedCount) {
                        discrepancyFound = true;
                        discrepancyDetails = `Count mismatch: ${department} verified ${currentCheckedCount} item(s), but ${targetDept} verified ${prevCheckedCount} item(s).`;
                    }
                    break;
                }
            }
        }
        
        if (discrepancyFound) {
            await client.query(
                `INSERT INTO discrepancy_logs (order_id, department, previous_department, discrepancy_details, status) VALUES ($1, $2, $3, $4, 'PENDING')`,
                [orderId, department, prevDeptName, discrepancyDetails]
            );
        }
        
        await client.query('COMMIT');
        res.json({ success: true, discrepancyFound, discrepancyDetails });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// Get department verifications for an order
app.get('/api/department-verifications/:orderId', async (req, res) => {
    const { orderId } = req.params;
    try {
        const verifsRes = await pool.query('SELECT * FROM department_verifications WHERE order_id = $1 ORDER BY verified_at ASC', [orderId]);
        const discRes = await pool.query('SELECT * FROM discrepancy_logs WHERE order_id = $1 AND status = \'PENDING\' ORDER BY id DESC', [orderId]);
        res.json({ verifications: verifsRes.rows, pendingDiscrepancies: discRes.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Approve discrepancy with Manager PIN
app.post('/api/discrepancies/approve', async (req, res) => {
    const { orderId, managerPin } = req.body;
    try {
        const userRes = await pool.query('SELECT name, role FROM app_users WHERE pin = $1', [managerPin]);
        if (userRes.rows.length === 0 || userRes.rows[0].role !== 'Manager') {
            return res.status(403).json({ error: 'Invalid Manager PIN or insufficient privileges.' });
        }
        
        const manager = userRes.rows[0];
        await pool.query(
            `UPDATE discrepancy_logs SET status = 'APPROVED', approved_by = $1, approved_at = CURRENT_TIMESTAMP WHERE order_id = $2 AND status = 'PENDING'`,
            [manager.name, orderId]
        );
        
        res.json({ success: true, approvedBy: manager.name });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Get unperformed / pending checklists report for all active orders
app.get('/api/pending-checklists', async (req, res) => {
    try {
        const ordersRes = await pool.query(`
            SELECT o.id, o.customer_name, o.service_type, o.status, o.order_date, o.created_at,
                   COUNT(i.id) as item_count
            FROM orders o
            LEFT JOIN order_items i ON o.id = i.order_id
            WHERE o.status NOT IN ('Completed', 'Cancelled', 'Delivered')
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `);
        
        const verifsRes = await pool.query(`SELECT DISTINCT order_id, department FROM department_verifications`);
        const discRes = await pool.query(`SELECT order_id, department, discrepancy_details FROM discrepancy_logs WHERE status = 'PENDING'`);
        
        const completedDeptsMap = {};
        verifsRes.rows.forEach(r => {
            if (!completedDeptsMap[r.order_id]) completedDeptsMap[r.order_id] = new Set();
            completedDeptsMap[r.order_id].add(r.department);
        });
        
        const activeDiscrepanciesMap = {};
        discRes.rows.forEach(r => {
            activeDiscrepanciesMap[r.order_id] = r.discrepancy_details;
        });
        
        const report = ordersRes.rows.map(o => {
            const service = (o.service_type || '').toLowerCase();
            let mandatoryDepts = ['Checker/Cashier', 'Washer', 'Ironing', 'Packing'];
            if (service.includes('wash/fold') || service.includes('wash & fold') || service.includes('pcs') || service.includes('linens')) {
                mandatoryDepts = ['Checker/Cashier', 'Washer', 'Packing'];
            } else if (service.includes('ironing only')) {
                mandatoryDepts = ['Checker/Cashier', 'Ironing', 'Packing'];
            }
            
            const completedSet = completedDeptsMap[o.id] || new Set();
            const pendingDepts = mandatoryDepts.filter(d => !completedSet.has(d));
            
            return {
                orderId: o.id,
                customerName: o.customer_name,
                serviceType: o.service_type,
                status: o.status,
                orderDate: o.order_date,
                itemCount: parseInt(o.item_count || 0),
                mandatoryDepts,
                completedDepts: Array.from(completedSet),
                pendingDepts,
                hasPendingDiscrepancy: !!activeDiscrepanciesMap[o.id],
                discrepancyDetails: activeDiscrepanciesMap[o.id] || null
            };
        });
        
        res.json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// --- ORDER ACTIVITY LOG ENDPOINTS ---
// Get activity history logs for an order
app.get('/api/activity-logs/:orderId', async (req, res) => {
    const { orderId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM order_activity_logs WHERE order_id = $1 ORDER BY created_at DESC', [orderId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Add activity log entry for an order
app.post('/api/activity-logs', async (req, res) => {
    const { orderId, actorName, actorRole, actionType, details } = req.body;
    if (!orderId || !details) {
        return res.status(400).json({ error: 'Missing required log fields' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO order_activity_logs (order_id, actor_name, actor_role, action_type, details) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [orderId, actorName || 'Staff', actorRole || 'Staff', actionType || 'GENERAL', details]
        );
        res.json({ success: true, log: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Delete an activity log entry (Manager / Admin ONLY)
app.delete('/api/activity-logs/:id', async (req, res) => {
    const { id } = req.params;
    const { userRole } = req.body || {};
    if (userRole !== 'Manager') {
        return res.status(403).json({ error: 'Permission Denied: Only Managers/Admins can delete activity logs.' });
    }
    try {
        await pool.query('DELETE FROM order_activity_logs WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Initialize Database on boot
dbInitPromise = initDatabase().then(() => { dbInitialized = true; }).catch(console.error);

// Start server locally if not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export the Express API for Vercel Serverless
module.exports = app;
