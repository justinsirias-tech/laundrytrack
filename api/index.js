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

        await client.query('COMMIT');
        console.log('Database tables successfully initialized.');

        // Seed default clothing types if empty
        const typesCount = await pool.query('SELECT COUNT(*) FROM clothing_types');
        if (parseInt(typesCount.rows[0].count) === 0) {
            console.log('Seeding default clothing types into database...');
            for (const name of DEFAULT_CLOTHING_TYPES) {
                await pool.query('INSERT INTO clothing_types (name) VALUES ($1) ON CONFLICT DO NOTHING', [name]);
            }
        }

        // Seed default categories if empty
        const catsCount = await pool.query('SELECT COUNT(*) FROM item_categories');
        if (parseInt(catsCount.rows[0].count) === 0) {
            console.log('Seeding default categories and assignments into database...');
            for (const cat of DEFAULT_CATEGORIES) {
                await pool.query('INSERT INTO item_categories (id, name) VALUES ($1, $2)', [cat.id, cat.name]);
                for (const item of cat.items) {
                    await pool.query('INSERT INTO category_items (category_id, clothing_type) VALUES ($1, $2) ON CONFLICT DO NOTHING', [cat.id, item]);
                }
            }
        }

        // Seed default clothing brands
        console.log('Syncing default clothing brands in database...');
        for (const name of DEFAULT_CLOTHING_BRANDS) {
            await pool.query('INSERT INTO clothing_brands (name) VALUES ($1) ON CONFLICT DO NOTHING', [name]);
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
    try {
        const ordersRes = await pool.query('SELECT * FROM orders ORDER BY created_at ASC');
        const itemsRes = await pool.query('SELECT * FROM order_items');
        
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
                issueLevel: item.issue_level
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
        
        res.json(formattedOrders);
    } catch (err) {
        console.error(err);
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
                    'INSERT INTO order_items (order_id, type, brand, color, color_hex, issue_image, issue_level) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                    [id, item.type, item.brand, item.color, item.colorHex, item.issueImage, item.issueLevel]
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
        const result = await pool.query('SELECT name FROM clothing_types ORDER BY name ASC');
        res.json(result.rows.map(r => r.name));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 5. Add item to library
app.post('/api/clothing-types', async (req, res) => {
    const { name } = req.body;
    try {
        await pool.query('INSERT INTO clothing_types (name) VALUES ($1) ON CONFLICT DO NOTHING', [name]);
        res.status(201).json({ success: true });
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
            items: itemsMap[cat.id] || []
        }));
        
        res.json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 8. Create new category
app.post('/api/categories', async (req, res) => {
    const { id, name } = req.body;
    try {
        await pool.query('INSERT INTO item_categories (id, name) VALUES ($1, $2)', [id, name]);
        res.status(201).json({ success: true });
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
        res.json(result.rows.map(row => row.name));
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
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Initialize Database on boot
initDatabase().catch(console.error);

// Start server locally if not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export the Express API for Vercel Serverless
module.exports = app;
