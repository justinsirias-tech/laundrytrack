// Data Models
const statuses = ['Received', 'Wash & Dry', 'Ironing', 'Packing', 'Ready', 'Delivered'];

// Local Storage Keys
const STORAGE_KEY = 'tls_orders';

// Initial Mock Data
const defaultMockOrders = [
    {
        id: 'ORD-1001',
        customerName: 'Alice Johnson',
        phone: '+1 555-0101',
        items: [
            { type: 'Shirt', icon: '👕', brand: 'Zara', color: 'White', colorHex: '#ffffff', issueLevel: 'normal' },
            { type: 'Shirt', icon: '👕', brand: 'Zara', color: 'Blue', colorHex: '#3b82f6', issueLevel: 'normal' },
            { type: 'Pants', icon: '👖', brand: 'Levi', color: 'Black', colorHex: '#000000', issueLevel: 'normal' }
        ],
        serviceType: 'Wash & Fold',
        status: 'Received',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
    },
    {
        id: 'ORD-1002',
        customerName: 'Bob Smith',
        phone: '+1 555-0102',
        items: [
            { type: 'Jacket', icon: '🧥', brand: 'North Face', color: 'Black', colorHex: '#000000', issueLevel: 'normal' }
        ],
        serviceType: 'Dry Cleaning',
        status: 'Washing',
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0]
    },
    {
        id: 'ORD-1003',
        customerName: 'Charlie Brown',
        phone: '+1 555-0103',
        items: [
            { type: 'Bedding', icon: '🛏️', brand: '', color: 'White', colorHex: '#ffffff', issueLevel: 'normal' }
        ],
        serviceType: 'Wash & Fold',
        status: 'Drying',
        date: new Date(Date.now() - 259200000).toISOString().split('T')[0]
    },
    {
        id: 'ORD-1004',
        customerName: 'Diana Prince',
        phone: '+1 555-0104',
        items: [
            { type: 'Dress', icon: '👗', brand: 'Gucci', color: 'Red', colorHex: '#ef4444', issueLevel: 'normal' }
        ],
        serviceType: 'Premium Care',
        status: 'Ready',
        date: new Date(Date.now() - 345600000).toISOString().split('T')[0]
    }
];

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3001/api' : '/api';

// Current active data model fetched dynamically from PostgreSQL
let orders = [];
let clothingTypes = [];
let categories = [];
let clothingBrands = [];
let currentDraftItems = [];



// Localization Dictionary (English & Thai)
const i18n = {
    en: {
        dashboard: "Dashboard Overview",
        new_order: "New Order",
        tracking_board: "Tracking Board",
        admin_panel: "Admin Panel",
        manager: "Manager",
        
        search_placeholder: "Search orders, customers, or IDs...",
        
        total_orders: "Total Orders",
        in_progress: "In Progress",
        ready_pickup: "Ready for Pickup",
        delivered_today: "Delivered Today",
        recent_orders: "Recent Orders",
        view_all: "View All",
        order_id: "Order ID",
        customer: "Customer",
        service_type: "Service Type",
        status: "Status",
        date: "Date",
        action: "Action",
        
        register_title: "Register New Order",
        order_info: "1. Order Info",
        order_number: "Order Number",
        customer_name: "Customer Name",
        phone_number: "Phone Number",
        clear_btn: "Clear",
        submit_order: "Submit Order",
        add_item: "2. Add Item",
        select_clothing: "Select Clothing Type",
        or_custom_item: "Or Key In Custom Item Name (Auto-saves to standard list)",
        custom_item_placeholder: "e.g. Silk Scarf, Blanket",
        brand_optional: "Brand (Optional)",
        color: "Color",
        photo_optional: "Photo (Optional)",
        add_photo: "Add",
        no_image: "No image",
        issue_level: "Issue Level",
        normal: "Normal",
        issue: "Issue",
        extreme: "Extreme",
        add_item_btn: "Add Item",
        current_items: "3. Current Items",
        item: "Item",
        items_brand: "Brand",
        items_color: "Colour",
        items_defects: "Defects",
        items_qr: "QR Tag",
        items_action: "Action",
        item_service: "Item Service",
        same_as_order: "Same as Order",
        defect_optional: "Defect (Optional)",
        mixed_services: "Mixed Services",
        
        Received: "Received",
        "Wash & Dry": "Wash & Dry",
        Ironing: "Ironing",
        Packing: "Packing",
        Ready: "Ready for Delivery",
        Delivered: "Delivered",
        
        admin_settings: "Admin Settings",
        items_library: "1. Items Library",
        category_board: "2. Category Board",
        create_category: "Create Category",
        drag_assign: "Library Items (Drag to assign):",
        all_assigned: "All library items assigned.",
        drag_here: "Drag items here",
        no_categories: "No categories created. Use the form above.",
        
        order_details: "Order Details",
        date_submitted: "Date Submitted",
        items_list: "Items List",
        close: "Close",
        print_tag: "Print Tag",
        
        "Wash & Fold": "Wash & Fold",
        "Dry Cleaning": "Dry Cleaning",
        "Ironing Only": "Ironing Only",
        "Premium Care": "Premium Care",
        
        wash_fold: "Wash & Fold",
        dry_cleaning: "Dry Cleaning",
        ironing_only: "Ironing Only",
        wash_iron: "Wash & Iron",
        premium_care: "Premium Care"
    },
    th: {
        dashboard: "แผงควบคุมหลัก",
        new_order: "ลงทะเบียนออเดอร์",
        tracking_board: "กระดานติดตามสถานะ",
        admin_panel: "การตั้งค่าระบบ",
        manager: "ผู้จัดการ",
        
        search_placeholder: "ค้นหาออเดอร์, ลูกค้า, หรือรหัสออเดอร์...",
        
        total_orders: "ออเดอร์ทั้งหมด",
        in_progress: "กำลังดำเนินการ",
        ready_pickup: "พร้อมรับสินค้า",
        delivered_today: "ส่งมอบแล้ววันนี้",
        recent_orders: "ออเดอร์ล่าสุด",
        view_all: "ดูทั้งหมด",
        order_id: "รหัสออเดอร์",
        customer: "ลูกค้า",
        service_type: "ประเภทบริการ",
        status: "สถานะ",
        date: "วันที่",
        action: "การกระทำ",
        
        register_title: "ลงทะเบียนออเดอร์ใหม่",
        order_info: "1. ข้อมูลออเดอร์",
        order_number: "หมายเลขออเดอร์",
        customer_name: "ชื่อลูกค้า",
        phone_number: "เบอร์โทรศัพท์",
        clear_btn: "ล้างข้อมูล",
        submit_order: "ส่งออเดอร์",
        add_item: "2. เพิ่มรายการผ้า",
        select_clothing: "เลือกประเภทเสื้อผ้า",
        or_custom_item: "หรือพิมพ์ประเภทเอง (บันทึกอัตโนมัติลงรายการหลัก)",
        custom_item_placeholder: "เช่น ผ้าพันคอไหม, ผ้าห่ม",
        brand_optional: "แบรนด์ (ไม่บังคับ)",
        color: "สี",
        photo_optional: "รูปถ่าย (ไม่บังคับ)",
        add_photo: "เพิ่มรูป",
        no_image: "ไม่มีรูปถ่าย",
        issue_level: "ระดับความเสียหาย",
        normal: "ปกติ",
        issue: "มีตำหนิ",
        extreme: "ชำรุดรุนแรง",
        add_item_btn: "เพิ่มรายการผ้า",
        current_items: "3. รายการที่เพิ่มแล้ว",
        item: "รายการผ้า",
        items_brand: "แบรนด์",
        items_color: "สี",
        items_defects: "ตำหนิ",
        items_qr: "คิวอาร์แท็ก",
        items_action: "การกระทำ",
        item_service: "บริการเฉพาะชิ้น",
        same_as_order: "ตามออเดอร์หลัก",
        defect_optional: "ตำหนิ (ไม่บังคับ)",
        mixed_services: "บริการผสม",
        
        Received: "ได้รับผ้าแล้ว",
        "Wash & Dry": "ซักและอบแห้ง",
        Ironing: "กำลังรีด",
        Packing: "กำลังแพ็ค",
        Ready: "ซักเสร็จพร้อมส่ง",
        Delivered: "ส่งมอบสำเร็จ",
        
        admin_settings: "การตั้งค่าระบบ",
        items_library: "1. คลังรายการผ้ามาตรฐาน",
        category_board: "2. หมวดหมู่สินค้า",
        create_category: "สร้างหมวดหมู่",
        drag_assign: "รายการสินค้ามาตรฐาน (ลากไปใส่หมวดหมู่เพื่อจัดหมวดหมู่):",
        all_assigned: "จัดหมวดหมู่สินค้าครบแล้ว",
        drag_here: "ลากรายการมาวางที่นี่",
        no_categories: "ยังไม่ได้สร้างหมวดหมู่สินค้า กรุณาสร้างด้วยฟอร์มด้านบน",
        
        order_details: "รายละเอียดออเดอร์",
        date_submitted: "วันที่ทำรายการ",
        items_list: "รายการผ้าทั้งหมด",
        close: "ปิดหน้าต่าง",
        print_tag: "พิมพ์ป้ายแท็ก",
        
        "Wash & Fold": "ซักและพับ",
        "Dry Cleaning": "ซักแห้ง",
        "Ironing Only": "รีดเท่านั้น",
        "Premium Care": "ซักแห้งและดูแลพิเศษพรีเมียม",
        
        wash_fold: "ซักและพับ",
        dry_cleaning: "ซักแห้ง",
        ironing_only: "รีดเท่านั้น",
        wash_iron: "ซักและรีด",
        premium_care: "ดูแลพิเศษพรีเมียม"
    }
};

const itemTranslations = {
    'Shirt': 'เสื้อยืด',
    'Formal': 'เสื้อเชิ้ต',
    'Blouse': 'เสื้อสตรี',
    'Pants': 'กางเกงขายาว',
    'Shorts': 'กางเกงขาสั้น',
    'Underwear': 'กางเกงใน',
    'Dress': 'ชุดกระโปรง',
    'Jacket': 'เสื้อแจ็คเก็ต',
    'Socks': 'ถุงเท้า',
    'Shoes': 'รองเท้า',
    'Hat': 'หมวก',
    'Scarf': 'ผ้าพันคอ',
    'Gloves': 'ถุงมือ',
    'Bedding': 'เครื่องนอน',
    'Bag': 'กระเป๋า',
    'Neck Tie': 'เนคไท',
    'Overcoat': 'เสื้อโค้ท',
    'Suit': 'สูท',
    'Other': 'อื่นๆ'
};

const categoryTranslations = {
    'Tops': 'ท่อนบน',
    'Bottoms': 'ท่อนล่าง',
    'Accessories': 'เครื่องประดับ',
    'Bedding': 'เครื่องนอน'
};

const colorTranslations = {
    'White': 'ขาว',
    'Black': 'ดำ',
    'Blue': 'น้ำเงิน',
    'Navy': 'กรมท่า',
    'Red': 'แดง',
    'Green': 'เขียว',
    'Yellow': 'เหลือง',
    'Orange': 'ส้ม',
    'Purple': 'ม่วง',
    'Pink': 'ชมพู',
    'Grey': 'เทา',
    'Brown': 'น้ำตาล',
    'Teal': 'เขียวแกมน้ำเงิน',
    'Cream': 'ครีม',
    'Beige': 'เบจ',
    'Peach': 'พีช',
    'Khaki': 'กากี',
    'Olive': 'เขียวมะกอก',
    'Sky Blue': 'ฟ้า',
    'Burgundy': 'แดงเบอร์กันดี',
    'Black/White': 'ดำ/ขาว',
    'Blue/White': 'น้ำเงิน/ขาว',
    'Red/White': 'แดง/ขาว'
};

const translateColorName = (name) => {
    if (currentLanguage === 'th') {
        return colorTranslations[name] || name;
    }
    return name;
};

let currentLanguage = localStorage.getItem('tls_language') || 'en';

const t = (key) => {
    return (i18n[currentLanguage] && i18n[currentLanguage][key]) ? i18n[currentLanguage][key] : key;
};

const translateItemName = (name) => {
    if (currentLanguage === 'th') {
        return itemTranslations[name] || name;
    }
    return name;
};

const translateCategoryName = (name) => {
    if (currentLanguage === 'th') {
        return categoryTranslations[name] || name;
    }
    return name;
};

const applyTranslations = () => {
    // 1. Text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const translation = t(key);
        
        // Preserve nested elements (like icons) if they exist
        const icon = el.querySelector('i');
        if (icon) {
            // Keep the icon and just replace the text sibling
            el.innerHTML = '';
            el.appendChild(icon);
            el.appendChild(document.createTextNode(' ' + translation));
        } else {
            el.textContent = translation;
        }
    });
    
    // 2. Placeholder elements
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        el.placeholder = t(key);
    });
    
    // 3. Update toggle text
    const toggleText = document.getElementById('currentLangText');
    if (toggleText) {
        toggleText.textContent = currentLanguage.toUpperCase();
    }
};

// Utility functions
const getItemSvgIcon = (type, colorHex = 'currentColor', size = 24) => {
    let path = '';
    switch(type) {
        case 'Shirt': // T-shirt
            path = `<path d="M6 2L3 5v3c0 .5.5 1 1 1h2v11c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9h2c.5 0 1-.5 1-1V5l-3-3h-4a3 3 0 0 1-6 0H6z"/>`;
            break;
        case 'Formal': // Shirt with collar & tie
            path = `<path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l1.5 9A2 2 0 0 0 5.76 16H8v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-5h2.24a2 2 0 0 0 1.98-1.78l1.5-9a2 2 0 0 0-1.34-2.23z"/><path d="M12 2v6"/><path d="M9 6l3 2 3-2"/>`;
            break;
        case 'Blouse': // Feminine shirt/V-neck
            path = `<path d="M6 3L3 6v4h3v11h12V10h3V6l-3-3h-3.5a2.5 2.5 0 0 1-5 0H6z"/><path d="M12 5.5V13"/><path d="M9.5 8.5L12 11l2.5-2.5"/>`;
            break;
        case 'Pants': // Trouser legs
            path = `<path d="M8 2h8l3 3v17a1 1 0 0 1-1 1h-4.5a1 1 0 0 1-1-1v-9h-1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5l3-3z"/>`;
            break;
        case 'Shorts': // Shorts
            path = `<path d="M7 3h10l3 3v8a1 1 0 0 1-1 1h-4.5a1 1 0 0 1-1-1v-3h-1v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6l3-3z"/>`;
            break;
        case 'Underwear': // Underwear/briefs outline
            path = `<path d="M3 5h18v5c0 3-4.5 7.5-9 9-4.5-1.5-9-6-9-9V5z"/><path d="M3 10c4.5 1 9 1 18 0"/>`;
            break;
        case 'Dress': // Dress outline
            path = `<path d="M10 2L7 5v4l-3 11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1L17 9V5l-3-3h-4z"/><path d="M10 2a2 2 0 0 0 4 0"/>`;
            break;
        case 'Jacket': // Jacket zipper open
            path = `<path d="M6 2L3 5v5a3 3 0 0 0 3 3h1.5v7a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-7H18a3 3 0 0 0 3-3V5l-3-3H6z"/><path d="M12 2v18"/><path d="M9 6h6"/>`;
            break;
        case 'Socks': // L-shaped sock
            path = `<path d="M8 3h6v9a4 4 0 0 1 4 4v3a2 2 0 0 1-2 2h-4a4 4 0 0 1-4-4V3z"/>`;
            break;
        case 'Shoes': // Sneaker/shoe outline
            path = `<path d="M3 13a2 2 0 0 1 2-2h4l4-5a2 2 0 0 1 2 0l6 3a2 2 0 0 1 1 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3z"/>`;
            break;
        case 'Hat': // Cap with visor
            path = `<path d="M2 17h16c2 0 4-1.5 4-3.5S20 10 18 10h-2V7c0-2.8-2.2-5-5-5S6 4.2 6 7v3H4c-2 0-2 3.5-2 7z"/><path d="M6 10c0-1.5 3-3 6-3s6 1.5 6 3"/>`;
            break;
        case 'Scarf': // Scarf loops
            path = `<path d="M6 4h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M8 12v8"/><path d="M12 12v8"/><path d="M16 12v6"/>`;
            break;
        case 'Gloves': // Glove/hand outline
            path = `<path d="M5 10v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1.5V4.5a1.5 1.5 0 0 0-3 0V8h-1V3.5a1.5 1.5 0 0 0-3 0V8h-1V4.5a1.5 1.5 0 0 0-3 0V8H7a2 2 0 0 0-2 2z"/>`;
            break;
        case 'Bedding': // Bed frame/sheet
            path = `<path d="M2 4h20v14H2z"/><path d="M6 7h4v4H6z"/><path d="M2 11h20"/>`;
            break;
        case 'Bag': // Bag with handle
            path = `<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>`;
            break;
        case 'Neck Tie': // Necktie outline
            path = `<path d="M9 3h6l1.5 3L14 19l-2 3-2-3-2.5-13L9 3z"/><path d="M9 3l3 2 3-2"/>`;
            break;
        case 'Overcoat': // Trench coat outline
            path = `<path d="M6 2L3 5v8h2.5v9h13v-9H21V5l-3-3H6z"/><path d="M12 2v20"/><path d="M8 6h8"/>`;
            break;
        case 'Suit': // Suit lapel blazer jacket
            path = `<path d="M4 3h16v18H4V3z"/><path d="M8 3l4 6 4-6"/><path d="M12 9v12"/>`;
            break;
        default: // Package box
            path = `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>`;
    }
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${colorHex}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="clothing-svg-icon" data-type="${type}">${path}</svg>`;
};

const generateId = () => {
    const lastId = orders.length > 0 ? parseInt(orders[orders.length-1].id.split('-')[1]) : 1000;
    return `ORD-${lastId + 1}`;
};

const getStatusColorClass = (status) => {
    switch(status) {
        case 'Received': return 'text-blue';
        case 'Washing': return 'text-purple';
        case 'Drying': return 'text-orange';
        case 'Ready': return 'text-green';
        case 'Delivered': return 'text-gray';
        default: return 'text-gray';
    }
};

const showToast = (message, type = 'info') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = 'info';
    if(type === 'success') icon = 'check-circle';
    
    toast.innerHTML = `<i data-lucide="${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    lucide.createIcons();
    
    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

const printQrCode = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    let appUrl;
    if (window.location.protocol === 'file:') {
        appUrl = `https://your-deployed-domain.com/?search=${order.id}`;
    } else {
        appUrl = `${window.location.origin}${window.location.pathname}?search=${order.id}`;
    }
    const qrData = encodeURIComponent(appUrl);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Print Tag - ${order.id}</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 20px; }
                    .tag { border: 2px dashed #000; display: inline-block; padding: 30px; width: 300px; }
                    h2 { margin: 0 0 10px 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; }
                    p { margin: 8px 0; font-size: 18px; }
                    .meta { font-size: 14px; color: #555; margin-top: 15px; }
                    img { margin-top: 20px; width: 150px; height: 150px; border: 1px solid var(--border-glass); padding: 5px; }
                    @media print {
                        @page { margin: 0; }
                        body { padding: 0; margin: 20px; }
                    }
                </style>
            </head>
            <body>
                <div class="tag">
                    <h2>TLS Tracking</h2>
                    <p><strong>${order.id}</strong></p>
                    <p>${order.customerName}</p>
                    <p style="font-weight: bold; font-size: 20px;">${order.serviceType}</p>
                    <img src="${qrUrl}" onload="window.print();" />
                    <div class="meta">Date: ${order.date}</div>
                </div>
                <script>
                    window.onafterprint = function() { window.close(); };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
};

const printItemQrCode = (trackingId, itemName) => {
    let appUrl;
    if (window.location.protocol === 'file:') {
        appUrl = `https://your-deployed-domain.com/?search=${trackingId}`;
    } else {
        appUrl = `${window.location.origin}${window.location.pathname}?search=${trackingId}`;
    }
    const qrData = encodeURIComponent(appUrl);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Print Item Tag - ${trackingId}</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 20px; }
                    .tag { border: 2px dashed #000; display: inline-block; padding: 30px; width: 300px; }
                    h2 { margin: 0 0 10px 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; }
                    p { margin: 8px 0; font-size: 18px; }
                    img { margin-top: 20px; width: 150px; height: 150px; border: 1px solid var(--border-glass); padding: 5px; }
                    @media print {
                        @page { margin: 0; }
                        body { padding: 0; margin: 20px; }
                    }
                </style>
            </head>
            <body>
                <div class="tag">
                    <h2>TLS Tracking</h2>
                    <p style="font-weight: bold; font-size: 20px;">${trackingId}</p>
                    <p>${itemName}</p>
                    <img src="${qrUrl}" onload="window.print();" />
                </div>
                <script>
                    window.onafterprint = function() { window.close(); };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
};

// UI Updaters
const updateDashboardStats = () => {
    const statsGrid = document.querySelector('.stats-grid');
    if (!statsGrid) return;
    
    const stats = [
        { title: currentLanguage === 'th' ? 'ออเดอร์ค้างส่งทั้งหมด' : 'Total Active', value: orders.filter(o => o.status !== 'Delivered').length, icon: 'list', bg: 'var(--status-blue)' },
        { title: currentLanguage === 'th' ? 'กำลังซัก/อบ' : 'In Wash & Dry', value: orders.filter(o => o.status === 'Wash & Dry').length, icon: 'waves', bg: 'var(--status-purple)' },
        { title: t('Ready'), value: orders.filter(o => o.status === 'Ready').length, icon: 'check-square', bg: 'var(--status-green)' },
        { title: currentLanguage === 'th' ? 'ส่งมอบแล้วทั้งหมด' : 'Delivered (All Time)', value: orders.filter(o => o.status === 'Delivered').length, icon: 'truck', bg: 'var(--status-gray)' }
    ];
    
    statsGrid.innerHTML = stats.map(stat => `
        <div class="stat-card glass-panel">
            <div class="stat-icon" style="background: ${stat.bg}">
                <i data-lucide="${stat.icon}"></i>
            </div>
            <div class="stat-info">
                <h4>${stat.title}</h4>
                <div class="value">${stat.value}</div>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
};

const updateRecentOrdersTable = () => {
    const tbody = document.getElementById('recent-orders-body');
    if (!tbody) return;
    const recentOrders = [...orders].filter(o => o.status !== 'Delivered').reverse().slice(0, 5); // show last 5 active
    
    if (recentOrders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">${currentLanguage === 'th' ? 'ยังไม่มีออเดอร์ที่กำลังดำเนินการ' : 'No active orders yet.'}</td></tr>`;
        return;
    }
    
    tbody.innerHTML = recentOrders.map(order => `
        <tr style="cursor: pointer;" data-id="${order.id}">
            <td><strong>${order.id}</strong></td>
            <td>${order.customerName}</td>
            <td>${t(order.serviceType)}</td>
            <td><span class="status-badge ${getStatusColorClass(order.status)}">${t(order.status)}</span></td>
            <td>${order.date}</td>
            <td><button class="icon-btn" style="width:30px;height:30px;"><i data-lucide="chevron-right"></i></button></td>
        </tr>
    `).join('');
    
    lucide.createIcons();
};

const updateCompletedOrdersTable = () => {
    const tbody = document.getElementById('completed-orders-body');
    if (!tbody) return;
    const completedOrders = [...orders].filter(o => o.status === 'Delivered').reverse();
    
    if (completedOrders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">${currentLanguage === 'th' ? 'ยังไม่มีออเดอร์ที่ส่งมอบแล้ว' : 'No completed orders yet.'}</td></tr>`;
        return;
    }
    
    // Group by month
    const grouped = {};
    completedOrders.forEach(o => {
        const monthYear = o.date ? o.date.substring(0, 7) : 'Unknown';
        if (!grouped[monthYear]) grouped[monthYear] = [];
        grouped[monthYear].push(o);
    });
    
    let html = '';
    const sortedMonths = Object.keys(grouped).sort().reverse();
    sortedMonths.forEach(month => {
        const monthOrders = grouped[month];
        let monthName = month;
        if (month !== 'Unknown') {
            const dateObj = new Date(month + '-01');
            monthName = dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });
        }
        
        html += `<tr style="background: var(--bg-glass-hover);"><td colspan="6" style="font-weight: 700; color: var(--primary); font-size: 1.05rem; padding: 0.75rem 1rem;">${monthName} <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 0.5rem;">(${monthOrders.length} orders)</span></td></tr>`;
        
        html += monthOrders.map(order => `
            <tr style="cursor: pointer;" data-id="${order.id}">
                <td><strong>${order.id}</strong></td>
                <td>${order.customerName}</td>
                <td>${t(order.serviceType)}</td>
                <td><span class="status-badge ${getStatusColorClass(order.status)}">${t(order.status)}</span></td>
                <td>${order.date}</td>
                <td><button class="icon-btn" style="width:30px;height:30px;"><i data-lucide="chevron-right"></i></button></td>
            </tr>
        `).join('');
    });
    
    tbody.innerHTML = html;
    lucide.createIcons();
};

const updateKanbanBoard = () => {
    statuses.forEach(status => {
        const column = document.querySelector(`.kanban-column[data-status="${status}"] .kanban-cards`);
        if(!column) return;
        
        const columnOrders = orders.filter(o => o.status === status);
        
        column.innerHTML = columnOrders.map(order => {
            const totalItemsText = currentLanguage === 'th'
                ? `${order.items.length} รายการ`
                : `${order.items.length} ${order.items.length === 1 ? 'item' : 'items'}`;
            
            // Generate a scannable URL for phone cameras
            let appUrl;
            if (window.location.protocol === 'file:') {
                appUrl = `https://your-deployed-domain.com/?search=${order.id}`;
            } else {
                appUrl = `${window.location.origin}${window.location.pathname}?search=${order.id}`;
            }
            
            const qrData = encodeURIComponent(appUrl);
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${qrData}`;
            return `
            <div class="kanban-card" draggable="true" data-id="${order.id}">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; border-bottom: 1px solid rgba(34, 41, 69, 0.05); padding-bottom: 0.4rem;">
                    <span class="card-id" style="font-size: 0.85rem; font-weight: 700; color: var(--primary);">#${order.id}</span>
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                        <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 600;">${order.date}</span>
                        <i data-lucide="grip-horizontal" style="color: var(--text-muted); width: 14px; height: 14px;"></i>
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; margin-bottom: 0.6rem;">
                    <div style="display: flex; flex-direction: column; gap: 0.25rem; overflow: hidden; width: 100%;">
                        <div class="card-title" style="margin: 0; font-size: 1.05rem; font-weight: 700; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${order.customerName}</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                            <span class="service-type-badge" style="font-size: 0.7rem; color: #fff; background: var(--primary); padding: 0.15rem 0.45rem; border-radius: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; white-space: nowrap;">
                                ${t(order.serviceType)}
                            </span>
                        </div>
                    </div>
                    <img src="${qrUrl}" alt="QR" style="cursor: pointer; width: 44px; height: 44px; border-radius: 6px; padding: 2px; background: white; border: 1px solid var(--border-glass); flex-shrink: 0;" title="Click to print QR Tag" draggable="false" />
                </div>
                
                <div style="border-top: 1px dashed rgba(34, 41, 69, 0.1); padding-top: 0.5rem; display: flex; flex-direction: column; gap: 0.15rem;">
                    <div style="font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 0.5px;">Items</div>
                    <div class="card-items-list" style="font-size: 0.85rem; font-weight: 600; color: var(--text-main);">
                        ${totalItemsText}
                    </div>
                </div>
            </div>
        `}).join('');
    });
    
    lucide.createIcons();
    setupDragAndDrop();
};

const refreshAllViews = () => {
    updateDashboardStats();
    updateRecentOrdersTable();
    updateCompletedOrdersTable();
    updateKanbanBoard();
};

// Navigation
document.querySelectorAll('.nav-item').forEach(button => {
    button.addEventListener('click', () => {
        const viewId = button.dataset.view;
        // Update active nav across both desktop sidebar and mobile bottom nav
        document.querySelectorAll('.nav-item').forEach(b => {
            if (b.dataset.view === viewId) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });
        
        // Show correct view
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const targetView = document.getElementById(`${viewId}-view`);
        if (targetView) targetView.classList.add('active');
    });
});

// Form Builder Logic
let selectedItemType = { type: 'Shirt' };
let selectedColor = { name: 'Black', hex: '#000000' };
let activeCategoryName = 'Tops';

// Initialize clothing buttons dynamically inside the builder on load or updates (tabbed navigation)
const initItemTypeButtons = () => {
    const tabsContainer = document.getElementById('categoryTabs');
    const garmentsGrid = document.getElementById('builderGarmentsGrid');
    if (!tabsContainer || !garmentsGrid) return;
    
    // Sort categories alphabetically
    const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
    
    // Fallback if activeCategoryName is no longer valid
    if (sortedCategories.length > 0 && !sortedCategories.some(c => c.name === activeCategoryName) && activeCategoryName !== 'Unassigned') {
        activeCategoryName = sortedCategories[0].name;
    }
    
    // Render Category tabs
    let tabsHtml = sortedCategories.map(cat => {
        const isActive = cat.name === activeCategoryName ? 'active' : '';
        return `<button type="button" class="builder-tab ${isActive}" data-cat-name="${cat.name}">${translateCategoryName(cat.name)}</button>`;
    }).join('');
    
    // Check if we have unassigned library items to display a "Library" tab
    const assignedItems = new Set();
    categories.forEach(cat => {
        if (cat.items) {
            cat.items.forEach(item => assignedItems.add(item));
        }
    });
    const unassignedItems = clothingTypes.filter(item => !assignedItems.has(item));
    
    if (unassignedItems.length > 0) {
        const isUnassignedActive = activeCategoryName === 'Unassigned' ? 'active' : '';
        tabsHtml += `<button type="button" class="builder-tab ${isUnassignedActive}" data-cat-name="Unassigned">${currentLanguage === 'th' ? 'ทั่วไป' : 'Library'}</button>`;
    }
    
    tabsContainer.innerHTML = tabsHtml;
    
    // Bind click handlers to tabs
    if (typeof tabsContainer.querySelectorAll === 'function') {
        tabsContainer.querySelectorAll('.builder-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                activeCategoryName = tab.dataset.catName;
                initItemTypeButtons(); // Re-render tabs and garments grid
            });
        });
    }
    
    // Determine active item list
    let activeGarments = [];
    if (activeCategoryName === 'Unassigned') {
        activeGarments = unassignedItems;
    } else {
        const activeCat = sortedCategories.find(c => c.name === activeCategoryName);
        if (activeCat) {
            activeGarments = (activeCat.items || []).filter(item => clothingTypes.includes(item));
        }
    }
    
    activeGarments.sort((a, b) => a.localeCompare(b));
    
    let html = '';
    if (activeGarments.length > 0) {
        // Fallback active item check
        if (!activeGarments.includes(selectedItemType.type)) {
            selectedItemType = { type: activeGarments[0] };
        }
        
        html = activeGarments.map(type => {
            const isActive = type === selectedItemType.type ? 'active' : '';
            return `<button type="button" class="item-type-btn ${isActive}" data-type="${type}" title="${type}">${translateItemName(type)}</button>`;
        }).join('');
    }
    
    garmentsGrid.innerHTML = html || `<div style="color: var(--text-muted); padding: 1.5rem; text-align: center; grid-column: span 5;">${currentLanguage === 'th' ? 'ไม่มีรายการในหมวดหมู่นี้' : 'No items in this category.'}</div>`;
    
    // Bind click events to the garment buttons
    if (typeof garmentsGrid.querySelectorAll === 'function') {
        garmentsGrid.querySelectorAll('.item-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                garmentsGrid.querySelectorAll('.item-type-btn').forEach(b => {
                    b.classList.remove('active');
                    b.style.color = '';
                    b.style.borderColor = '';
                });
                btn.classList.add('active');
                selectedItemType = { type: btn.dataset.type };
                updateActiveItemIconColor();
            });
        });
    }
    
    // Apply selected color to the active button
    setTimeout(updateActiveItemIconColor, 50);
};

const brandDomains = {
    'Adidas': 'adidas.com',
    'Balenciaga': 'balenciaga.com',
    'Baleno': 'baleno.com.hk',
    'Bossini': 'bossini.com',
    'Calvin Klein': 'calvinklein.com',
    'Champion': 'championstore.com',
    'Chanel': 'chanel.com',
    'Converse': 'converse.com',
    'Dior': 'dior.com',
    'Fila': 'fila.com',
    'G2000': 'g2000.com.hk',
    'Giordano': 'giordano.com',
    'Gucci': 'gucci.com',
    'H&M': 'hm.com',
    'Lacoste': 'lacoste.com',
    'Levi\'s': 'levi.com',
    'Louis Vuitton': 'louisvuitton.com',
    'Nike': 'nike.com',
    'Off-White': 'off---white.com',
    'Prada': 'prada.com',
    'Puma': 'puma.com',
    'Ralph Lauren': 'ralphlauren.com',
    'Supreme': 'supremenewyork.com',
    'Tommy Hilfiger': 'tommy.com',
    'Under Armour': 'underarmour.com',
    'Uniqlo': 'uniqlo.com',
    'Vans': 'vans.com',
    'Zara': 'zara.com',
    'Burberry': 'burberry.com',
    'Moncler': 'moncler.com',
    'Saint Laurent': 'ysl.com',
    'Fendi': 'fendi.com',
    'Patagonia': 'patagonia.com',
    'The North Face': 'thenorthface.com',
    'New Balance': 'newbalance.com',
    'Reebok': 'reebok.com',
    'Guess': 'guess.com',
    'Diesel': 'diesel.com',
    'GAP': 'gap.com',
    'Forever 21': 'forever21.com',
    'Mango': 'mango.com',
    'Bape': 'bape.com',
    'Stussy': 'stussy.com',
    'Versace': 'versace.com',
    'Hermès': 'hermes.com',
    'Armani': 'armani.com',
    'Givenchy': 'givenchy.com',
    'Valentino': 'valentino.com',
    'Dolce & Gabbana': 'dolcegabbana.com',
    'Kenzo': 'kenzo.com',
    'Asics': 'asics.com',
    'Superdry': 'superdry.com',
    'Massimo Dutti': 'massimodutti.com'
};

const initBrandButtons = () => {
    const container = document.querySelector('.brand-quick-select');
    if (!container) return;
    
    const searchInput = document.getElementById('brandSearchInput');
    const filterTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    
    // Sort brands alphabetically
    let sortedBrands = [...clothingBrands].sort((a, b) => a.name.localeCompare(b.name));
    
    // Filter by search term
    if (filterTerm) {
        sortedBrands = sortedBrands.filter(b => b.name.toLowerCase().includes(filterTerm));
    }
    
    const activeBrand = document.getElementById('itemBrand') ? document.getElementById('itemBrand').value.trim() : '';
    
    container.innerHTML = sortedBrands.map(brandObj => {
        const brand = brandObj.name;
        const isActive = brand.toLowerCase() === activeBrand.toLowerCase() ? 'active' : '';
        const logoUrl = brandObj.logo_url || `https://www.google.com/s2/favicons?domain=${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com&sz=128`;
        
        return `
        <button type="button" class="brand-pill-btn ${isActive}" data-brand="${brand}" title="${brand}" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.2rem; min-height: 68px; height: auto; padding: 0.35rem 0.25rem;">
            <img class="brand-logo-img" src="${logoUrl}" alt="${brand}" style="max-height: 32px; max-width: 85%; object-fit: contain; filter: grayscale(100%); opacity: 0.8; transition: var(--transition);" onerror="this.style.display='none';">
            <span class="brand-btn-text" style="font-size: 0.72rem; font-weight: 600; line-height: 1.1; color: var(--text-main); margin-top: 0.1rem; text-align: center;">${brand}</span>
        </button>
        `;
    }).join('');
    
    // Re-bind click event handlers for the newly rendered brand buttons
    if (typeof container.querySelectorAll === 'function') {
        container.querySelectorAll('.brand-pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const brand = btn.dataset.brand;
                const brandInput = document.getElementById('itemBrand');
                if (brandInput) {
                    if (btn.classList.contains('active')) {
                        btn.classList.remove('active');
                        brandInput.value = '';
                    } else {
                        container.querySelectorAll('.brand-pill-btn').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        brandInput.value = brand;
                    }
                }
            });
        });
    }
};

// Utility to color the active item icon in the builder
const updateActiveItemIconColor = () => {
    const activeBtn = document.querySelector('.item-type-btn.active');
    if (activeBtn) {
        activeBtn.style.color = selectedColor.hex;
        activeBtn.style.borderColor = selectedColor.hex;
    }
};

const renderActiveColorCheckmark = () => {
    document.querySelectorAll('.color-swatch').forEach(s => {
        if (s.classList.contains('active')) {
            const isLight = s.dataset.color === 'White' || s.dataset.color === 'Cream' || s.dataset.color === 'Beige' || s.dataset.color === 'Yellow' || s.dataset.color === 'Khaki';
            s.innerHTML = `<i data-lucide="check" style="width: 22px; height: 22px; color: ${isLight ? '#000000' : '#FFFFFF'}; font-weight: bold;"></i>`;
        } else {
            s.innerHTML = '';
        }
    });
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
};

let isMixMode = false;
let mixColorSelections = [];

const bindSwatchClick = (swatch) => {
    swatch.addEventListener('click', (e) => {
        const swatchColorName = swatch.dataset.color;
        const swatchColorHex = swatch.style.backgroundColor || swatch.style.background;
        
        if (isMixMode) {
            // Toggle active state
            if (swatch.classList.contains('active')) {
                swatch.classList.remove('active');
                swatch.innerHTML = '';
                mixColorSelections = mixColorSelections.filter(c => c.name !== swatchColorName);
            } else {
                swatch.classList.add('active');
                mixColorSelections.push({ name: swatchColorName, hex: swatchColorHex });
            }
            
            renderActiveColorCheckmark();
            
            // Recalculate mixed color
            if (mixColorSelections.length === 0) {
                selectedColor = { name: 'Black', hex: '#000000' };
            } else if (mixColorSelections.length === 1) {
                selectedColor = mixColorSelections[0];
            } else {
                // Combine names: e.g. "Red/Blue/Yellow"
                const combinedName = mixColorSelections.map(c => c.name).join('/');
                // Build CSS gradient string:
                // linear-gradient(135deg, col1 0% 50%, col2 50% 100%) etc.
                const segments = mixColorSelections.length;
                const gradientParts = mixColorSelections.map((c, idx) => {
                    const startPercent = ((idx * 100) / segments).toFixed(1);
                    const endPercent = (((idx + 1) * 100) / segments).toFixed(1);
                    return `${c.hex} ${startPercent}% ${endPercent}%`;
                });
                const combinedGradient = `linear-gradient(135deg, ${gradientParts.join(', ')})`;
                
                selectedColor = { name: combinedName, hex: combinedGradient };
            }
            
            updateActiveItemIconColor();
        } else {
            // Normal Single Color Selection
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            renderActiveColorCheckmark();
            selectedColor = { name: swatchColorName, hex: swatchColorHex };
            updateActiveItemIconColor();
        }
    });
};

document.querySelectorAll('.color-swatch').forEach(swatch => {
    bindSwatchClick(swatch);
});

const customColorInput = document.getElementById('customColorInput');
const customColorWrapper = document.querySelector('.custom-color-wrapper');
if (customColorInput && customColorWrapper) {
    customColorInput.addEventListener('input', (e) => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        customColorWrapper.classList.add('active');
        selectedColor = { name: e.target.value.toUpperCase(), hex: e.target.value };
        updateActiveItemIconColor();
    });
    
    customColorInput.addEventListener('click', (e) => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        customColorWrapper.classList.add('active');
        selectedColor = { name: e.target.value.toUpperCase(), hex: e.target.value };
        updateActiveItemIconColor();
    });

    // Add new color to color bar dynamically when selection is finalized
    customColorInput.addEventListener('change', (e) => {
        const customColor = e.target.value;
        const colorName = customColor.toUpperCase();
        
        // Check if color swatch already exists
        let existingSwatch = Array.from(document.querySelectorAll('.color-swatch')).find(
            s => s.dataset.color.toLowerCase() === colorName.toLowerCase() || s.style.background === customColor
        );
        
        if (existingSwatch) {
            existingSwatch.click();
        } else {
            // Create a new swatch
            const newSwatch = document.createElement('button');
            newSwatch.type = 'button';
            newSwatch.className = 'color-swatch active';
            newSwatch.style.background = customColor;
            newSwatch.dataset.color = colorName;
            newSwatch.title = colorName;
            
            // Bind click behavior
            bindSwatchClick(newSwatch);
            
            // Insert it before custom color picker wrapper
            customColorWrapper.parentNode.insertBefore(newSwatch, customColorWrapper);
            
            // Select it
            newSwatch.click();
        }
    });
}

let selectedImageBase64 = null;
let selectedIssueLevel = 'normal';

// Issue Level Selector listener
document.querySelectorAll('.issue-level-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.issue-level-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedIssueLevel = btn.dataset.level;
    });
});

// Multiple image upload handler
let selectedImagesArray = [];
let selectedDefectImagesArray = [];
const imageInput = document.getElementById('itemImage');
const imageDropZone = document.getElementById('imageDropZone');
const imageThumbnailsContainer = document.getElementById('imageThumbnailsContainer');

const defectImageInput = document.getElementById('defectImage');
const defectDropZone = document.getElementById('defectDropZone');
const defectThumbnailsContainer = document.getElementById('defectThumbnailsContainer');

const renderUploadedThumbnails = () => {
    if (imageThumbnailsContainer) {
        if (selectedImagesArray.length === 0) {
            imageThumbnailsContainer.innerHTML = '<span id="noPhotosText" style="font-size: 0.75rem; color: #94a3b8; font-style: italic; width: 100%; text-align: center;">No photos</span>';
        } else {
            imageThumbnailsContainer.innerHTML = selectedImagesArray.map((base64, idx) => `
                <div class="thumbnail-wrapper" style="position: relative; width: 60px; height: 60px; flex-shrink: 0; border-radius: 8px; border: 1px solid var(--border-glass); overflow: hidden; animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
                    <img src="${base64}" style="width: 100%; height: 100%; object-fit: cover;">
                    <button type="button" class="delete-thumb-btn" data-index="${idx}" data-type="photo" style="position: absolute; top: 4px; right: 4px; width: 16px; height: 16px; border-radius: 50%; border: none; background: rgba(0, 0, 0, 0.6); color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; cursor: pointer; line-height: 1;">&times;</button>
                </div>
            `).join('');
        }
    }
    
    if (defectThumbnailsContainer) {
        if (selectedDefectImagesArray.length === 0) {
            defectThumbnailsContainer.innerHTML = '<span id="noDefectText" style="font-size: 0.75rem; color: #94a3b8; font-style: italic; width: 100%; text-align: center;">No defects</span>';
        } else {
            defectThumbnailsContainer.innerHTML = selectedDefectImagesArray.map((base64, idx) => `
                <div class="thumbnail-wrapper" style="position: relative; width: 60px; height: 60px; flex-shrink: 0; border-radius: 8px; border: 1px solid var(--border-glass); overflow: hidden; animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
                    <img src="${base64}" style="width: 100%; height: 100%; object-fit: cover;">
                    <button type="button" class="delete-thumb-btn" data-index="${idx}" data-type="defect" style="position: absolute; top: 4px; right: 4px; width: 16px; height: 16px; border-radius: 50%; border: none; background: rgba(0, 0, 0, 0.6); color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; cursor: pointer; line-height: 1;">&times;</button>
                </div>
            `).join('');
        }
    }

    // Bind click events to delete buttons
    document.querySelectorAll('.delete-thumb-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            if (btn.dataset.type === 'photo') {
                selectedImagesArray.splice(idx, 1);
            } else {
                selectedDefectImagesArray.splice(idx, 1);
            }
            renderUploadedThumbnails();
        });
    });
};

const compressImage = (file, maxWidth, maxHeight, quality, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
                if (width > maxWidth) {
                    height = Math.round(height *= maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = Math.round(width *= maxHeight / height);
                    height = maxHeight;
                }
            }
            
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            callback(compressedBase64);
        };
    };
};

const handleUploadedFiles = (files, type = 'photo') => {
    if (!files) return;
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            compressImage(file, 800, 800, 0.7, (compressedBase64) => {
                if (type === 'photo') {
                    selectedImagesArray.push(compressedBase64);
                } else {
                    selectedDefectImagesArray.push(compressedBase64);
                }
                renderUploadedThumbnails();
            });
        }
    });
};

const setupDropZone = (dropZone, inputElement, type) => {
    if (!dropZone || !inputElement) return;
    dropZone.addEventListener('click', () => { inputElement.click(); });
    inputElement.addEventListener('change', (e) => {
        handleUploadedFiles(e.target.files, type);
        inputElement.value = '';
    });
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--primary)';
        dropZone.style.background = 'rgba(99, 102, 241, 0.04)';
    });
    ['dragleave', 'dragend', 'drop'].forEach(evtName => {
        dropZone.addEventListener(evtName, () => {
            dropZone.style.borderColor = '';
            dropZone.style.background = '';
        });
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        handleUploadedFiles(e.dataTransfer.files, type);
    });
};

setupDropZone(imageDropZone, imageInput, 'photo');
setupDropZone(defectDropZone, defectImageInput, 'defect');

// Copy & Paste Listener
document.addEventListener('paste', (e) => {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') && activeElement.type !== 'file') {
        return;
    }
    
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    let imageFound = false;
    for (let item of items) {
        if (item.kind === 'file' && item.type.startsWith('image/')) {
            const file = item.getAsFile();
            handleUploadedFiles([file]);
            imageFound = true;
        }
    }
    if (imageFound) {
        e.preventDefault();
    }
});

// --- CAMERA LOGIC ---
let cameraStream = null;
let currentCameraTarget = 'photo';
window.startCamera = async (target = 'photo') => {
    currentCameraTarget = target;
    const cameraModal = document.getElementById('cameraModal');
    const video = document.getElementById('cameraVideo');
    if (!cameraModal || !video) return;
    
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = cameraStream;
        cameraModal.classList.add('active');
    } catch (err) {
        console.error('Error accessing camera:', err);
        showToast('Unable to access camera. Please check permissions.', 'error');
    }
};

const stopCamera = () => {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
    const cameraModal = document.getElementById('cameraModal');
    if (cameraModal) cameraModal.classList.remove('active');
};

const capturePhotoBtn = document.getElementById('capturePhotoBtn');
const closeCameraBtn = document.getElementById('closeCameraBtn');
if (closeCameraBtn) closeCameraBtn.addEventListener('click', stopCamera);
if (capturePhotoBtn) {
    capturePhotoBtn.addEventListener('click', () => {
        const video = document.getElementById('cameraVideo');
        const canvas = document.getElementById('cameraCanvas');
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
                    handleUploadedFiles([file], currentCameraTarget);
                    stopCamera();
                }
            }, 'image/jpeg', 0.8);
        }
    });
}

const getQrUrlForOrder = (orderId) => {
    let appUrl;
    if (window.location.protocol === 'file:') {
        appUrl = `https://your-deployed-domain.com/?search=${orderId}`;
    } else {
        appUrl = `${window.location.origin}${window.location.pathname}?search=${orderId}`;
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(appUrl)}`;
};

const updateDraftQRIds = () => {
    const orderId = document.getElementById('orderId').value.trim() || 'DRAFT';
    document.querySelectorAll('.item-qr-code').forEach(img => {
        img.src = getQrUrlForOrder(orderId);
    });
};

const renderAddedItems = () => {
    const listContainer = document.getElementById('addedItemsList');
    const itemCountSpan = document.getElementById('itemCount');
    if (!listContainer || !itemCountSpan) return;
    
    itemCountSpan.innerText = currentDraftItems.length;
    
    if (currentDraftItems.length === 0) {
        listContainer.innerHTML = `<div class="empty-cart-placeholder">${currentLanguage === 'th' ? 'ไม่มีรายการในออเดอร์' : 'No items added yet.'}</div>`;
        return;
    }

    const standardColors = [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#000000' },
        { name: 'Blue', hex: '#3b82f6' },
        { name: 'Navy', hex: '#1e3a8a' },
        { name: 'Red', hex: '#ef4444' },
        { name: 'Green', hex: '#22c55e' },
        { name: 'Yellow', hex: '#f59e0b' },
        { name: 'Orange', hex: '#f97316' },
        { name: 'Purple', hex: '#8b5cf6' },
        { name: 'Pink', hex: '#ec4899' },
        { name: 'Grey', hex: '#9ca3af' },
        { name: 'Brown', hex: '#78350f' },
        { name: 'Teal', hex: '#14b8a6' }
    ];
    
    listContainer.innerHTML = currentDraftItems.map((item, index) => {
        let levelBadge = `<span class="issue-badge issue-badge-normal">${t('normal')}</span>`;
        if (item.issueLevel === 'issue') {
            levelBadge = `<span class="issue-badge issue-badge-warning">${t('issue')}</span>`;
        } else if (item.issueLevel === 'extreme') {
            levelBadge = `<span class="issue-badge issue-badge-extreme">${t('extreme')}</span>`;
        }
        
        // Handle single image string vs JSON array string gracefully
        let photoThumbnail = '';
        if (item.issueImage) {
            if (item.issueImage.startsWith('[')) {
                try {
                    const imgs = JSON.parse(item.issueImage);
                    photoThumbnail += imgs.map(img => `<img src="${img}" class="issue-image" style="width: 28px; height: 28px; border-radius: 4px; border: 1px solid var(--border-glass); cursor: zoom-in; margin-left: 2px;" title="Click to enlarge"/>`).join('');
                } catch (e) {
                    photoThumbnail += `<img src="${item.issueImage}" class="issue-image" style="width: 28px; height: 28px; border-radius: 4px; border: 1px solid var(--border-glass); cursor: zoom-in;" title="Click to enlarge"/>`;
                }
            } else {
                photoThumbnail += `<img src="${item.issueImage}" class="issue-image" style="width: 28px; height: 28px; border-radius: 4px; border: 1px solid var(--border-glass); cursor: zoom-in;" title="Click to enlarge"/>`;
            }
        }
        
        if (item.defectImage) {
            if (item.defectImage.startsWith('[')) {
                try {
                    const defectImgs = JSON.parse(item.defectImage);
                    photoThumbnail += defectImgs.map(img => `<img src="${img}" class="issue-image defect-image" style="width: 28px; height: 28px; border-radius: 4px; border: 1px solid var(--status-red); cursor: zoom-in; margin-left: 2px;" title="Defect (Click to enlarge)"/>`).join('');
                } catch (e) {
                    photoThumbnail += `<img src="${item.defectImage}" class="issue-image defect-image" style="width: 28px; height: 28px; border-radius: 4px; border: 1px solid var(--status-red); cursor: zoom-in;" title="Defect (Click to enlarge)"/>`;
                }
            } else {
                photoThumbnail += `<img src="${item.defectImage}" class="issue-image defect-image" style="width: 28px; height: 28px; border-radius: 4px; border: 1px solid var(--status-red); cursor: zoom-in;" title="Defect (Click to enlarge)"/>`;
            }
        }
            
        const itemQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(item.trackingId)}`;

        return `
        <div class="pos-cart-item-card">
            <div class="pos-cart-item-color-strip" style="background: ${item.colorHex}; cursor: pointer;" title="${currentLanguage === 'th' ? 'คลิกเพื่อเปลี่ยนสี' : 'Click to change color'}" data-index="${index}"></div>
            <div class="pos-cart-item-body">
                <div class="pos-cart-item-title-row">
                    <span class="pos-cart-item-title">
                        ${translateItemName(item.type)} 
                        ${item.serviceType && item.serviceType !== 'Same as Order' ? `<span style="font-size: 0.7rem; color: #fff; background: var(--primary); padding: 0.15rem 0.4rem; border-radius: 4px; margin-left: 0.4rem;">${t(item.serviceType)}</span>` : ''}
                        <span style="font-size: 0.75rem; color: var(--primary); background: rgba(99, 102, 241, 0.1); padding: 0.15rem 0.4rem; border-radius: 4px; margin-left: 0.4rem; font-family: monospace;">${item.trackingId}</span>
                    </span>
                    <div style="display: flex; align-items: center; gap: 0.4rem;">
                        <button type="button" class="pos-cart-item-duplicate-btn" data-index="${index}" title="${currentLanguage === 'th' ? 'คัดลอกรายการ' : 'Duplicate Item'}" style="background: none; border: none; padding: 4px; color: var(--text-muted); cursor: pointer; border-radius: 4px; transition: var(--transition); display: flex; align-items: center; justify-content: center;">
                            <i data-lucide="copy" style="width: 14px; height: 14px;"></i>
                        </button>
                        <button type="button" class="pos-cart-item-remove-btn" data-index="${index}">
                            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                        </button>
                    </div>
                </div>
                <div class="pos-cart-item-meta" style="align-items: center;">
                    <span>${translateColorName ? translateColorName(item.color) : item.color}</span>
                    ${item.brand ? `• <span>${item.brand}</span>` : ''}
                    • ${levelBadge}
                    ${photoThumbnail}
                    <div style="flex-grow: 1;"></div>
                    <img src="${itemQrUrl}" style="width: 32px; height: 32px; border-radius: 4px; border: 1px solid var(--border-glass);" title="Item QR Code" />
                    <button type="button" class="btn btn-secondary" onclick="printItemQrCode('${item.trackingId}', '${item.type}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 6px; display: flex; align-items: center; gap: 0.25rem; margin-left: 0.5rem;">
                        <i data-lucide="printer" style="width: 12px; height: 12px;"></i> Print Tag
                    </button>
                </div>
                
                <!-- Inline Color Picker (initially hidden) -->
                <div class="inline-color-picker" id="inlineColorPicker-${index}" style="display: none; margin-top: 0.6rem; padding-top: 0.5rem; border-top: 1px dashed var(--border-glass); align-items: center; gap: 0.35rem; flex-wrap: wrap;">
                    <span style="font-size: 0.7rem; color: var(--text-muted); margin-right: 0.25rem;">${currentLanguage === 'th' ? 'เปลี่ยนสี:' : 'Change Color:'}</span>
                    ${standardColors.map(c => `
                        <button type="button" class="inline-color-option" data-color-name="${c.name}" data-color-hex="${c.hex}" data-item-index="${index}" style="background: ${c.hex}; width: 18px; height: 18px; border-radius: 50%; border: 1px solid ${c.name === 'White' ? '#ccc' : 'transparent'}; cursor: pointer; transition: transform 0.1s;" title="${c.name}"></button>
                    `).join('')}
                    <!-- Custom color picker -->
                    <label style="display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%; border: 1px dashed var(--text-muted); cursor: pointer; background: #fff; position: relative;" title="Custom Color">
                        <i data-lucide="plus" style="width: 10px; height: 10px; color: var(--text-muted);"></i>
                        <input type="color" class="inline-custom-color-input" data-item-index="${index}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;" />
                    </label>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Bind handlers
    if (typeof listContainer.querySelectorAll === 'function') {
        // 1. Remove button handlers
        listContainer.querySelectorAll('.pos-cart-item-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                currentDraftItems.splice(index, 1);
                renderAddedItems();
            });
        });

        // 2. Duplicate button handlers
        listContainer.querySelectorAll('.pos-cart-item-duplicate-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                const itemToDuplicate = currentDraftItems[index];
                if (itemToDuplicate) {
                    const newItem = {
                        ...itemToDuplicate,
                        trackingId: `ITM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2,6).toUpperCase()}`
                    };
                    currentDraftItems.splice(index + 1, 0, newItem); // Insert right below the duplicated item
                    renderAddedItems();
                }
            });
        });

        // 3. Color strip toggle inline picker
        listContainer.querySelectorAll('.pos-cart-item-color-strip').forEach(strip => {
            strip.addEventListener('click', () => {
                const index = strip.dataset.index;
                const picker = document.getElementById(`inlineColorPicker-${index}`);
                if (picker) {
                    const isHidden = picker.style.display === 'none';
                    // Hide all other inline pickers
                    listContainer.querySelectorAll('.inline-color-picker').forEach(p => p.style.display = 'none');
                    picker.style.display = isHidden ? 'flex' : 'none';
                }
            });
        });

        // 4. Inline color option selection
        listContainer.querySelectorAll('.inline-color-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const itemIndex = parseInt(opt.dataset.itemIndex);
                const colorName = opt.dataset.colorName;
                const colorHex = opt.dataset.colorHex;
                if (currentDraftItems[itemIndex]) {
                    currentDraftItems[itemIndex].color = colorName;
                    currentDraftItems[itemIndex].colorHex = colorHex;
                    renderAddedItems();
                }
            });
        });

        // 5. Inline custom color picker selection
        listContainer.querySelectorAll('.inline-custom-color-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const itemIndex = parseInt(input.dataset.itemIndex);
                const customHex = e.target.value;
                const colorName = customHex.toUpperCase();
                if (currentDraftItems[itemIndex]) {
                    currentDraftItems[itemIndex].color = colorName;
                    currentDraftItems[itemIndex].colorHex = customHex;
                    renderAddedItems();
                }
            });
        });
    }
};

const addItemBtn = document.getElementById('addItemBtn');
if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
        const brandInput = document.getElementById('itemBrand');
        const customInput = document.getElementById('customItemInput');
        
        let typeVal = selectedItemType.type;
        const customTypeName = (customInput && customInput.value) ? customInput.value.trim() : '';
        
        if (customTypeName) {
            // Capitalize first letter of each word for neat styling
            const formattedTypeName = customTypeName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            typeVal = formattedTypeName;
            
            // Check if it already exists in standard types (case-insensitive)
            const exists = clothingTypes.some(t => t.toLowerCase() === formattedTypeName.toLowerCase());
            if (!exists) {
                clothingTypes.push(formattedTypeName);
                fetch(`${API_BASE}/clothing-types`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: formattedTypeName })
                })
                .then(() => {
                    initItemTypeButtons();
                    renderAdminItems(); // Update admin settings list dynamically
                })
                .catch(err => console.error(err));
            }
            
            // Reset custom input
            customInput.value = '';
        }
        
        const brandVal = brandInput.value.trim();
        if (brandVal) {
            // Capitalize first letter of each word for neat brand styling
            const formattedBrand = brandVal.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            
            const brandExists = clothingBrands.some(b => b.name.toLowerCase() === formattedBrand.toLowerCase());
            if (!brandExists) {
                fetch(`${API_BASE}/clothing-brands`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: formattedBrand })
                })
                .then(res => res.json())
                .then((data) => {
                    if(data.success) {
                        clothingBrands.push({ name: data.name || formattedBrand, logo_url: data.logo_url || null });
                        initBrandButtons(); // Re-render brand select buttons
                    }
                })
                .catch(err => console.error(err));
            }
        }

        const generatedTrackingId = `ITM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;
        
        const itemServiceTypeSelect = document.getElementById('itemServiceType');
        const itemServiceVal = itemServiceTypeSelect ? itemServiceTypeSelect.value : 'Same as Order';

        currentDraftItems.push({
            type: typeVal,
            brand: brandVal,
            color: selectedColor.name,
            colorHex: selectedColor.hex,
            serviceType: itemServiceVal,
            issueImage: selectedImagesArray.length > 0 ? JSON.stringify(selectedImagesArray) : '',
            defectImage: selectedDefectImagesArray.length > 0 ? JSON.stringify(selectedDefectImagesArray) : '',
            issueLevel: 'normal',
            trackingId: generatedTrackingId
        });
        
        brandInput.value = ''; // reset brand input
        if (itemServiceTypeSelect) itemServiceTypeSelect.value = 'Same as Order';
        
        // Reset touchscreen service buttons active states
        const serviceBtns = document.querySelectorAll('#serviceButtonGroup .service-btn');
        serviceBtns.forEach(btn => {
            if (btn.dataset.value === 'Same as Order') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        // Reset Mix Mode if ON
        isMixMode = false;
        const mixColorsBtn = document.getElementById('mixColorsBtn');
        if (mixColorsBtn) mixColorsBtn.classList.remove('active');
        mixColorSelections = [];

        document.querySelectorAll('.brand-pill-btn').forEach(b => b.classList.remove('active'));
        selectedImagesArray = [];
        selectedDefectImagesArray = [];
        renderUploadedThumbnails();
        
        // Reset issue level
        selectedIssueLevel = 'normal';
        
        // Reset type btn styles
        document.querySelectorAll('.item-type-btn').forEach(b => {
            b.style.color = '';
            b.style.borderColor = '';
        });
        // re-color the default active one (Shirt)
        setTimeout(updateActiveItemIconColor, 50);
        
        renderAddedItems();
    });
}

// Form Submission
const form = document.getElementById('newOrderForm');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const orderIdInput = document.getElementById('orderId');
        const manualOrderId = orderIdInput.value.trim();
        
        if (!manualOrderId) {
            showToast('Please enter an Order Number.', 'error');
            return;
        }
        
        // Check uniqueness of Order ID
        const idExists = orders.some(o => o.id.toLowerCase() === manualOrderId.toLowerCase());
        if (idExists) {
            showToast(`Order ID "${manualOrderId}" already exists. Please use a unique number.`, 'error');
            return;
        }
        
        if (currentDraftItems.length === 0) {
            showToast('Please add at least one item to the order.', 'error');
            return;
        }
        
        const newOrder = {
            id: manualOrderId,
            customerName: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            items: [...currentDraftItems],
            serviceType: document.getElementById('serviceType').value,
            status: 'Received',
            date: new Date().toISOString().split('T')[0]
        };
        
        fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                orders.push(newOrder);
                e.target.reset();
                currentDraftItems = []; // reset draft
                renderAddedItems();
                
                // Reset Mix Mode if ON
                isMixMode = false;
                const mixColorsBtn = document.getElementById('mixColorsBtn');
                if (mixColorsBtn) mixColorsBtn.classList.remove('active');
                mixColorSelections = [];

                // Color builder icon back to default selected color (Black)
                selectedColor = { name: 'Black', hex: '#000000' };
                document.querySelectorAll('.color-swatch').forEach(s => {
                    if (s.dataset.color === 'Black') s.classList.add('active');
                    else s.classList.remove('active');
                });
                renderActiveColorCheckmark();
                updateActiveItemIconColor();
                
                refreshAllViews();
                
                showToast(currentLanguage === 'th' ? `สร้างออเดอร์ ${newOrder.id} สำเร็จแล้ว!` : `Order ${newOrder.id} created successfully!`, 'success');
                
                // Switch to dashboard
                const dashboardBtn = document.querySelector('.nav-item[data-view="dashboard"]');
                if (dashboardBtn) dashboardBtn.click();
            } else {
                showToast('Error creating order.', 'error');
            }
        })
        .catch(err => {
            console.error(err);
            showToast('Could not connect to database backend.', 'error');
        });
    });
}

// Drag and Drop Logic
function setupDragAndDrop() {
    const cards = document.querySelectorAll('.kanban-card');
    const columns = document.querySelectorAll('.kanban-column');
    
    cards.forEach(card => {
        card.addEventListener('dragstart', () => {
            card.classList.add('dragging');
        });
        
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });
    });
    
    columns.forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
            column.classList.add('drag-over');
        });
        
        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });
        
        column.addEventListener('drop', e => {
            e.preventDefault();
            column.classList.remove('drag-over');
            
            const draggingCard = document.querySelector('.dragging');
            if(!draggingCard) return;
            
            const orderId = draggingCard.dataset.id;
            const newStatus = column.dataset.status;
            
            // Update Data
            const orderIndex = orders.findIndex(o => o.id === orderId);
            if(orderIndex > -1 && orders[orderIndex].status !== newStatus) {
                orders[orderIndex].status = newStatus;
                
                // Put to database
                fetch(`${API_BASE}/orders/${orderId}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        showToast(currentLanguage === 'th' ? `ย้ายออเดอร์ ${orderId} ไปยัง ${t(newStatus)}` : `Order ${orderId} moved to ${t(newStatus)}`, 'success');
                        refreshAllViews();
                    }
                })
                .catch(err => {
                    console.error(err);
                    showToast('Error updating status in database.', 'error');
                });
            }
        });
    });
}

// Brand Search functionality
const brandSearchInput = document.getElementById('brandSearchInput');
if (brandSearchInput) {
    brandSearchInput.addEventListener('input', () => {
        initBrandButtons();
    });
}

// Search functionality (simple client side)
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        
        if(term.length === 0) {
            updateRecentOrdersTable();
            updateCompletedOrdersTable();
            return;
        }
        
        const superSearchMatch = (o, term) => {
            if (o.id && o.id.toLowerCase().includes(term)) return true;
            if (o.customerName && o.customerName.toLowerCase().includes(term)) return true;
            if (o.customerPhone && o.customerPhone.toLowerCase().includes(term)) return true;
            if (o.serviceType && o.serviceType.toLowerCase().includes(term)) return true;
            if (o.status && o.status.toLowerCase().includes(term)) return true;
            if (o.date && o.date.toLowerCase().includes(term)) return true;
            if (o.items && Array.isArray(o.items)) {
                return o.items.some(item => {
                    if (item.type && item.type.toLowerCase().includes(term)) return true;
                    if (item.brand && item.brand.toLowerCase().includes(term)) return true;
                    if (item.color && item.color.toLowerCase().includes(term)) return true;
                    if (item.trackingId && item.trackingId.toLowerCase().includes(term)) return true;
                    if (item.issueText && item.issueText.toLowerCase().includes(term)) return true;
                    return false;
                });
            }
            return false;
        };

        const filteredRecent = orders.filter(o => o.status !== 'Delivered' && superSearchMatch(o, term)).reverse();
        const filteredCompleted = orders.filter(o => o.status === 'Delivered' && superSearchMatch(o, term)).reverse();
        
        const recentTbody = document.getElementById('recent-orders-body');
        if (recentTbody) {
            recentTbody.innerHTML = filteredRecent.length > 0 ? filteredRecent.map(order => `
                <tr style="cursor: pointer;" data-id="${order.id}">
                    <td><strong>${order.id}</strong></td>
                    <td>${order.customerName}</td>
                    <td>${order.serviceType}</td>
                    <td><span class="status-badge ${getStatusColorClass(order.status)}">${order.status}</span></td>
                    <td>${order.date}</td>
                    <td><button class="icon-btn" style="width:30px;height:30px;"><i data-lucide="chevron-right"></i></button></td>
                </tr>
            `).join('') : `<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 1rem;">No matching active orders found.</td></tr>`;
        }

        const completedTbody = document.getElementById('completed-orders-body');
        if (completedTbody) {
            completedTbody.innerHTML = filteredCompleted.length > 0 ? filteredCompleted.map(order => `
                <tr style="cursor: pointer;" data-id="${order.id}">
                    <td><strong>${order.id}</strong></td>
                    <td>${order.customerName}</td>
                    <td>${order.serviceType}</td>
                    <td><span class="status-badge ${getStatusColorClass(order.status)}">${order.status}</span></td>
                    <td>${order.date}</td>
                    <td><button class="icon-btn" style="width:30px;height:30px;"><i data-lucide="chevron-right"></i></button></td>
                </tr>
            `).join('') : `<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 1rem;">No matching completed orders found.</td></tr>`;
        }
        
        lucide.createIcons();
    });
}

const loadAllData = async () => {
    try {
        const ordersRes = await fetch(`${API_BASE}/orders`);
        orders = await ordersRes.json();
        
        const typesRes = await fetch(`${API_BASE}/clothing-types`);
        clothingTypes = await typesRes.json();
        
        const catsRes = await fetch(`${API_BASE}/categories`);
        categories = await catsRes.json();
        
        try {
            const brandsRes = await fetch(`${API_BASE}/clothing-brands`);
            clothingBrands = await brandsRes.json();
        } catch (err) {
            console.error("Error fetching clothing brands:", err);
        }
        
        refreshAllViews();
        initItemTypeButtons();
        renderAdminItems();
        renderAdminBrands();
        initBrandButtons();
        applyTranslations();
    } catch (err) {
        console.error("Error loading data from database backend:", err);
        showToast("Error: " + err.message, "error");
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderActiveColorCheckmark();
    
    // Set up Mix Colors button click handler
    const mixColorsBtn = document.getElementById('mixColorsBtn');
    if (mixColorsBtn) {
        mixColorsBtn.addEventListener('click', () => {
            isMixMode = !isMixMode;
            
            if (isMixMode) {
                mixColorsBtn.classList.add('active');
                mixColorSelections = [];
                document.querySelectorAll('.color-swatch').forEach(s => {
                    if (s.classList.contains('active')) {
                        mixColorSelections.push({
                            name: s.dataset.color,
                            hex: s.style.backgroundColor || s.style.background
                        });
                    }
                });
                showToast(currentLanguage === 'th' ? 'เปิดโหมดผสมสี: แตะเลือกสีได้หลายสีพร้อมกัน' : 'Mix mode ON: Tap multiple colors to combine them', 'info');
            } else {
                mixColorsBtn.classList.remove('active');
                const activeSwatches = document.querySelectorAll('.color-swatch.active');
                let keepSwatch = null;
                if (activeSwatches.length > 0) {
                    keepSwatch = activeSwatches[0];
                    activeSwatches.forEach((s, idx) => {
                        if (idx > 0) s.classList.remove('active');
                    });
                }
                
                if (keepSwatch) {
                    selectedColor = {
                        name: keepSwatch.dataset.color,
                        hex: keepSwatch.style.backgroundColor || keepSwatch.style.background
                    };
                } else {
                    const blackSwatch = Array.from(document.querySelectorAll('.color-swatch')).find(s => s.dataset.color === 'Black');
                    if (blackSwatch) {
                        blackSwatch.classList.add('active');
                        selectedColor = { name: 'Black', hex: '#000000' };
                    }
                }
                
                mixColorSelections = [];
                renderActiveColorCheckmark();
                updateActiveItemIconColor();
                showToast(currentLanguage === 'th' ? 'ปิดโหมดผสมสีแล้ว' : 'Mix mode OFF', 'info');
            }
        });
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Load all data from PostgreSQL via Express API on start
    loadAllData();
    initAdminTabs();

    // Set up item service type touchscreen buttons
    const serviceBtns = document.querySelectorAll('#serviceButtonGroup .service-btn');
    const serviceInput = document.getElementById('itemServiceType');
    if (serviceBtns.length > 0 && serviceInput) {
        serviceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                serviceBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                serviceInput.value = btn.dataset.value;
            });
        });
    }
    
    // Check for search parameter in URL (used when scanning QR code)
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    
    if (searchQuery) {
        const searchQueryVal = searchQuery;
        setTimeout(() => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = searchQueryVal;
                // Trigger the search input event to filter the orders
                searchInput.dispatchEvent(new Event('input'));
            }
        }, 500);
    }
    
    // Initialize active item icon color in the builder
    setTimeout(updateActiveItemIconColor, 100);

    // Watch manual Order Number typing to update QR codes reactively
    const orderIdInput = document.getElementById('orderId');
    if (orderIdInput) {
        orderIdInput.addEventListener('input', () => {
            updateDraftQRIds();
        });
    }

    // Set up language switcher button handler
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLanguage = currentLanguage === 'en' ? 'th' : 'en';
            localStorage.setItem('tls_language', currentLanguage);
            applyTranslations();
            refreshAllViews();
            initItemTypeButtons();
            renderAdminItems();
            renderAddedItems();
        });
    }

    // Brand quick select buttons logic
    const brandInput = document.getElementById('itemBrand');
    if (brandInput) {
        document.querySelectorAll('.brand-pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const brand = btn.dataset.brand;
                if (btn.classList.contains('active')) {
                    // Toggle off if clicking the active one
                    btn.classList.remove('active');
                    brandInput.value = '';
                } else {
                    document.querySelectorAll('.brand-pill-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    brandInput.value = brand;
                }
            });
        });
        
        // Clear active brand button highlight if user types manually
        if (typeof brandInput.addEventListener === 'function') {
            brandInput.addEventListener('input', () => {
                const currentVal = brandInput.value.trim().toLowerCase();
                document.querySelectorAll('.brand-pill-btn').forEach(btn => {
                    if (btn.dataset.brand.toLowerCase() === currentVal) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            });
        }
    }

    // Apply translations on load
    applyTranslations();
});

// Modal Logic
const modalOverlay = document.getElementById('orderDetailsModal');
const closeBtns = document.querySelectorAll('.close-modal');

const openOrderModal = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    document.getElementById('modalOrderId').innerText = `${t('order_details')}: ${order.id}`;
    document.getElementById('modalCustomerName').innerText = order.customerName;
    document.getElementById('modalPhone').innerText = order.phone;
    document.getElementById('modalServiceType').innerText = t(order.serviceType);
    
    const statusEl = document.getElementById('modalStatus');
    statusEl.innerHTML = `<span class="status-badge ${getStatusColorClass(order.status)}">${t(order.status)}</span>`;
    
    document.getElementById('modalDate').innerText = order.date;
    
    const modalItemsCount = document.getElementById('modalItemsCount');
    if (modalItemsCount) {
        modalItemsCount.innerText = `(${order.items.length} ${order.items.length === 1 ? 'item' : 'items'})`;
    }

    // Set up staff operator name input
    const verifyOperator = document.getElementById('verifyOperator');
    if (verifyOperator) {
        verifyOperator.value = localStorage.getItem('tls_verify_operator') || 'Staff';
        verifyOperator.oninput = (e) => {
            localStorage.setItem('tls_verify_operator', e.target.value);
        };
    }
    
    const itemsList = document.getElementById('modalItemsList');
    const itemsHtml = order.items.map((item, index) => {
        let levelBadge = `<span class="issue-badge issue-badge-normal">${t('normal')}</span>`;
        if (item.issueLevel === 'issue') {
            levelBadge = `<span class="issue-badge issue-badge-warning"><i data-lucide="alert-triangle" style="width: 10px; height: 10px;"></i> ${t('issue')}</span>`;
        } else if (item.issueLevel === 'extreme') {
            levelBadge = `<span class="issue-badge issue-badge-extreme"><i data-lucide="octagon-alert" style="width: 10px; height: 10px;"></i> ${t('extreme')}</span>`;
        }
        
        // Handle single image string vs JSON array string gracefully in modal details
        let photoThumbnail = '';
        if (item.issueImage || item.defectImage) {
            photoThumbnail = `<div style="margin-top: 0.5rem; display: flex; gap: 0.25rem; flex-wrap: wrap;">`;
            
            if (item.issueImage) {
                if (item.issueImage.startsWith('[')) {
                    try {
                        const imgs = JSON.parse(item.issueImage);
                        photoThumbnail += imgs.map(img => `<img src="${img}" class="issue-image" style="cursor: zoom-in; max-width: 80px; max-height: 80px; border-radius: 4px; border: 1px solid var(--border-glass);" title="Click to enlarge"/>`).join('');
                    } catch (e) {
                        photoThumbnail += `<img src="${item.issueImage}" class="issue-image" style="cursor: zoom-in; max-width: 80px; max-height: 80px; border-radius: 4px; border: 1px solid var(--border-glass);" title="Click to enlarge"/>`;
                    }
                } else {
                    photoThumbnail += `<img src="${item.issueImage}" class="issue-image" style="cursor: zoom-in; max-width: 80px; max-height: 80px; border-radius: 4px; border: 1px solid var(--border-glass);" title="Click to enlarge"/>`;
                }
            }
            
            if (item.defectImage) {
                if (item.defectImage.startsWith('[')) {
                    try {
                        const defectImgs = JSON.parse(item.defectImage);
                        photoThumbnail += defectImgs.map(img => `<img src="${img}" class="issue-image defect-image" style="cursor: zoom-in; max-width: 80px; max-height: 80px; border-radius: 4px; border: 2px solid var(--status-red);" title="Defect (Click to enlarge)"/>`).join('');
                    } catch (e) {
                        photoThumbnail += `<img src="${item.defectImage}" class="issue-image defect-image" style="cursor: zoom-in; max-width: 80px; max-height: 80px; border-radius: 4px; border: 2px solid var(--status-red);" title="Defect (Click to enlarge)"/>`;
                    }
                } else {
                    photoThumbnail += `<img src="${item.defectImage}" class="issue-image defect-image" style="cursor: zoom-in; max-width: 80px; max-height: 80px; border-radius: 4px; border: 2px solid var(--status-red);" title="Defect (Click to enlarge)"/>`;
                }
            }
            
            photoThumbnail += `</div>`;
        }
            
        const itemQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(item.trackingId)}`;

        return `
        <div class="added-item-row" style="background: var(--bg-glass-solid); border: 1px solid var(--border-glass); color: var(--text-main); display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem;">
            <!-- Touchscreen checklist verification checkbox -->
            <div style="display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <label class="item-check-container" style="margin: 0;">
                    <input type="checkbox" class="item-verify-checkbox" data-tracking-id="${item.trackingId}" data-item-type="${item.type}" style="position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0;" />
                    <span class="checkmark-circle">
                        <i data-lucide="check" class="check-icon-svg" style="width: 16px; height: 16px; color: #fff; display: none;"></i>
                    </span>
                </label>
            </div>

            <div class="added-item-info" style="flex-grow: 1;">
                <div class="added-item-details">
                    <div style="display: flex; justify-content: space-between; align-items: start; width: 100%;">
                        <div>
                            <span class="added-item-title" style="color: ${item.colorHex}; font-weight: 600; font-size: 1rem;">
                                ${translateItemName(item.type)} 
                                ${item.serviceType && item.serviceType !== 'Same as Order' ? `<span style="font-size: 0.75rem; color: #fff; background: var(--primary); padding: 0.15rem 0.4rem; border-radius: 4px; margin-left: 0.4rem;">${t(item.serviceType)}</span>` : ''}
                                <span style="font-size: 0.75rem; color: var(--primary); background: rgba(99, 102, 241, 0.1); padding: 0.15rem 0.4rem; border-radius: 4px; margin-left: 0.4rem; font-family: monospace;">${item.trackingId}</span>
                            </span>
                            <span class="added-item-meta" style="color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.25rem;">
                                <span class="added-item-color-dot" style="background: ${item.colorHex}; border: 1px solid var(--border-glass);"></span> ${translateColorName ? translateColorName(item.color) : item.color}
                                ${item.brand ? `• ${item.brand}` : ''}
                                • ${levelBadge}
                            </span>
                            ${photoThumbnail}
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; flex-shrink: 0; margin-left: 1rem;">
                            <img src="${itemQrUrl}" style="width: 48px; height: 48px; border-radius: 4px; border: 1px solid var(--border-glass);" title="Item QR Code" />
                            <button type="button" class="btn btn-secondary" onclick="printItemQrCode('${item.trackingId}', '${item.type}')" style="padding: 0.25rem 0.5rem; font-size: 0.7rem; border-radius: 6px; display: flex; align-items: center; gap: 0.25rem;">
                                <i data-lucide="printer" style="width: 12px; height: 12px;"></i> Print Tag
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');
    itemsList.innerHTML = itemsHtml;

    // Helper to refresh verification history inside the modal
    const refreshModalVerifyHistory = async () => {
        const historyContainer = document.getElementById('modalVerifyHistory');
        if (!historyContainer) return;
        
        try {
            const res = await fetch(`${API_BASE}/item-verifications/order/${order.id}`);
            const logs = await res.json();
            
            if (logs.length === 0) {
                historyContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 0.5rem;">No history yet. Start verifying items.</div>`;
                return;
            }
            
            historyContainer.innerHTML = logs.map(log => {
                const timeStr = new Date(log.verified_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateStr = new Date(log.verified_at).toLocaleDateString([], { month: 'short', day: 'numeric' });
                const actionText = log.checked 
                    ? `<span style="color: #10b981; font-weight: bold;">verified</span>` 
                    : `<span style="color: #f97316; font-weight: bold;">unverified</span>`;
                const matchingItem = order.items.find(i => i.trackingId === log.tracking_id);
                const itemName = matchingItem ? translateItemName(matchingItem.type) : 'Item';
                
                return `
                    <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed rgba(34, 41, 69, 0.05); padding: 0.15rem 0; font-size: 0.8rem;">
                        <span><strong>${log.verified_by}</strong> ${actionText} ${itemName} at <span class="status-badge" style="padding: 0.1rem 0.35rem; font-size: 0.65rem; background: rgba(34, 41, 69, 0.08);">${t(log.status)}</span></span>
                        <span style="color: var(--text-muted); font-size: 0.7rem;">${dateStr} ${timeStr}</span>
                    </div>
                `;
            }).join('');
        } catch (err) {
            console.error("Error loading verification history:", err);
        }
    };

    // Load current verified state for checkboxes from database
    try {
        const res = await fetch(`${API_BASE}/item-verifications/order/${order.id}/status/${order.status}`);
        const verifiedStates = await res.json();
        
        verifiedStates.forEach(state => {
            const cb = itemsList.querySelector(`.item-verify-checkbox[data-tracking-id="${state.tracking_id}"]`);
            if (cb) {
                cb.checked = state.checked;
            }
        });
    } catch (err) {
        console.error("Error loading item verification states:", err);
    }
    
    // Set up verification checklist progress counter
    const verifyProgress = document.getElementById('modalVerifyProgress');
    if (verifyProgress) {
        verifyProgress.style.display = 'block';
        const totalItems = order.items.length;
        const updateVerifyCount = () => {
            const checkedCount = itemsList.querySelectorAll('.item-verify-checkbox:checked').length;
            if (currentLanguage === 'th') {
                verifyProgress.innerText = `ตรวจสอบแล้ว ${checkedCount}/${totalItems} รายการ`;
            } else {
                verifyProgress.innerText = `Checked ${checkedCount}/${totalItems} items`;
            }
            if (checkedCount === totalItems) {
                verifyProgress.style.color = '#15803d';
                verifyProgress.style.backgroundColor = '#dcfce7';
            } else {
                verifyProgress.style.color = 'var(--primary)';
                verifyProgress.style.backgroundColor = 'rgba(34, 41, 69, 0.05)';
            }
        };
        updateVerifyCount();
        
        // Attach change listeners to save state automatically on check/uncheck
        itemsList.querySelectorAll('.item-verify-checkbox').forEach(cb => {
            cb.addEventListener('change', async (e) => {
                updateVerifyCount();
                const operatorName = (verifyOperator ? verifyOperator.value.trim() : '') || 'Staff';
                const payload = {
                    orderId: order.id,
                    trackingId: cb.dataset.trackingId,
                    status: order.status,
                    checked: cb.checked,
                    verifiedBy: operatorName
                };
                
                try {
                    // AUTO SAVE check status to DB
                    await fetch(`${API_BASE}/item-verifications`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    
                    // Refresh modal audit log timeline
                    refreshModalVerifyHistory();
                } catch (err) {
                    console.error("Error auto-saving item check:", err);
                    showToast("Error saving check: " + err.message, "error");
                }
            });
        });
    }

    // Load local history list inside modal
    refreshModalVerifyHistory();

    modalOverlay.classList.add('active');
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    const printBtn = document.getElementById('printModalBtn');
    if (printBtn) {
        printBtn.onclick = () => printQrCode(order.id);
    }
};

if (closeBtns) {
    closeBtns.forEach(btn => btn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    }));
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });
}

// Image Enlarge Logic
const imageEnlargeModal = document.getElementById('imageEnlargeModal');
const enlargedImage = document.getElementById('enlargedImage');
const closeImageBtns = document.querySelectorAll('.close-image-modal');

if (closeImageBtns) {
    closeImageBtns.forEach(btn => btn.addEventListener('click', () => {
        if(imageEnlargeModal) imageEnlargeModal.classList.remove('active');
    }));
}

if (imageEnlargeModal) {
    imageEnlargeModal.addEventListener('click', (e) => {
        if (e.target === imageEnlargeModal) {
            imageEnlargeModal.classList.remove('active');
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && imageEnlargeModal.classList.contains('active')) {
            imageEnlargeModal.classList.remove('active');
        }
    });
}

// Global click delegation for opening orders
document.addEventListener('click', (e) => {
    // Issue Image Enlarge
    if (e.target.classList.contains('issue-image')) {
        if(imageEnlargeModal && enlargedImage) {
            enlargedImage.src = e.target.src;
            imageEnlargeModal.classList.add('active');
        }
        return;
    }
    
    // Kanban Card
    const card = e.target.closest('.kanban-card');
    if (card) {
        // Prevent opening if clicking on QR Code image
        if (e.target.tagName === 'IMG') {
            printQrCode(card.dataset.id);
            return;
        }
        openOrderModal(card.dataset.id);
        return;
    }
    
    // Table Row Action
    const row = e.target.closest('tr[data-id]');
    if (row) {
        openOrderModal(row.dataset.id);
    }
});

// Close modals via Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            activeModal.classList.remove('active');
        }
    }
});

// Admin Panel Category Management (Drag & Drop Assignment)
let draggedItemType = null;

const bindDragAndDropEvents = () => {
    // 1. Draggable Item Chips
    document.querySelectorAll('.admin-item-chip').forEach(chip => {
        chip.addEventListener('dragstart', (e) => {
            draggedItemType = chip.dataset.type;
            e.dataTransfer.setData('text/plain', draggedItemType);
            chip.style.opacity = '0.5';
        });
        
        chip.addEventListener('dragend', () => {
            chip.style.opacity = '1';
            draggedItemType = null;
        });
    });
    
    // 2. Category Dropzones
    document.querySelectorAll('.admin-category-card').forEach(card => {
        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            card.classList.add('drag-over');
        });
        
        card.addEventListener('dragleave', () => {
            card.classList.remove('drag-over');
        });
        
        card.addEventListener('drop', (e) => {
            e.preventDefault();
            card.classList.remove('drag-over');
            
            const itemType = e.dataTransfer.getData('text/plain') || draggedItemType;
            const targetCatId = card.dataset.catId;
            
            if (!itemType || !targetCatId) return;
            
            // Remove item from any category it already belongs to
            categories.forEach(cat => {
                if (cat.items) {
                    cat.items = cat.items.filter(item => item !== itemType);
                }
            });
            
            // Add to target category
            const targetCat = categories.find(c => c.id === targetCatId);
            if (targetCat) {
                if (!targetCat.items) targetCat.items = [];
                // Prevent duplicate just in case
                if (!targetCat.items.includes(itemType)) {
                    targetCat.items.push(itemType);
                }
            }
            
            // Save and render
            fetch(`${API_BASE}/categories/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ itemType, targetCatId })
            })
            .then(() => {
                initItemTypeButtons();
                renderAdminItems();
                showToast(currentLanguage === 'th' ? `จัดหมวดหมู่ "${translateItemName(itemType)}" ไปยัง "${translateCategoryName(targetCat.name)}"` : `Assigned "${itemType}" to "${targetCat.name}"`, 'success');
            })
            .catch(err => console.error(err));
        });
    });
    
    // 3. Library Dropzone (to unassign items)
    const libraryDropzone = document.getElementById('adminLibraryDropzone');
    if (libraryDropzone) {
        libraryDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            libraryDropzone.style.background = '#e2e8f0';
            libraryDropzone.style.borderColor = 'var(--primary)';
        });
        
        libraryDropzone.addEventListener('dragleave', () => {
            libraryDropzone.style.background = '#f8fafc';
            libraryDropzone.style.borderColor = '#cbd5e1';
        });
        
        libraryDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            libraryDropzone.style.background = '#f8fafc';
            libraryDropzone.style.borderColor = '#cbd5e1';
            
            const itemType = e.dataTransfer.getData('text/plain') || draggedItemType;
            if (!itemType) return;
            
            // Remove item from any category it belongs to (this makes it unassigned!)
            let found = false;
            categories.forEach(cat => {
                if (cat.items && cat.items.includes(itemType)) {
                    cat.items = cat.items.filter(item => item !== itemType);
                    found = true;
                }
            });
            
            if (found) {
                fetch(`${API_BASE}/categories/assign`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ itemType, targetCatId: null })
                })
                .then(() => {
                    initItemTypeButtons();
                    renderAdminItems();
                    showToast(currentLanguage === 'th' ? `ยกเลิกการมอบหมาย "${translateItemName(itemType)}" ออกจากหมวดหมู่` : `Unassigned "${itemType}" from category`, 'success');
                })
                .catch(err => console.error(err));
            }
        });
    }
};

const renderAdminItems = () => {
    const libraryDropzone = document.getElementById('adminLibraryDropzone');
    const categoryBoard = document.getElementById('adminCategoryBoard');
    if (!libraryDropzone || !categoryBoard) return;
    
    // 1. Identify unassigned items
    const assignedItems = new Set();
    categories.forEach(cat => {
        if (cat.items) {
            cat.items.forEach(item => assignedItems.add(item));
        }
    });
    const unassignedItems = clothingTypes.filter(item => !assignedItems.has(item));
    unassignedItems.sort((a, b) => a.localeCompare(b));
    
    // 2. Render Library (Unassigned Items) Dropzone
    if (unassignedItems.length === 0) {
        libraryDropzone.innerHTML = `<div class="admin-category-empty">${currentLanguage === 'th' ? 'จัดหมวดหมู่รายการทั้งหมดแล้ว' : 'All library items assigned.'}</div>`;
    } else {
        libraryDropzone.innerHTML = unassignedItems.map(type => {
            return `
            <div class="admin-item-chip" draggable="true" data-type="${type}">
                <span>${translateItemName(type)}</span>
                <button type="button" class="admin-delete-library-item" data-type="${type}" style="background: none; border: none; cursor: pointer; color: #ef4444; padding: 0.15rem; display: flex; align-items: center; justify-content: center;">
                    <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
                </button>
            </div>
            `;
        }).join('');
    }
    
    // 3. Render Categories columns
    if (categories.length === 0) {
        categoryBoard.innerHTML = `<div style="color: var(--text-muted); grid-column: span 3; text-align: center; padding: 2rem;">${currentLanguage === 'th' ? 'ยังไม่ได้สร้างหมวดหมู่ ใช้ฟอร์มด้านบนเพื่อสร้าง' : 'No categories created. Use the form above.'}</div>`;
    } else {
        categoryBoard.innerHTML = [...categories].sort((a, b) => a.name.localeCompare(b.name)).map(cat => {
            // Render item chips assigned to this category
            const validCatItems = (cat.items || []).filter(item => clothingTypes.includes(item));
            validCatItems.sort((a, b) => a.localeCompare(b));
            const itemsHtml = validCatItems.map(type => {
                return `
                <div class="admin-item-chip" draggable="true" data-type="${type}">
                    <span>${translateItemName(type)}</span>
                </div>
                `;
            }).join('');
            
            const emptyHtml = validCatItems.length === 0 ? `<div class="admin-category-empty">${currentLanguage === 'th' ? 'ลากรายการมาวางที่นี่' : 'Drag items here'}</div>` : '';
            
            return `
            <div class="admin-category-card" data-cat-id="${cat.id}">
                <div class="admin-category-header">
                    <span class="admin-category-title">${translateCategoryName(cat.name)}</span>
                    <button type="button" class="admin-delete-cat-btn" data-cat-id="${cat.id}" style="background: none; border: none; cursor: pointer; color: #ef4444; padding: 0.15rem; display: flex; align-items: center;">
                        <i data-lucide="x" style="width: 14px; height: 14px;"></i>
                    </button>
                </div>
                <div class="admin-category-dropzone" data-cat-id="${cat.id}">
                    ${itemsHtml}
                    ${emptyHtml}
                </div>
            </div>
            `;
        }).join('');
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // 4. Bind Drag & Drop Events
    bindDragAndDropEvents();
    
    // 5. Bind delete buttons
    // Delete library item button
    document.querySelectorAll('.admin-delete-library-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const typeToDelete = btn.dataset.type;
            
            // Remove from clothingTypes
            clothingTypes = clothingTypes.filter(t => t !== typeToDelete);
            
            // Remove from any category as well
            categories.forEach(cat => {
                if (cat.items) cat.items = cat.items.filter(t => t !== typeToDelete);
            });
            
            // Send API requests
            fetch(`${API_BASE}/clothing-types/${encodeURIComponent(typeToDelete)}`, {
                method: 'DELETE'
            })
            .then(() => {
                // If active selection was deleted
                if (selectedItemType.type === typeToDelete) {
                    selectedItemType = { type: clothingTypes[0] || '' };
                }
                initItemTypeButtons();
                renderAdminItems();
                showToast(currentLanguage === 'th' ? `ลบรายการผ้า "${typeToDelete}" สำเร็จ` : `Deleted item "${typeToDelete}"`, 'success');
            })
            .catch(err => console.error(err));
        });
    });
    
    // Delete Category button
    document.querySelectorAll('.admin-delete-cat-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const catId = btn.dataset.catId;
            const deletedCat = categories.find(c => c.id === catId);
            if (deletedCat) {
                categories = categories.filter(c => c.id !== catId);
                fetch(`${API_BASE}/categories/${catId}`, {
                    method: 'DELETE'
                })
                .then(() => {
                    initItemTypeButtons();
                    renderAdminItems();
                    showToast(currentLanguage === 'th' ? `ลบหมวดหมู่ "${translateCategoryName(deletedCat.name)}" สำเร็จ` : `Deleted category "${deletedCat.name}"`, 'success');
                })
                .catch(err => console.error(err));
            }
        });
    });
};

const adminForm = document.getElementById('adminAddItemForm');
if (adminForm) {
    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('adminNewItemInput');
        const newType = input.value.trim();
        if (!newType) return;
        
        // Capitalize first letter of each word
        const formattedType = newType.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        // Check duplication case-insensitive
        const exists = clothingTypes.some(t => t.toLowerCase() === formattedType.toLowerCase());
        if (exists) {
            showToast(`Category "${formattedType}" already exists.`, 'error');
            return;
        }
        
        clothingTypes.push(formattedType);
        fetch(`${API_BASE}/clothing-types`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: formattedType })
        })
        .then(() => {
            input.value = '';
            initItemTypeButtons();
            renderAdminItems();
            showToast(currentLanguage === 'th' ? `เพิ่มรายการผ้า "${formattedType}" สำเร็จ` : `Added standard item "${formattedType}"`, 'success');
        })
        .catch(err => console.error(err));
    });
}

const createCategoryForm = document.getElementById('adminCreateCategoryForm');
if (createCategoryForm) {
    createCategoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('adminNewCategoryInput');
        const catName = input.value.trim();
        if (!catName) return;
        
        // Capitalize category name
        const formattedCatName = catName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        // Check duplicate category name (case-insensitive)
        const exists = categories.some(c => c.name.toLowerCase() === formattedCatName.toLowerCase());
        if (exists) {
            showToast(`Category "${formattedCatName}" already exists.`, 'error');
            return;
        }
        
        const newCat = {
            id: 'cat-' + Date.now(),
            name: formattedCatName,
            items: []
        };
        
        categories.push(newCat);
        fetch(`${API_BASE}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: newCat.id, name: newCat.name })
        })
        .then(() => {
            input.value = '';
            initItemTypeButtons();
            renderAdminItems();
            showToast(currentLanguage === 'th' ? `สร้างหมวดหมู่ "${formattedCatName}" สำเร็จ` : `Created category "${formattedCatName}"`, 'success');
        })
        .catch(err => console.error(err));
    });
}
// --- VERIFICATION LOGIC ---
let currentVerificationOrder = null;
let currentVerificationTargetStatus = null;
let verifiedItemTrackingIds = new Set();

const openVerificationModal = (order, targetStatus) => {
    currentVerificationOrder = order;
    currentVerificationTargetStatus = targetStatus;
    verifiedItemTrackingIds.clear();
    
    document.getElementById('verificationTitle').innerText = `Verify Transfer to ${targetStatus}`;
    document.getElementById('verificationScannerInput').value = '';
    
    renderVerificationList();
    
    document.getElementById('verificationModal').classList.add('active');
    setTimeout(() => {
        document.getElementById('verificationScannerInput').focus();
    }, 100);
};

const renderVerificationList = () => {
    const listEl = document.getElementById('verificationItemsList');
    const order = currentVerificationOrder;
    if (!order) return;
    
    let html = '';
    order.items.forEach(item => {
        const isVerified = verifiedItemTrackingIds.has(item.trackingId);
        html += `
        <div class="verification-item-row ${isVerified ? 'verified' : ''}" style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; border: 1px solid var(--border-glass); border-radius: 8px; background: ${isVerified ? '#f0fdf4' : '#ffffff'}; transition: all 0.3s ease;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${isVerified ? '#22c55e' : '#e2e8f0'}; color: ${isVerified ? '#fff' : '#64748b'}; transition: all 0.3s ease;">
                    <i data-lucide="${isVerified ? 'check' : 'circle'}" style="width: 14px; height: 14px;"></i>
                </div>
                <div>
                    <div style="font-weight: 600; color: var(--text-main);">${translateItemName(item.type)}</div>
                    <div style="font-size: 0.75rem; font-family: monospace; color: var(--text-muted);">${item.trackingId}</div>
                </div>
            </div>
            <div>
                ${!isVerified ? `<button class="btn btn-secondary" onclick="verifyItemManual('${item.trackingId}')" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">Verify</button>` : `<span style="color: #22c55e; font-size: 0.8rem; font-weight: bold;">Verified</span>`}
            </div>
        </div>
        `;
    });
    
    listEl.innerHTML = html;
    if(typeof lucide !== 'undefined') lucide.createIcons();
    
    document.getElementById('verificationCount').innerText = `${verifiedItemTrackingIds.size} / ${order.items.length}`;
    
    const confirmBtn = document.getElementById('confirmVerificationBtn');
    if (verifiedItemTrackingIds.size === order.items.length) {
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = '1';
        confirmBtn.style.cursor = 'pointer';
    } else {
        confirmBtn.disabled = true;
        confirmBtn.style.opacity = '0.5';
        confirmBtn.style.cursor = 'not-allowed';
    }
};

window.verifyItemManual = (trackingId) => {
    verifiedItemTrackingIds.add(trackingId);
    renderVerificationList();
    document.getElementById('verificationScannerInput').focus();
};

const scannerInput = document.getElementById('verificationScannerInput');
if(scannerInput) {
    scannerInput.addEventListener('keyup', (e) => {
        if(e.key === 'Enter') {
            const val = scannerInput.value.trim().toUpperCase();
            scannerInput.value = '';
            
            if(currentVerificationOrder) {
                const foundItem = currentVerificationOrder.items.find(i => i.trackingId === val);
                if(foundItem) {
                    if (verifiedItemTrackingIds.has(val)) {
                        showToast('Item already verified!', 'warning');
                    } else {
                        verifiedItemTrackingIds.add(val);
                        renderVerificationList();
                        // Small success micro-animation on the input could go here
                    }
                } else {
                    showToast('Invalid or incorrect item tag!', 'error');
                }
            }
        }
    });
}

const confirmVerificationBtn = document.getElementById('confirmVerificationBtn');
if(confirmVerificationBtn) {
    confirmVerificationBtn.addEventListener('click', () => {
        if(!currentVerificationOrder) return;
        if(verifiedItemTrackingIds.size !== currentVerificationOrder.items.length) return;
        
        const orderId = currentVerificationOrder.id;
        const newStatus = currentVerificationTargetStatus;
        
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if(orderIndex > -1) {
            orders[orderIndex].status = newStatus;
            
            fetch(`${API_BASE}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            .then(res => res.json())
            .then(() => {
                renderKanban();
                updateDashboardStats();
                document.getElementById('verificationModal').classList.remove('active');
                showToast(`Verified and moved to ${newStatus}`, 'success');
            })
            .catch(err => console.error(err));
        }
    });
}

const cancelVerificationBtn = document.getElementById('cancelVerificationBtn');
const closeVerificationBtn = document.getElementById('closeVerificationBtn');
const closeVerif = () => {
    document.getElementById('verificationModal').classList.remove('active');
    renderKanban(); // Reset dragged card visually back to its original column
};
if(cancelVerificationBtn) cancelVerificationBtn.addEventListener('click', closeVerif);
if(closeVerificationBtn) closeVerificationBtn.addEventListener('click', closeVerif);

// --- ADMIN BRANDS LOGIC ---
const renderAdminBrands = () => {
    const brandsBoard = document.getElementById('adminBrandsBoard');
    if (!brandsBoard) return;
    
    const sortedBrands = [...clothingBrands].sort((a, b) => a.name.localeCompare(b.name));
    
    brandsBoard.innerHTML = sortedBrands.map(brandObj => {
        const brand = brandObj.name;
        // If logo_url is specifically "LOADING", we show a spinner instead of the logo
        if (brandObj.logo_url === 'LOADING') {
            return `
            <div class="admin-brand-card" style="background: var(--bg-glass-solid); border: 1px solid var(--border-glass); border-radius: 8px; padding: 0.75rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; min-height: 80px; position: relative; overflow: hidden;">
                <i data-lucide="loader" class="spin" style="width: 24px; height: 24px; color: var(--primary); animation: spin 2s linear infinite;"></i>
                <span style="font-size: 0.8rem; font-weight: 600; text-align: center; color: var(--text-muted);">${brand}</span>
            </div>
            `;
        }
        
        const logoUrl = brandObj.logo_url || `https://www.google.com/s2/favicons?domain=${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com&sz=128`;
        
        return `
        <div class="admin-brand-card" style="position: relative; background: var(--bg-glass-solid); border: 1px solid var(--border-glass); border-radius: 8px; padding: 0.75rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; min-height: 80px;">
            <button type="button" class="admin-delete-brand-btn" data-brand="${brand}" style="position: absolute; top: 4px; right: 4px; background: none; border: none; cursor: pointer; color: #ef4444; padding: 0.15rem; display: flex; align-items: center;">
                <i data-lucide="x" style="width: 14px; height: 14px;"></i>
            </button>
            <img src="${logoUrl}" alt="${brand}" style="max-height: 32px; max-width: 90%; object-fit: contain;" onerror="this.style.display='none';">
            <span style="font-size: 0.8rem; font-weight: 600; text-align: center; color: var(--text-main);">${brand}</span>
        </div>
        `;
    }).join('');
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Bind delete buttons
    document.querySelectorAll('.admin-delete-brand-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const brandToDelete = btn.dataset.brand;
            if(confirm(`Are you sure you want to delete the brand "${brandToDelete}"?`)) {
                clothingBrands = clothingBrands.filter(b => b.name !== brandToDelete);
                fetch(`${API_BASE}/clothing-brands/${encodeURIComponent(brandToDelete)}`, {
                    method: 'DELETE'
                })
                .then(res => res.json())
                .then(() => {
                    renderAdminBrands();
                    initBrandButtons();
                    showToast(`Deleted brand "${brandToDelete}"`, 'success');
                })
                .catch(err => console.error(err));
            }
        });
    });
};

const adminBrandForm = document.getElementById('adminAddBrandForm');
if (adminBrandForm) {
    adminBrandForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('adminNewBrandInput');
        const newBrand = input.value.trim();
        if (!newBrand) return;
        
        // Capitalize first letter of each word
        const formattedBrand = newBrand.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        // Check duplication
        const exists = clothingBrands.some(b => b.name.toLowerCase() === formattedBrand.toLowerCase());
        if (exists) {
            showToast(`Brand "${formattedBrand}" already exists.`, 'error');
            return;
        }
        
        // Push temporary loading brand
        clothingBrands.push({ name: formattedBrand, logo_url: 'LOADING' });
        input.value = '';
        renderAdminBrands();
        
        fetch(`${API_BASE}/clothing-brands`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: formattedBrand })
        })
        .then(res => res.json())
        .then((data) => {
            if(data.success) {
                // Update the temporary brand with the resolved logo_url
                const b = clothingBrands.find(cb => cb.name === formattedBrand);
                if (b) {
                    b.logo_url = data.logo_url;
                }
                renderAdminBrands();
                initBrandButtons(); // Also refresh the main POS view
            }
        })
        .catch(err => {
            console.error(err);
            // On error, remove it or set a fallback
            const b = clothingBrands.find(cb => cb.name === formattedBrand);
            if (b) b.logo_url = null;
            renderAdminBrands();
        });
    });
}

// --- ADMIN TABS LOGIC ---
const loadVerificationLogs = async () => {
    const tableBody = document.getElementById('verificationLogsTableBody');
    if (!tableBody) return;
    
    try {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Loading logs...</td></tr>`;
        const res = await fetch(`${API_BASE}/item-verifications`);
        const logs = await res.json();
        
        if (logs.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No verification logs recorded yet.</td></tr>`;
            return;
        }
        
        tableBody.innerHTML = logs.map(log => {
            const dateStr = new Date(log.verified_at).toLocaleString();
            const actionBadge = log.checked 
                ? `<span class="status-badge text-green">Checked</span>` 
                : `<span class="status-badge text-orange">Unchecked</span>`;
            return `
                <tr>
                    <td>${dateStr}</td>
                    <td><strong>${log.verified_by}</strong></td>
                    <td>${log.order_id}</td>
                    <td><span style="font-family: monospace; font-size: 0.8rem;">${log.tracking_id}</span></td>
                    <td><span class="status-badge text-blue">${t(log.status)}</span></td>
                    <td>${actionBadge}</td>
                </tr>
            `;
        }).join('');
    } catch (err) {
        console.error(err);
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Error loading logs: ${err.message}</td></tr>`;
    }
};

const initAdminTabs = () => {
    const adminTabs = document.querySelectorAll('.admin-tab');
    if (!adminTabs.length) return;
    
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active state from all tabs
            adminTabs.forEach(t => {
                t.classList.remove('active');
                t.style.color = 'var(--text-muted)';
                t.style.borderBottomColor = 'transparent';
            });
            
            // Set active state on clicked tab
            tab.classList.add('active');
            tab.style.color = 'var(--primary)';
            tab.style.borderBottomColor = 'var(--primary)';
            
            // Hide all tab contents
            document.querySelectorAll('.admin-tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Show target tab content
            const targetId = `admin-tab-${tab.dataset.tab}`;
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.style.display = 'block';
            }
            
            // Load logs if tab clicked
            if (tab.dataset.tab === 'logs') {
                loadVerificationLogs();
            }
        });
    });
    
    // Set up refresh button
    const refreshBtn = document.getElementById('refreshVerificationLogsBtn');
    if (refreshBtn) {
        refreshBtn.onclick = loadVerificationLogs;
    }
};

