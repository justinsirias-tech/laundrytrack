// Data Models
const statuses = ['Received', 'Wash & Dry', 'Ironing', 'Packing', 'Ready', 'Delivered'];

const safeCreateIcons = () => {
    try {
        if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
            lucide.createIcons();
        }
    } catch (e) {
        console.warn("Lucide icons notice:", e);
    }
};


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

const getApiBase = () => {
    const host = window.location.hostname || 'localhost';
    const port = window.location.port;
    if (host === 'localhost' || host === '127.0.0.1' || host === '' || port === '5000' || port === '3000' || port === '5500') {
        return `http://${host}:3001/api`;
    }
    return '/api';
};
const API_BASE = getApiBase();

const defaultCategories = [
    { id: 'cat-1', name: 'Tops', items: ['Shirt', 'Blouse', 'Jacket', 'Overcoat', 'Tshirt', 'Polo Tee', 'Suit', 'Sweater', 'Vest'] },
    { id: 'cat-2', name: 'Bottoms', items: ['Pants', 'Shorts', 'Dress', 'Jeans', 'Skirt', 'Trousers'] },
    { id: 'cat-3', name: 'Accessories', items: ['Socks', 'Shoes', 'Hat', 'Scarf', 'Gloves', 'Neck Tie', 'Bag', 'Cap'] },
    { id: 'cat-4', name: 'Bedding', items: ['Duvet 3.5FT', 'Duvet 5FT', 'Duvet 6FT', 'Comforter 3.5FT', 'Comforter 5FT', 'Comforter 6FT', 'Topper 6FT', 'Topper 5FT', 'Topper 3FT', 'Bedsheet 6FT', 'Bedsheet 3.5FT', 'Bedsheet 5FT', 'Pillowcase', 'Pillow', 'Boster Pillow', 'Boster Pillowcase'] },
    { id: 'cat-5', name: 'Under Garments', items: ['Bra', 'Sports Bra', 'Boxers', 'Underwear', 'Swimming Suit', 'Jump Suit'] }
];

const defaultClothingTypes = [
    { name: 'Shirt', name_th: 'เสื้อเชิ้ต' }, { name: 'Blouse', name_th: 'เสื้อสตรี' }, { name: 'Pants', name_th: 'กางเกงขายาว' },
    { name: 'Shorts', name_th: 'กางเกงขาสั้น' }, { name: 'Underwear', name_th: 'กางเกงใน' }, { name: 'Dress', name_th: 'ชุดเดรส' },
    { name: 'Jacket', name_th: 'เสื้อแจ็คเก็ต' }, { name: 'Socks', name_th: 'ถุงเท้า' }, { name: 'Shoes', name_th: 'รองเท้า' },
    { name: 'Hat', name_th: 'หมวก' }, { name: 'Scarf', name_th: 'ผ้าพันคอ' }, { name: 'Gloves', name_th: 'ถุงมือ' },
    { name: 'Bedding', name_th: 'เครื่องนอน' }, { name: 'Bag', name_th: 'กระเป๋า' }, { name: 'Neck Tie', name_th: 'เนกไท' },
    { name: 'Overcoat', name_th: 'เสื้อโค้ท' }, { name: 'Suit', name_th: 'ชุดสูท' }, { name: 'Tshirt', name_th: 'เสื้อยืด' },
    { name: 'Polo Tee', name_th: 'เสื้อโปโล' }, { name: 'Sweater', name_th: 'เสื้อกันหนาว' }, { name: 'Vest', name_th: 'เสื้อกั๊ก' },
    { name: 'Jeans', name_th: 'กางเกงยีนส์' }, { name: 'Skirt', name_th: 'กระโปรง' }, { name: 'Trousers', name_th: 'กางเกงสแล็ค' },
    { name: 'Cap', name_th: 'หมวกแก๊ป' }, { name: 'Bra', name_th: 'ยกทรง' }, { name: 'Sports Bra', name_th: 'สปอร์ตบรา' },
    { name: 'Boxers', name_th: 'กางเกงบ็อกเซอร์' }, { name: 'Swimming Suit', name_th: 'ชุดว่ายน้ำ' }, { name: 'Jump Suit', name_th: 'ชุดจั๊มสูท' },
    { name: 'Duvet 3.5FT', name_th: 'ผ้านวม 3.5 ฟุต' }, { name: 'Duvet 5FT', name_th: 'ผ้านวม 5 ฟุต' }, { name: 'Duvet 6FT', name_th: 'ผ้านวม 6 ฟุต' },
    { name: 'Comforter 3.5FT', name_th: 'ผ้านวมหนา 3.5 ฟุต' }, { name: 'Comforter 5FT', name_th: 'ผ้านวมหนา 5 ฟุต' }, { name: 'Comforter 6FT', name_th: 'ผ้านวมหนา 6 ฟุต' },
    { name: 'Topper 6FT', name_th: 'ท็อปเปอร์ 6 ฟุต' }, { name: 'Topper 5FT', name_th: 'ท็อปเปอร์ 5 ฟุต' }, { name: 'Topper 3FT', name_th: 'ท็อปเปอร์ 3 ฟุต' },
    { name: 'Bedsheet 6FT', name_th: 'ผ้าปูที่นอน 6 ฟุต' }, { name: 'Bedsheet 3.5FT', name_th: 'ผ้าปูที่นอน 3.5 ฟุต' }, { name: 'Bedsheet 5FT', name_th: 'ผ้าปูที่นอน 5 ฟุต' },
    { name: 'Pillowcase', name_th: 'ปลอกหมอน' }, { name: 'Pillow', name_th: 'หมอน' }, { name: 'Boster Pillow', name_th: 'หมอนข้าง' }, { name: 'Boster Pillowcase', name_th: 'ปลอกหมอนข้าง' }
];

const defaultBrands = [
    { name: 'Adidas' }, { name: 'AIIZ' }, { name: 'Armani' }, { name: 'Armani Exchange' }, { name: 'Asics' },
    { name: 'Balenciaga' }, { name: 'Baleno' }, { name: 'Bape' }, { name: 'Bossini' }, { name: 'Bottega Veneta' },
    { name: 'Burberry' }, { name: 'Calvin Klein' }, { name: 'Champion' }, { name: 'Chanel' }, { name: 'Converse' },
    { name: 'Diesel' }, { name: 'Dior' }, { name: 'Dolce & Gabbana' }, { name: 'Fendi' }, { name: 'Fila' },
    { name: 'Forever 21' }, { name: 'G2000' }, { name: 'GAP' }, { name: 'Gentle Woman' }, { name: 'Giordano' },
    { name: 'Givenchy' }, { name: 'GOYARD' }, { name: 'Gucci' }, { name: 'Guess' }, { name: 'Hermès' },
    { name: 'H&M' }, { name: 'Hugo Boss' }, { name: 'Jimmy Choo' }, { name: 'Kenzo' }, { name: 'Lacoste' },
    { name: 'Levi\'s' }, { name: 'Louis Vuitton' }, { name: 'Mango' }, { name: 'Massimo Dutti' }, { name: 'Moncler' },
    { name: 'New Balance' }, { name: 'Nike' }, { name: 'Off-White' }, { name: 'Patagonia' }, { name: 'Prada' },
    { name: 'Puma' }, { name: 'Ralph Lauren' }, { name: 'Reebok' }, { name: 'Saint Laurent' }, { name: 'Stussy' },
    { name: 'Superdry' }, { name: 'Supreme' }, { name: 'The North Face' }, { name: 'Tommy Hilfiger' }, { name: 'Under Armour' },
    { name: 'Uniqlo' }, { name: 'Valentino' }, { name: 'Vanity' }, { name: 'Vans' }, { name: 'Versace' }, { name: 'Zara' }
];

// Current active data model initialized with defaults then updated from PostgreSQL backend
let orders = [...defaultMockOrders];
let clothingTypes = [...defaultClothingTypes];
let categories = [...defaultCategories];
let clothingBrands = [...defaultBrands];
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
        
        "Wash & Fold": "Wash/Fold",
        "Wash/Fold": "Wash/Fold",
        "Wash/Iron": "Wash/Iron",
        "Wash/Iron/Hang": "Wash/Iron/Hang",
        "Dry Clean": "Dry Clean",
        "Dry Cleaning": "Dry Clean",
        "Ironing Only": "Ironing Only",
        "Pcs": "Pcs",
        "Linens": "Linens",
        "Premium Care": "Premium Care",
        
        wash_fold: "Wash/Fold",
        wash_iron: "Wash/Iron",
        wash_iron_hang: "Wash/Iron/Hang",
        dry_clean: "Dry Clean",
        dry_cleaning: "Dry Clean",
        ironing_only: "Ironing Only",
        pcs: "Pcs",
        linens: "Linens",
        premium_care: "Premium Care",
        checklists_tracker: "Unperformed Checklists Tracker",
        filter_dept: "Filter Department:",
        dept_role: "Department Role",
        pending_depts: "Pending Dept Checklists",
        verified_summary: "Verified Items Summary",
        discrepancy_status: "Discrepancy Status",
        items_categories_tab: "Items & Categories",
        brand_database_tab: "Brand Database",
        user_privileges_tab: "User Privileges & Roles",
        verification_logs_tab: "Verification Logs",
        english_item_name: "English Item Name",
        thai_item_name: "Thai Item Name",
        myanmar_item_name: "Myanmar Item Name",
        create_staff_user: "Create Staff User & Assign Department Privilege",
        staff_name: "Staff Name",
        username: "Username",
        dept_privilege: "Department Privilege",
        security_pin: "Security PIN (4 digits)",
        staff_directory: "Staff Directory & Department Roles",
        system_verification_logs: "System Verification Logs",
        timestamp: "Timestamp",
        item_tracking_id: "Item Tracking ID",
        board_status: "Board Status",
        order_activity_history: "📜 Order Activity History & Audit Trail",
        verify_transfer: "Verify Transfer",
        verify_transfer_desc: "Please scan or verify each item before the transfer is completed.",
        cancel_transfer: "Cancel Transfer",
        confirm_transfer: "Confirm Transfer",
        take_photo: "Take Photo",
        switch_staff_user: "👤 Switch Staff / Department User",
        switch_staff_desc: "Select staff user or enter 4-digit PIN to switch active department context:",
        or_enter_pin: "Or enter PIN:",
        verify_btn: "Verify",
        dept_checklist_verification: "Department Checklist Verification",
        dept_checklist_desc: "Verify each item tag for your department before submitting:",
        cancel_btn: "Cancel",
        complete_dept_checklist: "Complete Department Checklist",
        discrepancy_locked: "Discrepancy Gatekeeper Locked",
        discrepancy_detected: "A discrepancy was detected in this order:",
        discrepancy_pin_desc: "This order is locked from proceeding further. A Manager must enter their 4-digit PIN to approve the discrepancy override:",
        no_items: "No items added yet.",
        brand_database: "3. Brand Database",
        add_brand: "Add Brand",
        ai_visual_search: "AI Visual Search",
        ai_matcher_title: "AI Lost Item Visual Search & Matcher",
        ai_matcher_desc: "Missing or detached item tag? Take or upload a photo of the untagged garment. AI will analyze visual features, colors, and defect records to match the item to its original customer order.",
        mobile_app: "Mobile & Tablet App",
        mobile_apk: "Mobile App & APK",
        mobile_section_title: "📱 Mobile Phone & Tablet App Download Center",
        mobile_section_desc: "Install the app on Android phones, iPads, or tablets. Use your phone camera to scan garment QR tags, verify order item quantities, and manage department checklists on the move."
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
        
        "Wash & Fold": "ซัก/พับ",
        "Wash/Fold": "ซัก/พับ",
        "Wash/Iron": "ซัก/รีด",
        "Wash/Iron/Hang": "ซัก/รีด/แขวน",
        "Dry Clean": "ซักแห้ง",
        "Dry Cleaning": "ซักแห้ง",
        "Ironing Only": "รีดเท่านั้น",
        "Pcs": "รายชิ้น",
        "Linens": "เครื่องนอน/ผ้าปู",
        "Premium Care": "ดูแลพิเศษพรีเมียม",
        
        wash_fold: "ซัก/พับ",
        wash_iron: "ซัก/รีด",
        wash_iron_hang: "ซัก/รีด/แขวน",
        dry_clean: "ซักแห้ง",
        dry_cleaning: "ซักแห้ง",
        ironing_only: "รีดเท่านั้น",
        pcs: "รายชิ้น",
        linens: "เครื่องนอน/ผ้าปู",
        premium_care: "ดูแลพิเศษพรีเมียม",
        checklists_tracker: "ติดตามรายการสแกนตรวจสอบ",
        filter_dept: "ตัวกรองแผนก:",
        dept_role: "บทบาทแผนก",
        pending_depts: "แผนกที่ยังไม่ได้สแกนตรวจสอบ",
        verified_summary: "สรุปรายการที่ตรวจสอบแล้ว",
        discrepancy_status: "สถานะข้อผิดพลาดจำนวน",
        items_categories_tab: "รายการผ้าและหมวดหมู่",
        brand_database_tab: "ฐานข้อมูลแบรนด์",
        user_privileges_tab: "สิทธิ์ผู้ใช้งานและบทบาท",
        verification_logs_tab: "ประวัติบันทึกการตรวจสอบ",
        english_item_name: "ชื่อภาษาอังกฤษ",
        thai_item_name: "ชื่อภาษาไทย",
        myanmar_item_name: "ชื่อภาษาพม่า",
        create_staff_user: "สร้างผู้ใช้งานและกำหนดสิทธิ์แผนก",
        staff_name: "ชื่อพนักงาน",
        username: "ชื่อผู้ใช้งาน",
        dept_privilege: "สิทธิ์หน้าที่แผนก",
        security_pin: "รหัส PIN ความปลอดภัย (4 หลัก)",
        staff_directory: "รายชื่อพนักงานและบทบาทแผนก",
        system_verification_logs: "บันทึกประวัติการตรวจสอบระบบ",
        timestamp: "เวลาที่บันทึก",
        item_tracking_id: "รหัสติดตามชิ้นผ้า",
        board_status: "สถานะกระดาน",
        order_activity_history: "📜 ประวัติการทำรายการและประวัติบันทึกการตรวจสอบ",
        verify_transfer: "ตรวจสอบการย้ายสถานะ",
        verify_transfer_desc: "กรุณาสแกนหรือตรวจสอบรายการผ้าทุกชิ้นก่อนยืนยันการย้ายสถานะ",
        cancel_transfer: "ยกเลิกการย้าย",
        confirm_transfer: "ยืนยันการย้ายสถานะ",
        take_photo: "ถ่ายภาพ",
        switch_staff_user: "👤 สลับผู้ใช้งานพนักงาน / แผนก",
        switch_staff_desc: "เลือกพนักงานหรือกรอก PIN 4 หลักเพื่อเปลี่ยนสิทธิ์แผนก:",
        or_enter_pin: "หรือกรอกรหัส PIN:",
        verify_btn: "ยืนยัน",
        dept_checklist_verification: "การตรวจสอบรายการเช็กลิสต์ประจำแผนก",
        dept_checklist_desc: "ตรวจสอบป้ายแท็กผ้าทุกชิ้นสำหรับแผนกของคุณก่อนบันทึก:",
        cancel_btn: "ยกเลิก",
        complete_dept_checklist: "เสร็จสิ้นการตรวจสอบแผนก",
        discrepancy_locked: "ระบบล็อกเนื่องจากจำนวนผ้าไม่ตรงกัน",
        discrepancy_detected: "ตรวจพบข้อผิดพลาดจำนวนผ้าในออเดอร์นี้:",
        discrepancy_pin_desc: "ออเดอร์นี้ถูกล็อกไม่ให้ดำเนินการต่อ ผู้จัดการต้องกรอก PIN 4 หลักเพื่ออนุมัติปลดล็อก:",
        no_items: "ยังไม่มีรายการผ้าที่เพิ่ม",
        brand_database: "3. ฐานข้อมูลแบรนด์",
        add_brand: "เพิ่มแบรนด์",
        ai_visual_search: "ค้นหาด้วย AI ด้วยภาพถ่าย",
        ai_matcher_title: "ระบบค้นหาผ้าหลุดแท็กด้วย AI Visual Matcher",
        ai_matcher_desc: "ป้ายแท็กผ้าหลุดหายหรือไม่ชัดเจน? ถ่ายหรืออัปโหลดรูปผ้าที่ไม่มีแท็ก ระบบ AI จะวิเคราะห์สี ประเภทผ้า และภาพถ่ายเดิม เพื่อจับคู่กับออเดอร์ลูกค้าที่ถูกต้อง",
        mobile_app: "แอปมือถือและแท็บเล็ต",
        mobile_apk: "ดาวน์โหลด APK มือถือ",
        mobile_section_title: "📱 ศูนย์ดาวน์โหลดแอปมือถือและแท็บเล็ต",
        mobile_section_desc: "ติดตั้งแอปบนโทรศัพท์ Android, iPad หรือแท็บเล็ต ใช้กล้องมือถือสแกนคิวอาร์แท็กผ้า ตรวจสอบจำนวนชิ้นผ้าในออเดอร์ และจัดการรายการเช็กลิสต์ประจำแผนกได้อย่างสะดวก"
    },
    my: {
        dashboard: "ဒက်ရှ်ဘုတ် ပင်မစာမျက်နှာ",
        new_order: "အော်ဒါအသစ် မှတ်ပုံတင်ရန်",
        tracking_board: "အဆင့်များ စောင့်ကြည့်စုတ်ကွက်",
        checklists_tracker: "စစ်ဆေးရန်ကျန် စာရင်းများ",
        admin_panel: "စနစ် ဆက်တင်များ",
        manager: "မန်နေဂျာ",
        
        search_placeholder: "အော်ဒါ၊ ဝယ်ယူသူ သို့မဟုတ် ID ရှာရန်...",
        
        total_orders: "စုစုပေါင်း အော်ဒါများ",
        in_progress: "ဆောင်ရွက်ဆဲ",
        ready_pickup: "ထုတ်ယူရန် အသင့်ဖြစ်ပြီ",
        delivered_today: "ယနေ့ လွှဲပြောင်းပေးအပ်ပြီး",
        recent_orders: "နောက်ဆုံး ရရှိသော အော်ဒါများ",
        view_all: "အားလုံးကြည့်ရှုမည်",
        order_id: "အော်ဒါ နံပါတ်",
        customer: "ဝယ်ယူသူ",
        service_type: "ဝန်ဆောင်မှု အမျိုးအစား",
        status: "အခြေအနေ",
        date: "ရက်စွဲ",
        action: "လုပ်ဆောင်ချက်",
        
        register_title: "အော်ဒါအသစ် မှတ်ပုံတင်ရန်",
        order_info: "၁။ အော်ဒါ အချက်အလက်",
        order_number: "အော်ဒါ နံပါတ်",
        customer_name: "ဝယ်ယူသူ အမည်",
        phone_number: "ဖုန်းနံပါတ်",
        clear_btn: "ရှင်းလင်းမည်",
        submit_order: "အော်ဒါ ပေးပို့မည်",
        add_item: "၂။ အဝတ်အထည် ထည့်သွင်းရန်",
        select_clothing: "အဝတ်အထည် အမျိုးအစား ရွေးချယ်ပါ",
        or_custom_item: "သို့မဟုတ် စိတ်ကြိုက်အမည် ရိုက်ထည့်ပါ",
        custom_item_placeholder: "ဥပမာ- ပိုးပဝါ၊ စောင်",
        brand_optional: "တံဆိပ် (မဖြစ်မနေ မဟုတ်ပါ)",
        color: "အရောင်",
        photo_optional: "ဓာတ်ပုံ (မဖြစ်မနေ မဟုတ်ပါ)",
        add_photo: "ဓာတ်ပုံထည့်မည်",
        no_image: "ဓာတ်ပုံမရှိပါ",
        issue_level: "ပျက်စီးမှု အဆင့်",
        normal: "ပုံမှန်",
        issue: "အနည်းငယ် ပျက်စီး",
        extreme: "အလွန် ပျက်စီး",
        add_item_btn: "အထည် ထည့်သွင်းမည်",
        current_items: "၃။ ထည့်သွင်းထားသော အထည်များ",
        item: "အထည် အမျိုးအစား",
        items_brand: "တံဆိပ်",
        items_color: "အရောင်",
        items_defects: "အပြစ်အဆာ",
        items_qr: "QR တံဆိပ်",
        items_action: "လုပ်ဆောင်ချက်",
        item_service: "သီးသန့် ဝန်ဆောင်မှု",
        same_as_order: "အဓိက အော်ဒါအတိုင်း",
        defect_optional: "အပြစ်အဆာ (မဖြစ်မနေ မဟုတ်ပါ)",
        mixed_services: "ရောနှော ဝန်ဆောင်မှု",
        
        Received: "လက်ခံရရှိပြီး",
        "Wash & Dry": "လျှော်ဖွပ်ပြီး အခြောက်ခံ",
        Ironing: "မီးပူတိုက်ဆဲ",
        Packing: "ထုပ်ပိုးဆဲ",
        Ready: "ထုတ်ယူရန် အသင့်ဖြစ်ပြီ",
        Delivered: "လွှဲပြောင်းပေးအပ်ပြီး",
        
        admin_settings: "စနစ် ဆက်တင်များ",
        items_library: "၁။ စံအဝတ်အထည် စာရင်း",
        category_board: "၂။ အမျိုးအစား စုတ်ကွက်",
        create_category: "အမျိုးအစား အသစ်ဖန်တီးမည်",
        drag_assign: "စံအထည်များ (အမျိုးအစားဆီသို့ ဆွဲထည့်ပါ):",
        all_assigned: "အထည်များ အားလုံး အမျိုးအစား ခွဲခြားပြီးပါပြီ",
        drag_here: "ဒီနေရာသို့ ဆွဲထည့်ပါ",
        no_categories: "အမျိုးအစား မရှိသေးပါ",
        
        order_details: "အော်ဒါ အသေးစိတ်",
        date_submitted: "ရက်စွဲ",
        items_list: "အထည်များ စာရင်း",
        close: "ပိတ်မည်",
        print_tag: "တံဆိပ် ရိုက်နှိပ်မည်",
        
        "Wash & Fold": "လျှော်/ခေါက်",
        "Wash/Fold": "လျှော်/ခေါက်",
        "Wash/Iron": "လျှော်/မီးပူတိုက်",
        "Wash/Iron/Hang": "လျှော်/မီးပူ/လန်း",
        "Dry Clean": "အခြောက်လျှော်",
        "Dry Cleaning": "အခြောက်လျှော်",
        "Ironing Only": "မီးပူတိုက် သက်သက်",
        "Pcs": "တစ်ထည်ချင်း",
        "Linens": "အိပ်ရာခင်း/အထည်",
        "Premium Care": "အထူးဂရုစိုက် စောင့်ရှောက်မှု",
        
        wash_fold: "လျှော်/ခေါက်",
        wash_iron: "လျှော်/မီးပူတိုက်",
        wash_iron_hang: "လျှော်/မီးပူ/လန်း",
        dry_clean: "အခြောက်လျှော်",
        dry_cleaning: "အခြောက်လျှော်",
        ironing_only: "မီးပူတိုက် သက်သက်",
        pcs: "တစ်ထည်ချင်း",
        linens: "အိပ်ရာခင်း/အထည်",
        premium_care: "အထူးဂရုစိုက် စောင့်ရှောက်မှု",
        checklists_tracker: "စစ်ဆေးရန်ကျန် စာရင်းများ",
        filter_dept: "ဌာနအလိုက် စစ်ထုတ်ရန်:",
        dept_role: "ဌာန အခန်းကဏ္ဍ",
        pending_depts: "စစ်ဆေးရန်ကျန် ဌာနများ",
        verified_summary: "စစ်ဆေးပြီး အထည်များ အကျဉ်းချုပ်",
        discrepancy_status: "ကွဲလွဲမှု အခြေအနေ",
        items_categories_tab: "အထည်များ နှင့် အမျိုးအစားများ",
        brand_database_tab: "တံဆိပ် စာရင်း",
        user_privileges_tab: "အသုံးပြုသူ လုပ်ပိုင်ခွင့်များ",
        verification_logs_tab: "စစ်ဆေးမှု မှတ်တမ်းများ",
        english_item_name: "အင်္ဂလိပ် အမည်",
        thai_item_name: "ထိုင်း အမည်",
        myanmar_item_name: "မြန်မာ အမည်",
        create_staff_user: "ဝန်ထမ်း အသစ်ဖန်တီးပြီး ဌာန လုပ်ပိုင်ခွင့် သတ်မှတ်မည်",
        staff_name: "ဝန်ထမ်း အမည်",
        username: "အသုံးပြုသူ အမည်",
        dept_privilege: "ဌာန လုပ်ပိုင်ခွင့်",
        security_pin: "လုံခြုံရေး PIN နံပါတ် (၄ လုံး)",
        staff_directory: "ဝန်ထမ်း စာရင်း နှင့် ဌာန အခန်းကဏ္ဍများ",
        system_verification_logs: "စနစ် စစ်ဆေးမှု မှတ်တမ်းများ",
        timestamp: "အချိန် မှတ်တမ်း",
        item_tracking_id: "အထည် စောင့်ကြည့်ရည်ညွှန်း နံပါတ်",
        board_status: "စုတ်ကွက် အခြေအနေ",
        order_activity_history: "📜 အော်ဒါ လုပ်ဆောင်ချက် မှတ်တမ်း",
        verify_transfer: "လွှဲပြောင်းမှု စစ်ဆေးမည်",
        verify_transfer_desc: "လွှဲပြောင်းမှု မပြီးမီ အထည်တစ်ခုချင်းစီကို စစ်ဆေးပါ",
        cancel_transfer: "လွှဲပြောင်းမှု ပယ်ဖျက်မည်",
        confirm_transfer: "လွှဲပြောင်းမှု အတည်ပြုမည်",
        take_photo: "ဓာတ်ပုံ ရိုက်မည်",
        switch_staff_user: "👤 ဝန်ထမ်း / ဌာန အသုံးပြုသူ ပြောင်းလဲမည်",
        switch_staff_desc: "ဌာန ပြောင်းရန် ဝန်ထမ်း ရွေးပါ သို့မဟုတ် PIN ရိုက်ထည့်ပါ:",
        or_enter_pin: "သို့မဟုတ် PIN ရိုက်ထည့်ပါ:",
        verify_btn: "စစ်ဆေးမည်",
        dept_checklist_verification: "ဌာန စစ်ဆေးရန် စာရင်း စစ်ဆေးမှု",
        dept_checklist_desc: "မပေးပို့မီ သင်၏ ဌာနအတွက် အထည် တံဆိပ်တစ်ခုချင်းစီကို စစ်ဆေးပါ:",
        cancel_btn: "ပယ်ဖျက်မည်",
        complete_dept_checklist: "ဌာန စစ်ဆေးမှု ပြီးမြောက်ပါပြီ",
        discrepancy_locked: "အရေအတွက် ကွဲလွဲမှုကြောင့် သော့ခတ်ထားသည်",
        discrepancy_detected: "ဒီအော်ဒါမှာ အရေအတွက် ကွဲလွဲမှု တွေ့ရှိရပါသည်:",
        discrepancy_pin_desc: "ဒီအော်ဒါကို ရှေ့ဆက်မသွားနိုင်အောင် သော့ခတ်ထားသည်။ မန်နေဂျာက PIN ၄ လုံး ရိုက်ထည့်မှသာ အတည်ပြုနိုင်မည်:",
        no_items: "အထည်များ မထည့်သွင်းရသေးပါ",
        brand_database: "၃။ တံဆိပ် စာရင်း",
        add_brand: "တံဆိပ် ထည့်သွင်းမည်",
        ai_visual_search: "AI ဓာတ်ပုံ ရှာဖွေမှု",
        ai_matcher_title: "တံဆိပ်ပျောက် အထည်များ AI ဓာတ်ပုံဖြင့် ရှာဖွေစနစ်",
        ai_matcher_desc: "အထည် တံဆိပ် ပျောက်ဆုံးနေပါသလား။ တံဆိပ်မပါသော အထည်၏ ဓာတ်ပုံကို ရိုက်ပါ သို့မဟုတ် တင်ပါ၊ AI က အရောင်၊ အထည်အမျိုးအစားနှင့် မူလဓာတ်ပုံများကို ခွဲခြမ်းစိတ်ဖြာ၍ မူလအော်ဒါနှင့် ကိုက်ညီအောင် ရှာဖွေပေးပါမည်။",
        mobile_app: "မိုဘိုင်း နှင့် တက်ဘလတ် အက်ပ်",
        mobile_apk: "မိုဘိုင်း APK ဒေါင်းလုဒ်",
        mobile_section_title: "📱 မိုဘိုင်း ဖုန်း နှင့် တက်ဘလတ် အက်ပ် ဒေါင်းလုဒ် စင်တာ",
        mobile_section_desc: "Android ဖုန်း၊ iPad သို့မဟုတ် တက်ဘလတ်များတွင် အက်ပ် ထည့်သွင်းပါ။ ဖုန်း ကင်မရာဖြင့် အထည် QR တံဆိပ်များကို စကန်ဖတ်ပါ၊ အော်ဒါ အရေအတွက်များကို စစ်ဆေးပါ၊ ဌာနအလိုက် စစ်ဆေးမှု စာရင်းများကို လွယ်ကူစွာ စီမံပါ။"
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

const itemTranslationsMy = {
    'Shirt': 'တီရှပ် အင်္ကျီ',
    'Formal': 'ရှပ်အင်္ကျီ',
    'Blouse': 'အမျိုးသမီး အင်္ကျီ',
    'Pants': 'ဘောင်းဘီရှည်',
    'Shorts': 'ဘောင်းဘီတို',
    'Underwear': 'အတွင်းခံ',
    'Dress': 'ဂါဝန်',
    'Jacket': 'ဂျာကင် အင်္ကျီ',
    'Socks': 'ခြေအိတ်',
    'Shoes': 'ရှူးဖိနပ်',
    'Hat': 'ဦးထုပ်',
    'Scarf': 'ပဝါ',
    'Gloves': 'လက်အိတ်',
    'Bedding': 'အိပ်ရာခင်း အထည်',
    'Bag': 'အိတ်',
    'Neck Tie': 'နက်ကတိုင်',
    'Overcoat': 'ကုတ်အင်္ကျီရှည်',
    'Suit': 'ဝတ်စုံကုတ်',
    'Other': 'အခြား'
};

const categoryTranslations = {
    'Tops': 'ท่อนบน',
    'Bottoms': 'ท่อนล่าง',
    'Accessories': 'เครื่องประดับ',
    'Bedding': 'เครื่องนอน'
};

const categoryTranslationsMy = {
    'Tops': 'အထက်ပိုင်း အင်္ကျီ',
    'Bottoms': 'အောက်ပိုင်း ဘောင်းဘီ',
    'Accessories': 'အသုံးအဆောင်များ',
    'Bedding': 'အိပ်ရာခင်း အထည်'
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

const colorTranslationsMy = {
    'White': 'အဖြူရောင်',
    'Black': 'အနက်ရောင်',
    'Blue': 'အပြာရောင်',
    'Navy': 'ရဲပြာရောင်',
    'Red': 'အနီရောင်',
    'Green': 'အစိမ်းရောင်',
    'Yellow': 'အဝါရောင်',
    'Orange': 'လိမ္မော်ရောင်',
    'Purple': 'ခရမ်းရောင်',
    'Pink': 'ပန်းရောင်',
    'Grey': 'မီးခိုးရောင်',
    'Brown': 'အညိုရောင်',
    'Teal': 'ရေပြာစိမ်း',
    'Cream': 'နို့ဆီရောင်',
    'Beige': 'မလိုင်ရောင်',
    'Peach': 'မက်မွန်ရောင်',
    'Khaki': 'ကာကီရောင်',
    'Olive': 'သလွတ်စိမ်းရောင်',
    'Sky Blue': 'မိုးပြာရောင်',
    'Burgundy': 'ဝိုင်နီရောင်',
    'Black/White': 'အနက်/အဖြူ',
    'Blue/White': 'အပြာ/အဖြူ',
    'Red/White': 'အနီ/အဖြူ'
};

const translateColorName = (name) => {
    if (currentLanguage === 'th') {
        return colorTranslations[name] || name;
    }
    if (currentLanguage === 'my') {
        return colorTranslationsMy[name] || name;
    }
    return name;
};

let currentLanguage = localStorage.getItem('tls_language') || 'en';

const t = (key) => {
    return (i18n[currentLanguage] && i18n[currentLanguage][key]) ? i18n[currentLanguage][key] : key;
};

const getItemThName = (name) => {
    if (!name) return '';
    const itemObj = clothingTypes.find(t => (typeof t === 'object' ? t.name : t).toLowerCase() === name.toLowerCase());
    if (itemObj && typeof itemObj === 'object' && itemObj.name_th) {
        return itemObj.name_th;
    }
    return itemTranslations[name] || '';
};

const getItemMyName = (name) => {
    if (!name) return '';
    const itemObj = clothingTypes.find(t => (typeof t === 'object' ? t.name : t).toLowerCase() === name.toLowerCase());
    if (itemObj && typeof itemObj === 'object' && itemObj.name_my) {
        return itemObj.name_my;
    }
    return itemTranslationsMy[name] || '';
};

const translateItemName = (name) => {
    if (!name) return '';
    const itemObj = clothingTypes.find(t => (typeof t === 'object' ? t.name : t).toLowerCase() === name.toLowerCase());
    if (currentLanguage === 'th') {
        if (itemObj && typeof itemObj === 'object' && itemObj.name_th) {
            return itemObj.name_th;
        }
        if (itemTranslations[name]) {
            return itemTranslations[name];
        }
    } else if (currentLanguage === 'my') {
        if (itemObj && typeof itemObj === 'object' && itemObj.name_my) {
            return itemObj.name_my;
        }
        if (itemTranslationsMy[name]) {
            return itemTranslationsMy[name];
        }
    }
    return itemObj && typeof itemObj === 'object' ? itemObj.name : name;
};

const getCategoryThName = (name) => {
    if (!name) return '';
    const catObj = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (catObj && catObj.name_th) return catObj.name_th;
    return categoryTranslations[name] || '';
};

const getCategoryMyName = (name) => {
    if (!name) return '';
    const catObj = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (catObj && catObj.name_my) return catObj.name_my;
    return categoryTranslationsMy[name] || '';
};

const translateCategoryName = (name) => {
    if (!name) return '';
    const catObj = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (currentLanguage === 'th') {
        if (catObj && catObj.name_th) return catObj.name_th;
        if (categoryTranslations[name]) return categoryTranslations[name];
    } else if (currentLanguage === 'my') {
        if (catObj && catObj.name_my) return catObj.name_my;
        if (categoryTranslationsMy[name]) return categoryTranslationsMy[name];
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
        if (currentLanguage === 'en') toggleText.textContent = 'EN';
        else if (currentLanguage === 'th') toggleText.textContent = 'TH';
        else if (currentLanguage === 'my') toggleText.textContent = 'MY';
    }
};

// Language Toggle Event Listener
const langToggleBtn = document.getElementById('langToggleBtn');
if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
        if (currentLanguage === 'en') {
            currentLanguage = 'th';
        } else if (currentLanguage === 'th') {
            currentLanguage = 'my';
        } else {
            currentLanguage = 'en';
        }
        
        try {
            localStorage.setItem('tls_language', currentLanguage);
        } catch (e) {
            console.warn('Could not save tls_language to localStorage:', e);
        }
        
        applyTranslations();
        initItemTypeButtons();
        initBrandButtons();
        renderAdminItems();
        renderAdminBrands();
        refreshAllViews();
        
        showToast(
            currentLanguage === 'th' ? 'เปลี่ยนภาษาเป็น ภาษาไทย แล้ว' :
            (currentLanguage === 'my' ? 'မြန်မာဘာသာသို့ ပြောင်းလဲပြီးပါပြီ' : 'Language switched to English'),
            'info'
        );
    });
}

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
    safeCreateIcons();
    
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
    
    safeCreateIcons();
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
    
    safeCreateIcons();
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
    safeCreateIcons();
    tbody.querySelectorAll('tr[data-id]').forEach(row => {
        row.onclick = () => {
            const orderId = row.dataset.id;
            if (orderId) window.openOrderModal(orderId);
        };
    });
};

const getOrderColumnStatus = (orderStatus) => {
    if (!orderStatus) return 'Received';
    const s = String(orderStatus).trim().toLowerCase();
    
    if (s === 'received' || s === 'new' || s === 'pending') return 'Received';
    if (s === 'wash & dry' || s === 'washing' || s === 'drying' || s === 'wash & fold' || s === 'wash/fold' || s === 'wash/iron/hang' || s === 'dry clean' || s === 'dry cleaning' || s === 'in progress' || s === 'processing' || s === 'mixed services') return 'Wash & Dry';
    if (s === 'ironing' || s === 'iron' || s === 'wash/iron' || s === 'ironing only') return 'Ironing';
    if (s === 'packing' || s === 'pack') return 'Packing';
    if (s === 'ready' || s === 'ready for delivery') return 'Ready';
    if (s === 'delivered' || s === 'completed') return 'Delivered';
    
    return 'Received'; // Catch-all safe default
};

const isStatusInColumn = (orderStatus, columnStatus) => {
    return getOrderColumnStatus(orderStatus).toLowerCase() === String(columnStatus).trim().toLowerCase();
};

const updateKanbanBoard = () => {
    if (!Array.isArray(orders)) return;
    
    statuses.forEach(status => {
        const column = document.querySelector(`.kanban-column[data-status="${status}"] .kanban-cards`);
        if(!column) return;
        
        const columnOrders = orders.filter(o => isStatusInColumn(o.status, status));
        
        column.innerHTML = columnOrders.map(order => {
            const itemsArr = Array.isArray(order.items) ? order.items : [];
            const totalItemsText = currentLanguage === 'th'
                ? `${itemsArr.length} รายการ`
                : `${itemsArr.length} ${itemsArr.length === 1 ? 'item' : 'items'}`;
            
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
            <div class="kanban-card" draggable="true" data-id="${order.id}" style="cursor: pointer;">
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
    
    safeCreateIcons();
    setupDragAndDrop();

    // Bind click listeners on Kanban cards to expand order details modal
    document.querySelectorAll('.kanban-card').forEach(card => {
        card.onclick = (e) => {
            if (e.target.tagName === 'IMG' || e.target.closest('button')) return;
            const orderId = card.dataset.id;
            if (orderId) window.openOrderModal(orderId);
        };
    });
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

        if (viewId === 'checklists') {
            loadPendingChecklistsTracker();
        } else if (viewId === 'admin') {
            loadUsers();
        }
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
    const allTypeNames = clothingTypes.map(t => typeof t === 'object' ? t.name : t);
    const assignedItems = new Set();
    categories.forEach(cat => {
        if (cat.items) {
            cat.items.forEach(item => assignedItems.add(typeof item === 'object' ? item.name : item));
        }
    });
    const unassignedItems = allTypeNames.filter(item => !assignedItems.has(item));
    
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
            activeGarments = (activeCat.items || []).map(item => typeof item === 'object' ? item.name : item).filter(item => allTypeNames.includes(item));
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
        safeCreateIcons();
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

    const mainOrderService = document.getElementById('serviceType')?.value || 'Wash/Fold';
    
    // Group draft items by effective service type
    const groupedItems = {};
    currentDraftItems.forEach((item, index) => {
        let effectiveService = item.serviceType;
        if (!effectiveService || effectiveService === 'Same as Order') {
            effectiveService = mainOrderService;
        }
        if (!groupedItems[effectiveService]) {
            groupedItems[effectiveService] = [];
        }
        groupedItems[effectiveService].push({ item, index });
    });

    const activeServiceKeys = Object.keys(groupedItems);

    listContainer.innerHTML = activeServiceKeys.map(serviceKey => {
        const itemsInGroup = groupedItems[serviceKey];
        const sectionHeaderTitle = t(serviceKey);

        const cardsHtml = itemsInGroup.map(({ item, index }) => {
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
                            <button type="button" class="cart-item-service-picker-btn" data-index="${index}" title="${currentLanguage === 'th' ? 'คลิกเพื่อเปลี่ยนบริการ' : 'Click to change service'}" style="font-size: 0.7rem; color: #fff; background: var(--primary); border: none; padding: 0.15rem 0.45rem; border-radius: 4px; margin-left: 0.4rem; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; gap: 0.2rem;">
                                ${t(serviceKey)} <i data-lucide="chevron-down" style="width: 10px; height: 10px;"></i>
                            </button>
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
                    
                    <!-- Inline Service Switcher (initially hidden) -->
                    <div class="inline-service-picker" id="inlineServicePicker-${index}" style="display: none; margin-top: 0.5rem; padding-top: 0.4rem; border-top: 1px dashed var(--border-glass); align-items: center; gap: 0.35rem; flex-wrap: wrap;">
                        <span style="font-size: 0.7rem; color: var(--text-muted); margin-right: 0.25rem;">${currentLanguage === 'th' ? 'ย้ายไปบริการ:' : 'Move Service:'}</span>
                        ${['Wash/Fold', 'Wash/Iron', 'Wash/Iron/Hang', 'Dry Clean', 'Pcs', 'Linens'].map(s => `
                            <button type="button" class="inline-service-option ${serviceKey === s ? 'active' : ''}" data-service="${s}" data-item-index="${index}" style="font-size: 0.7rem; padding: 0.2rem 0.45rem; border-radius: 4px; border: 1px solid var(--border-glass); background: ${serviceKey === s ? 'var(--primary)' : '#fff'}; color: ${serviceKey === s ? '#fff' : 'var(--text-main)'}; cursor: pointer; font-weight: 600;">${t(s)}</button>
                        `).join('')}
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

        return `
        <div class="cart-service-group" style="margin-bottom: 0.85rem;">
            <div class="cart-service-header" style="display: flex; align-items: center; justify-content: space-between; padding: 0.4rem 0.75rem; background: var(--primary); color: #fff; border-radius: 8px; font-weight: 700; font-size: 0.82rem; margin-bottom: 0.4rem; letter-spacing: 0.4px; box-shadow: 0 2px 4px rgba(34, 41, 69, 0.1);">
                <span style="display: flex; align-items: center; gap: 0.4rem;">
                    <i data-lucide="layers" style="width: 14px; height: 14px;"></i>
                    ${sectionHeaderTitle}
                </span>
                <span style="font-size: 0.72rem; opacity: 0.95; background: rgba(255,255,255,0.2); padding: 0.1rem 0.45rem; border-radius: 12px;">
                    ${itemsInGroup.length} ${itemsInGroup.length === 1 ? 'item' : 'items'}
                </span>
            </div>
            <div class="cart-service-items" style="display: flex; flex-direction: column; gap: 0.4rem;">
                ${cardsHtml}
            </div>
        </div>
        `;
    }).join('');
    
    if (typeof lucide !== 'undefined') {
        safeCreateIcons();
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

        // 3. Service Tag toggle inline service picker
        listContainer.querySelectorAll('.cart-item-service-picker-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = btn.dataset.index;
                const picker = document.getElementById(`inlineServicePicker-${index}`);
                if (picker) {
                    const isHidden = picker.style.display === 'none';
                    listContainer.querySelectorAll('.inline-service-picker').forEach(p => p.style.display = 'none');
                    picker.style.display = isHidden ? 'flex' : 'none';
                }
            });
        });

        // 4. Inline service option selection
        listContainer.querySelectorAll('.inline-service-option').forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemIndex = parseInt(opt.dataset.itemIndex);
                const newService = opt.dataset.service;
                if (currentDraftItems[itemIndex]) {
                    currentDraftItems[itemIndex].serviceType = newService;
                    renderAddedItems();
                }
            });
        });

        // 5. Color strip toggle inline picker
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

        // 6. Inline color option selection
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

        // 7. Inline custom color picker selection
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
            const exists = clothingTypes.some(t => (typeof t === 'object' ? t.name : t).toLowerCase() === formattedTypeName.toLowerCase());
            if (!exists) {
                clothingTypes.push({ name: formattedTypeName, name_th: '' });
                fetch(`${API_BASE}/clothing-types`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: formattedTypeName, name_th: '' })
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
                // Reset Main Service Type buttons back to Wash/Fold
                const hiddenServiceInput = document.getElementById('serviceType');
                if (hiddenServiceInput) hiddenServiceInput.value = 'Wash/Fold';
                const mainBtnGrp = document.getElementById('mainOrderServiceButtonGroup');
                if (mainBtnGrp) {
                    mainBtnGrp.querySelectorAll('.service-btn').forEach(b => {
                        if (b.dataset.value === 'Wash/Fold') b.classList.add('active');
                        else b.classList.remove('active');
                    });
                }
                
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

// Main Order Service Type Button Group Listener
const mainOrderServiceButtonGroup = document.getElementById('mainOrderServiceButtonGroup');
if (mainOrderServiceButtonGroup) {
    mainOrderServiceButtonGroup.querySelectorAll('.service-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            mainOrderServiceButtonGroup.querySelectorAll('.service-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const val = btn.dataset.value;
            const hiddenInput = document.getElementById('serviceType');
            if (hiddenInput) {
                hiddenInput.value = val;
            }
            renderAddedItems();
        });
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
        
        safeCreateIcons();
    });
}

const loadAllData = async () => {
    try {
        const ordersRes = await fetch(`${API_BASE}/orders`);
        if (ordersRes.ok) {
            const fetchedOrders = await ordersRes.json();
            if (Array.isArray(fetchedOrders) && fetchedOrders.length > 0) {
                orders = fetchedOrders;
            } else {
                orders = [...defaultMockOrders];
            }
        } else {
            orders = [...defaultMockOrders];
        }
    } catch (err) {
        console.warn("Could not fetch orders from backend API, using local orders fallback:", err);
        orders = [...defaultMockOrders];
    }

    try {
        const typesRes = await fetch(`${API_BASE}/clothing-types`);
        if (typesRes.ok) {
            const typesData = await typesRes.json();
            if (Array.isArray(typesData) && typesData.length > 0) {
                clothingTypes = typesData.map(t => typeof t === 'string' ? { name: t, name_th: itemTranslations[t] || '' } : { name: t.name, name_th: t.name_th || itemTranslations[t.name] || '' });
            } else {
                clothingTypes = [...defaultClothingTypes];
            }
        } else {
            clothingTypes = [...defaultClothingTypes];
        }
    } catch (err) {
        console.warn("Error fetching clothing types:", err);
        clothingTypes = [...defaultClothingTypes];
    }
    
    try {
        const catsRes = await fetch(`${API_BASE}/categories`);
        if (catsRes.ok) {
            const catsData = await catsRes.json();
            if (Array.isArray(catsData) && catsData.length > 0) {
                categories = catsData;
            } else {
                categories = [...defaultCategories];
            }
        } else {
            categories = [...defaultCategories];
        }
    } catch (err) {
        console.warn("Error fetching categories:", err);
        categories = [...defaultCategories];
    }
    
    try {
        const brandsRes = await fetch(`${API_BASE}/clothing-brands`);
        if (brandsRes.ok) {
            const brandsData = await brandsRes.json();
            if (Array.isArray(brandsData) && brandsData.length > 0) {
                clothingBrands = brandsData.map(b => typeof b === 'string' ? { name: b } : b);
            } else {
                clothingBrands = [...defaultBrands];
            }
        } else {
            clothingBrands = [...defaultBrands];
        }
    } catch (err) {
        console.warn("Error fetching clothing brands:", err);
        clothingBrands = [...defaultBrands];
    }
    
    // Always refresh views and render UI elements
    refreshAllViews();
    initItemTypeButtons();
    renderAdminItems();
    renderAdminBrands();
    initBrandButtons();
    applyTranslations();
};

const refreshModalActivityLogs = async (targetOrderId) => {
    const historyContainer = document.getElementById('modalOrderActivityLog');
    if (!historyContainer || !targetOrderId) return;
    
    try {
        const res = await fetch(`${API_BASE}/activity-logs/${targetOrderId}`);
        const contentType = res.headers.get('content-type') || '';
        let logs = [];
        if (res.ok && contentType.includes('application/json')) {
            logs = await res.json();
        }
        
        if (logs.length === 0) {
            historyContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 0.5rem;">No activity log recorded yet for Order #${targetOrderId}.</div>`;
            return;
        }
        
        const isManager = activeStaffUser && activeStaffUser.role === 'Manager';

        historyContainer.innerHTML = logs.map(log => {
            const dateObj = new Date(log.created_at || Date.now());
            const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
            
            const deleteBtnHtml = isManager ? `
                <button type="button" class="delete-log-btn" data-log-id="${log.id}" style="background:none; border:none; color:#ef4444; cursor:pointer; padding:0 0.2rem;" title="Delete Log Entry (Admin Only)">
                    <i data-lucide="trash-2" style="width:12px; height:12px;"></i>
                </button>
            ` : '';
            
            return `
                <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px dashed var(--border-glass); padding: 0.3rem 0; font-size: 0.8rem; gap: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.4rem; flex: 1; flex-wrap: wrap;">
                        <span style="font-weight: 700; color: var(--primary);">${log.actor_name}</span>
                        <span class="badge" style="font-size: 0.65rem; padding: 0.1rem 0.35rem; background: rgba(99, 102, 241, 0.1); color: var(--primary);">${log.actor_role}</span>
                        <span style="color: var(--text-main); font-weight: 500;">${log.details}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.4rem; flex-shrink: 0;">
                        <span style="color: var(--text-muted); font-size: 0.72rem;">${dateStr} ${timeStr}</span>
                        ${deleteBtnHtml}
                    </div>
                </div>
            `;
        }).join('');

        safeCreateIcons();

        // Bind delete listeners for Managers
        if (isManager) {
            historyContainer.querySelectorAll('.delete-log-btn').forEach(btn => {
                btn.onclick = async (e) => {
                    e.stopPropagation();
                    const logId = btn.dataset.logId;
                    try {
                        const delRes = await fetch(`${API_BASE}/activity-logs/${logId}`, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userRole: activeStaffUser.role })
                        });
                        const delData = await delRes.json();
                        if (delData.success) {
                            showToast('Activity log deleted by Admin', 'success');
                            refreshModalActivityLogs(targetOrderId);
                        } else {
                            showToast(delData.error || 'Failed to delete log', 'error');
                        }
                    } catch (err) {
                        showToast('Error deleting activity log', 'error');
                    }
                };
            });
        }
    } catch (err) {
        console.error("Error loading activity history:", err);
    }
};

window.openOrderModal = async (orderId) => {
    if (!orderId) return;
    const order = orders.find(o => String(o.id).toLowerCase() === String(orderId).toLowerCase());
    if (!order) {
        showToast(`Order #${orderId} not found in system.`, 'error');
        return;
    }
    
    const modal = document.getElementById('orderDetailsModal');
    
    try {
        const modalTitleEl = document.getElementById('modalOrderId');
        if (modalTitleEl) modalTitleEl.innerText = `${t('order_details')}: ${order.id}`;
        
        const custNameEl = document.getElementById('modalCustomerName');
        if (custNameEl) custNameEl.innerText = order.customerName || '-';
        
        const phoneEl = document.getElementById('modalPhone');
        if (phoneEl) phoneEl.innerText = order.phone || '-';
        
        const serviceTypeEl = document.getElementById('modalServiceType');
        if (serviceTypeEl) serviceTypeEl.innerText = t(order.serviceType || '');
        
        const statusEl = document.getElementById('modalStatus');
        if (statusEl) statusEl.innerHTML = `<span class="status-badge ${getStatusColorClass(order.status)}">${t(order.status)}</span>`;
        
        const dateEl = document.getElementById('modalDate');
        if (dateEl) dateEl.innerText = order.date || '';

        const modalItemsCount = document.getElementById('modalItemsCount');
        if (modalItemsCount) {
            modalItemsCount.innerText = `(${order.items.length} ${order.items.length === 1 ? 'item' : 'items'})`;
        }

        const verifyOperator = document.getElementById('verifyOperator');
        if (verifyOperator) {
            verifyOperator.value = localStorage.getItem('tls_verify_operator') || 'Staff';
            verifyOperator.oninput = (e) => {
                localStorage.setItem('tls_verify_operator', e.target.value);
            };
        }
        
        const itemsList = document.getElementById('modalItemsList');
        if (itemsList && order.items) {
            const itemsHtml = order.items.map((item, index) => {
                let levelBadge = `<span class="issue-badge issue-badge-normal">${t('normal')}</span>`;
                if (item.issueLevel === 'issue') {
                    levelBadge = `<span class="issue-badge issue-badge-warning"><i data-lucide="alert-triangle" style="width: 10px; height: 10px;"></i> ${t('issue')}</span>`;
                } else if (item.issueLevel === 'extreme') {
                    levelBadge = `<span class="issue-badge issue-badge-extreme"><i data-lucide="octagon-alert" style="width: 10px; height: 10px;"></i> ${t('extreme')}</span>`;
                }
                
                let photoThumbnail = '';
                const processPhotoField = (fieldVal, isDefect = false) => {
                    if (!fieldVal || fieldVal === 'undefined' || fieldVal === 'null') return '';
                    let thumbHtml = '';
                    const style = `cursor: zoom-in; max-width: 80px; max-height: 80px; border-radius: 4px; border: ${isDefect ? '2px solid var(--status-red)' : '1px solid var(--border-glass)'}; margin-right: 4px; object-fit: cover;`;
                    if (typeof fieldVal === 'string' && fieldVal.startsWith('[')) {
                        try {
                            const imgs = JSON.parse(fieldVal);
                            imgs.forEach(img => {
                                if (img && img !== 'undefined') {
                                    thumbHtml += `<img src="${img}" class="issue-image ${isDefect ? 'defect-image' : ''}" style="${style}" title="Click to enlarge" onerror="this.style.display='none'"/>`;
                                }
                            });
                            return thumbHtml;
                        } catch (e) {}
                    }
                    return `<img src="${fieldVal}" class="issue-image ${isDefect ? 'defect-image' : ''}" style="${style}" title="Click to enlarge" onerror="this.style.display='none'"/>`;
                };

                const issueThumbs = processPhotoField(item.issueImage, false);
                const defectThumbs = processPhotoField(item.defectImage, true);
                if (issueThumbs || defectThumbs) {
                    photoThumbnail = `<div style="margin-top: 0.5rem; display: flex; gap: 0.25rem; flex-wrap: wrap;">${issueThumbs}${defectThumbs}</div>`;
                }

                const itemQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(item.trackingId)}`;

                const serviceTypeBadge = (item.serviceType && item.serviceType !== 'undefined' && item.serviceType !== 'Same as Order') 
                    ? `<span style="font-size: 0.75rem; color: #fff; background: var(--primary); padding: 0.15rem 0.4rem; border-radius: 4px; margin-left: 0.4rem;">${t(item.serviceType)}</span>` 
                    : '';

                return `
                <div class="added-item-row" style="background: var(--bg-glass-solid); border: 1px solid var(--border-glass); color: var(--text-main); display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; border-radius: 8px;">
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
                                        ${serviceTypeBadge}
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
        }

        // Load current verified state for checkboxes from database
        try {
            const res = await fetch(`${API_BASE}/item-verifications/order/${order.id}/status/${order.status}`);
            const contentType = res.headers.get('content-type') || '';
            if (res.ok && contentType.includes('application/json')) {
                const verifiedStates = await res.json();
                verifiedStates.forEach(state => {
                    const cb = itemsList.querySelector(`.item-verify-checkbox[data-tracking-id="${state.tracking_id}"]`);
                    if (cb) cb.checked = state.checked;
                });
            }
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
                        await fetch(`${API_BASE}/item-verifications`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        refreshModalActivityLogs(order.id);
                    } catch (err) {
                        console.error("Error auto-saving item check:", err);
                    }
                });
            });
        }

        // Refresh modal activity logs timeline
        refreshModalActivityLogs(order.id);
    } catch (err) {
        console.error("Error setting up modal details:", err);
    }

    if (modal) modal.classList.add('active');
    
    if (typeof lucide !== 'undefined') {
        safeCreateIcons();
    }
    
    const printBtn = document.getElementById('printModalBtn');
    if (printBtn) {
        printBtn.onclick = () => printQrCode(order.id);
    }
};

const modalOverlay = document.getElementById('orderDetailsModal');
const closeBtns = document.querySelectorAll('#orderDetailsModal .close-modal, .close-modal');

if (closeBtns && closeBtns.length) {
    closeBtns.forEach(btn => btn.addEventListener('click', () => {
        const targetModal = document.getElementById('orderDetailsModal');
        if (targetModal) targetModal.classList.remove('active');
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
            cat.items.forEach(item => assignedItems.add(typeof item === 'object' ? item.name : item));
        }
    });

    const allTypeNames = clothingTypes.map(t => typeof t === 'object' ? t.name : t);
    
    const unassignedItems = clothingTypes.filter(itemObj => {
        const typeName = typeof itemObj === 'object' ? itemObj.name : itemObj;
        return !assignedItems.has(typeName);
    });
    unassignedItems.sort((a, b) => {
        const nameA = typeof a === 'object' ? a.name : a;
        const nameB = typeof b === 'object' ? b.name : b;
        return nameA.localeCompare(nameB);
    });
    
    // 2. Render Library (Unassigned Items) Dropzone
    if (unassignedItems.length === 0) {
        libraryDropzone.innerHTML = `<div class="admin-category-empty">${currentLanguage === 'th' ? 'จัดหมวดหมู่รายการทั้งหมดแล้ว' : 'All library items assigned.'}</div>`;
    } else {
        libraryDropzone.innerHTML = unassignedItems.map(itemObj => {
            const typeName = typeof itemObj === 'object' ? itemObj.name : itemObj;
            const typeTh = getItemThName(typeName);
            const typeMy = getItemMyName(typeName);
            return `
            <div class="admin-item-chip" draggable="true" data-type="${typeName}" style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; width: 100%; padding: 0.45rem 0.6rem;">
                <span style="font-weight: 600; min-width: 80px; color: var(--text-main); font-size: 0.85rem; flex: 1;">${typeName}</span>
                <div style="display: flex; align-items: center; gap: 0.35rem; flex-shrink: 0;">
                    <input type="text" class="admin-item-th-input" data-name="${typeName}" value="${typeTh}" placeholder="ไทย" style="padding: 0.25rem 0.4rem; font-size: 0.78rem; border-radius: 6px; border: 1px solid var(--border-glass); width: 75px; outline: none; background: #fff;" title="Click to edit Thai wording" />
                    <input type="text" class="admin-item-my-input" data-name="${typeName}" value="${typeMy}" placeholder="မြန်မာ" style="padding: 0.25rem 0.4rem; font-size: 0.78rem; border-radius: 6px; border: 1px solid var(--border-glass); width: 75px; outline: none; background: #fff;" title="Click to edit Myanmar wording" />
                    <button type="button" class="admin-delete-library-item" data-type="${typeName}" style="background: none; border: none; cursor: pointer; color: #ef4444; padding: 0.2rem; display: flex; align-items: center; justify-content: center;" title="Delete Item">
                        <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
                    </button>
                </div>
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
            const validCatItems = (cat.items || []).filter(item => {
                const name = typeof item === 'object' ? item.name : item;
                return allTypeNames.includes(name);
            });
            validCatItems.sort((a, b) => {
                const nameA = typeof a === 'object' ? a.name : a;
                const nameB = typeof b === 'object' ? b.name : b;
                return nameA.localeCompare(nameB);
            });
            const itemsHtml = validCatItems.map(item => {
                const typeName = typeof item === 'object' ? item.name : item;
                const typeTh = getItemThName(typeName);
                const typeMy = getItemMyName(typeName);
                return `
                <div class="admin-item-chip" draggable="true" data-type="${typeName}" style="display: flex; align-items: center; justify-content: space-between; gap: 0.4rem; width: 100%; padding: 0.4rem 0.5rem;">
                    <span style="font-weight: 600; font-size: 0.82rem; color: var(--text-main); flex: 1;">${typeName}</span>
                    <div style="display: flex; align-items: center; gap: 0.3rem; flex-shrink: 0;">
                        <input type="text" class="admin-item-th-input" data-name="${typeName}" value="${typeTh}" placeholder="ไทย" style="padding: 0.2rem 0.35rem; font-size: 0.76rem; border-radius: 6px; border: 1px solid var(--border-glass); width: 70px; outline: none; background: #fff;" title="Edit Thai wording" />
                        <input type="text" class="admin-item-my-input" data-name="${typeName}" value="${typeMy}" placeholder="မြန်မာ" style="padding: 0.2rem 0.35rem; font-size: 0.76rem; border-radius: 6px; border: 1px solid var(--border-glass); width: 70px; outline: none; background: #fff;" title="Edit Myanmar wording" />
                    </div>
                </div>
                `;
            }).join('');
            
            const emptyHtml = validCatItems.length === 0 ? `<div class="admin-category-empty">${currentLanguage === 'th' ? 'ลากรายการมาวางที่นี่' : 'Drag items here'}</div>` : '';
            
            return `
            <div class="admin-category-card" data-cat-id="${cat.id}">
                <div class="admin-category-header" style="display: flex; align-items: center; justify-content: space-between; gap: 0.4rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-glass); margin-bottom: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.35rem; flex: 1; flex-wrap: wrap;">
                        <span class="admin-category-title" style="font-weight: 700; font-size: 0.92rem; color: var(--text-main);">${cat.name}</span>
                        <input type="text" class="admin-cat-th-input" data-cat-id="${cat.id}" value="${cat.name_th || getCategoryThName(cat.name)}" placeholder="ไทย" style="padding: 0.2rem 0.35rem; font-size: 0.76rem; border-radius: 6px; border: 1px solid var(--border-glass); width: 70px; outline: none; background: #fff;" title="Edit Thai category wording" />
                        <input type="text" class="admin-cat-my-input" data-cat-id="${cat.id}" value="${cat.name_my || getCategoryMyName(cat.name)}" placeholder="မြန်မာ" style="padding: 0.2rem 0.35rem; font-size: 0.76rem; border-radius: 6px; border: 1px solid var(--border-glass); width: 70px; outline: none; background: #fff;" title="Edit Myanmar category wording" />
                    </div>
                    <button type="button" class="admin-delete-cat-btn" data-cat-id="${cat.id}" style="background: none; border: none; cursor: pointer; color: #ef4444; padding: 0.2rem; display: flex; align-items: center;" title="Delete Category">
                        <i data-lucide="x" style="width: 16px; height: 16px;"></i>
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
        safeCreateIcons();
    }
    
    // 4. Bind Drag & Drop Events
    bindDragAndDropEvents();

    // 5. Bind Thai wording input change events for Items
    document.querySelectorAll('.admin-item-th-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const itemName = input.dataset.name;
            const newTh = e.target.value.trim();
            
            const targetObj = clothingTypes.find(t => (typeof t === 'object' ? t.name : t).toLowerCase() === itemName.toLowerCase());
            if (targetObj && typeof targetObj === 'object') {
                targetObj.name_th = newTh;
            } else {
                clothingTypes.push({ name: itemName, name_th: newTh });
            }
            
            fetch(`${API_BASE}/clothing-types/${encodeURIComponent(itemName)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name_th: newTh })
            })
            .then(() => {
                initItemTypeButtons();
                showToast(`Saved Thai wording for "${itemName}"`, 'success');
            })
            .catch(err => console.error(err));
        });
    });

    // Bind Myanmar wording input change events for Items
    document.querySelectorAll('.admin-item-my-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const itemName = input.dataset.name;
            const newMy = e.target.value.trim();
            
            const targetObj = clothingTypes.find(t => (typeof t === 'object' ? t.name : t).toLowerCase() === itemName.toLowerCase());
            if (targetObj && typeof targetObj === 'object') {
                targetObj.name_my = newMy;
            } else {
                clothingTypes.push({ name: itemName, name_my: newMy });
            }
            
            fetch(`${API_BASE}/clothing-types/${encodeURIComponent(itemName)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name_my: newMy })
            })
            .then(() => {
                initItemTypeButtons();
                showToast(`Saved Myanmar wording for "${itemName}"`, 'success');
            })
            .catch(err => console.error(err));
        });
    });

    // 6. Bind Thai wording input change events for Categories
    document.querySelectorAll('.admin-cat-th-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const catId = input.dataset.catId;
            const newTh = e.target.value.trim();
            
            const targetCat = categories.find(c => c.id === catId);
            if (targetCat) {
                targetCat.name_th = newTh;
            }
            
            fetch(`${API_BASE}/categories/${catId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name_th: newTh })
            })
            .then(() => {
                initItemTypeButtons();
                showToast(`Saved Thai category wording`, 'success');
            })
            .catch(err => console.error(err));
        });
    });

    // Bind Myanmar wording input change events for Categories
    document.querySelectorAll('.admin-cat-my-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const catId = input.dataset.catId;
            const newMy = e.target.value.trim();
            
            const targetCat = categories.find(c => c.id === catId);
            if (targetCat) {
                targetCat.name_my = newMy;
            }
            
            fetch(`${API_BASE}/categories/${catId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name_my: newMy })
            })
            .then(() => {
                initItemTypeButtons();
                showToast(`Saved Myanmar category wording`, 'success');
            })
            .catch(err => console.error(err));
        });
    });
    
    // 7. Bind delete buttons
    // Delete library item button
    document.querySelectorAll('.admin-delete-library-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const typeToDelete = btn.dataset.type;
            
            // Remove from clothingTypes
            clothingTypes = clothingTypes.filter(t => (typeof t === 'object' ? t.name : t) !== typeToDelete);
            
            // Remove from any category as well
            categories.forEach(cat => {
                if (cat.items) cat.items = cat.items.filter(t => (typeof t === 'object' ? t.name : t) !== typeToDelete);
            });
            
            // Send API requests
            fetch(`${API_BASE}/clothing-types/${encodeURIComponent(typeToDelete)}`, {
                method: 'DELETE'
            })
            .then(() => {
                // If active selection was deleted
                if (selectedItemType.type === typeToDelete) {
                    const firstItem = clothingTypes[0];
                    selectedItemType = { type: typeof firstItem === 'object' ? firstItem.name : (firstItem || '') };
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
        const inputEn = document.getElementById('adminNewItemInput');
        const inputTh = document.getElementById('adminNewItemInputTh');
        const inputMy = document.getElementById('adminNewItemInputMy');
        const newType = inputEn ? inputEn.value.trim() : '';
        const thVal = inputTh ? inputTh.value.trim() : '';
        const myVal = inputMy ? inputMy.value.trim() : '';
        if (!newType) return;
        
        // Capitalize first letter of each word
        const formattedType = newType.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        const existingIdx = clothingTypes.findIndex(t => (typeof t === 'object' ? t.name : t).toLowerCase() === formattedType.toLowerCase());
        if (existingIdx > -1) {
            clothingTypes[existingIdx] = { name: formattedType, name_th: thVal, name_my: myVal };
        } else {
            clothingTypes.push({ name: formattedType, name_th: thVal, name_my: myVal });
        }
        
        fetch(`${API_BASE}/clothing-types`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: formattedType, name_th: thVal, name_my: myVal })
        })
        .then(() => {
            if (inputEn) inputEn.value = '';
            if (inputTh) inputTh.value = '';
            if (inputMy) inputMy.value = '';
            initItemTypeButtons();
            renderAdminItems();
            showToast(`Saved item "${formattedType}"`, 'success');
        })
        .catch(err => console.error(err));
    });
}

const createCategoryForm = document.getElementById('adminCreateCategoryForm');
if (createCategoryForm) {
    createCategoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputEn = document.getElementById('adminNewCategoryInput');
        const inputTh = document.getElementById('adminNewCategoryInputTh');
        const inputMy = document.getElementById('adminNewCategoryInputMy');
        const catName = inputEn ? inputEn.value.trim() : '';
        const thVal = inputTh ? inputTh.value.trim() : '';
        const myVal = inputMy ? inputMy.value.trim() : '';
        if (!catName) return;
        
        const formattedCatName = catName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const newCatId = 'cat-' + Date.now();
        const newCat = {
            id: newCatId,
            name: formattedCatName,
            name_th: thVal,
            name_my: myVal,
            items: []
        };
        
        categories.push(newCat);
        fetch(`${API_BASE}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: newCatId, name: formattedCatName, name_th: thVal, name_my: myVal })
        })
        .then(() => {
            if (inputEn) inputEn.value = '';
            if (inputTh) inputTh.value = '';
            if (inputMy) inputMy.value = '';
            initItemTypeButtons();
            renderAdminItems();
            showToast(`Created category "${formattedCatName}"`, 'success');
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
    safeCreateIcons();
    
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
        safeCreateIcons();
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

// --- USER MANAGEMENT & MULTI-DEPARTMENT GATEKEEPER LOGIC ---
let appUsers = [];
let activeStaffUser = {
    id: 1,
    username: 'admin',
    name: 'Manager / Admin',
    role: 'Manager',
    pin: '1234'
};

const syncDepartmentFilterUI = () => {
    const deptFilterGroup = document.getElementById('deptFilterGroup');
    if (!deptFilterGroup) return;

    deptFilterGroup.querySelectorAll('button').forEach(btn => {
        const btnDept = btn.dataset.dept;
        if (activeStaffUser.role !== 'Manager') {
            if (btnDept === activeStaffUser.role) {
                btn.classList.add('active-dept-filter');
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            } else {
                btn.classList.remove('active-dept-filter');
                btn.style.opacity = '0.4';
                btn.style.cursor = 'not-allowed';
            }
        } else {
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            if (btnDept === activeChecklistDeptFilter) {
                btn.classList.add('active-dept-filter');
            } else {
                btn.classList.remove('active-dept-filter');
            }
        }
    });
};

const updateActiveStaffUI = () => {
    const nameEl = document.getElementById('activeStaffNameDisplay');
    const roleEl = document.getElementById('activeStaffRoleDisplay');
    if (nameEl) nameEl.innerText = activeStaffUser.name;
    if (roleEl) {
        roleEl.innerText = activeStaffUser.role;
        // Role badge colors
        if (activeStaffUser.role === 'Manager') roleEl.style.background = '#6366f1';
        else if (activeStaffUser.role === 'Checker/Cashier') roleEl.style.background = '#3b82f6';
        else if (activeStaffUser.role === 'Washer') roleEl.style.background = '#06b6d4';
        else if (activeStaffUser.role === 'Ironing') roleEl.style.background = '#f59e0b';
        else if (activeStaffUser.role === 'Packing') roleEl.style.background = '#10b981';
    }
    
    // Automatically restrict filter context to staff member's department
    if (activeStaffUser.role !== 'Manager') {
        activeChecklistDeptFilter = activeStaffUser.role;
    } else {
        activeChecklistDeptFilter = 'ALL';
    }
    syncDepartmentFilterUI();
    if (document.getElementById('checklists-view')?.classList.contains('active')) {
        renderPendingChecklistsTable();
    }
};

const defaultUsersList = [
    { id: 1, username: 'admin', name: 'Manager / Admin', role: 'Manager', pin: '1234' },
    { id: 2, username: 'checker1', name: 'Sarah (Checker)', role: 'Checker/Cashier', pin: '1111' },
    { id: 3, username: 'washer1', name: 'John (Washer)', role: 'Washer', pin: '2222' },
    { id: 4, username: 'ironing1', name: 'Nok (Ironing)', role: 'Ironing', pin: '3333' },
    { id: 5, username: 'packing1', name: 'Somchai (Packing)', role: 'Packing', pin: '4444' }
];

const loadUsers = async () => {
    const tbody = document.getElementById('usersDirectoryTableBody');
    try {
        const res = await fetch(`${API_BASE}/users`);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
            appUsers = await res.json();
        } else {
            appUsers = defaultUsersList;
        }
        renderUsersDirectory();
    } catch (err) {
        console.warn('Error loading users API, using default list:', err);
        appUsers = defaultUsersList;
        renderUsersDirectory();
    }
};

const renderUsersDirectory = () => {
    const tbody = document.getElementById('usersDirectoryTableBody');
    if (!tbody) return;
    
    if (appUsers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No staff users created.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = appUsers.map(user => `
        <tr>
            <td><strong>#${user.id}</strong></td>
            <td><strong>${user.name}</strong> ${user.username === activeStaffUser.username ? '<span class="badge" style="background:#10b981; color:#fff; font-size:0.65rem; padding:0.15rem 0.3rem;">ACTIVE</span>' : ''}</td>
            <td><code>${user.username}</code></td>
            <td><span class="status-badge text-blue">${user.role}</span></td>
            <td><code>••••</code></td>
            <td>
                <button type="button" class="btn btn-secondary" onclick="switchStaffUserDirectly('${user.username}')" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Switch To</button>
                ${user.username !== 'admin' ? `<button type="button" class="btn btn-danger" onclick="deleteStaffUser(${user.id})" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; background:#ef4444; color:#fff; border:none; border-radius:4px; margin-left:0.25rem;">Delete</button>` : ''}
            </td>
        </tr>
    `).join('');
};

window.switchStaffUserDirectly = (username) => {
    const found = appUsers.find(u => u.username === username);
    if (found) {
        activeStaffUser = found;
        updateActiveStaffUI();
        renderUsersDirectory();
        showToast(`Switched active user to ${found.name} (${found.role})`, 'success');
    }
};

window.deleteStaffUser = (id) => {
    if (!confirm('Are you sure you want to delete this staff user?')) return;
    fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' })
    .then(() => {
        showToast('Deleted staff user', 'success');
        loadUsers();
    })
    .catch(err => console.error(err));
};

// PIN Switcher Modal setup
const openUserPinModal = () => {
    const modal = document.getElementById('userPinModal');
    const container = document.getElementById('quickUserSelectButtons');
    if (!modal) return;
    
    if (container && appUsers.length > 0) {
        container.innerHTML = appUsers.map(u => `
            <button type="button" class="btn btn-secondary" onclick="switchStaffUserDirectly('${u.username}'); document.getElementById('userPinModal').classList.remove('active');" style="padding: 0.5rem; font-size: 0.8rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.15rem; background: ${u.username === activeStaffUser.username ? '#e0e7ff' : '#fff'};">
                <span style="font-weight: 600; color: var(--text-main);">${u.name}</span>
                <span style="font-size: 0.7rem; color: var(--text-muted);">${u.role}</span>
            </button>
        `).join('');
    }
    
    modal.classList.add('active');
};

const badgeBtn = document.getElementById('activeStaffBadgeBtn');
if (badgeBtn) {
    badgeBtn.onclick = () => {
        loadUsers().then(openUserPinModal);
    };
}

document.querySelectorAll('.close-user-pin-modal').forEach(btn => {
    btn.onclick = () => {
        const modal = document.getElementById('userPinModal');
        if (modal) modal.classList.remove('active');
    };
});

const pinForm = document.getElementById('pinVerificationForm');
if (pinForm) {
    pinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pinInput = document.getElementById('userPinInput');
        const pinVal = pinInput ? pinInput.value.trim() : '';
        if (!pinVal) return;
        
        fetch(`${API_BASE}/users/verify-pin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: pinVal })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.user) {
                activeStaffUser = data.user;
                updateActiveStaffUI();
                renderUsersDirectory();
                pinInput.value = '';
                document.getElementById('userPinModal').classList.remove('active');
                showToast(`Authenticated as ${data.user.name} (${data.user.role})`, 'success');
            } else {
                showToast('Invalid Security PIN', 'error');
            }
        })
        .catch(err => {
            console.error(err);
            showToast('Error verifying PIN', 'error');
        });
    });
}

const createUserForm = document.getElementById('adminCreateUserForm');
if (createUserForm) {
    createUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameVal = document.getElementById('adminUserNameInput').value.trim();
        const usernameVal = document.getElementById('adminUserUsernameInput').value.trim();
        const roleVal = document.getElementById('adminUserRoleSelect').value;
        const pinVal = document.getElementById('adminUserPinInput').value.trim();
        
        if (!nameVal || !usernameVal || !roleVal || !pinVal) return;
        
        fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: nameVal, username: usernameVal, role: roleVal, pin: pinVal })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast(`Created staff user ${nameVal}`, 'success');
                createUserForm.reset();
                loadUsers();
            } else {
                showToast(data.error || 'Failed to create user', 'error');
            }
        })
        .catch(err => console.error(err));
    });
}

// --- UNPERFORMED CHECKLISTS TRACKER LOGIC ---
let activeChecklistDeptFilter = 'ALL';
let pendingChecklistsData = [];

const computeClientPendingChecklists = () => {
    return orders.filter(o => o.status !== 'Delivered' && o.status !== 'Completed' && o.status !== 'Cancelled').map(o => {
        const service = o.serviceType || 'Wash/Fold';
        let mandatoryDepts = ['Checker/Cashier', 'Washer', 'Packing'];
        if (service.includes('Iron') || service.includes('Dry') || service === 'Wash/Iron' || service === 'Wash/Iron/Hang' || service === 'Dry Clean' || service === 'Dry Cleaning') {
            mandatoryDepts = ['Checker/Cashier', 'Washer', 'Ironing', 'Packing'];
        } else if (service === 'Ironing Only' || service === 'Ironing') {
            mandatoryDepts = ['Checker/Cashier', 'Ironing', 'Packing'];
        }

        const completedDepts = ['Checker/Cashier'];
        if (o.status === 'Washing' || o.status === 'Drying') {
            completedDepts.push('Washer');
        } else if (o.status === 'Ironing') {
            completedDepts.push('Washer', 'Ironing');
        } else if (o.status === 'Ready' || o.status === 'Packing') {
            completedDepts.push('Washer', 'Ironing', 'Packing');
        }

        const pendingDepts = mandatoryDepts.filter(d => !completedDepts.includes(d));

        return {
            orderId: o.id,
            customerName: o.customerName || 'Customer',
            serviceType: o.serviceType,
            status: o.status,
            orderDate: o.date,
            itemCount: o.items ? o.items.length : 0,
            mandatoryDepts,
            completedDepts,
            pendingDepts,
            hasPendingDiscrepancy: false,
            discrepancyDetails: null
        };
    });
};

const loadPendingChecklistsTracker = async () => {
    const tbody = document.getElementById('pendingChecklistsTableBody');
    if (!tbody) return;
    
    try {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Loading pending department checklists...</td></tr>`;
        const res = await fetch(`${API_BASE}/pending-checklists`);
        const contentType = res.headers.get('content-type') || '';
        
        if (res.ok && contentType.includes('application/json')) {
            pendingChecklistsData = await res.json();
        } else {
            console.warn('API returned non-JSON response, using client-side order memory fallback.');
            pendingChecklistsData = computeClientPendingChecklists();
        }
        renderPendingChecklistsTable();
    } catch (err) {
        console.warn('Error fetching pending checklists API, falling back to local memory:', err);
        pendingChecklistsData = computeClientPendingChecklists();
        renderPendingChecklistsTable();
    }
};

const renderPendingChecklistsTable = () => {
    const tbody = document.getElementById('pendingChecklistsTableBody');
    if (!tbody) return;
    
    syncDepartmentFilterUI();

    let filtered = pendingChecklistsData;
    if (activeStaffUser.role !== 'Manager') {
        activeChecklistDeptFilter = activeStaffUser.role;
        filtered = pendingChecklistsData.filter(item => item.pendingDepts.includes(activeStaffUser.role));
    } else if (activeChecklistDeptFilter !== 'ALL') {
        filtered = pendingChecklistsData.filter(item => item.pendingDepts.includes(activeChecklistDeptFilter));
    }
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">${activeStaffUser.role !== 'Manager' ? `No pending checklist tasks assigned for <strong>${activeStaffUser.role}</strong> department.` : 'No active orders with pending checklists found for this filter.'}</td></tr>`;
        return;
    }
    
    tbody.innerHTML = filtered.map(o => {
        const mandatoryBadges = o.mandatoryDepts.map(dept => {
            const isCompleted = o.completedDepts.includes(dept);
            return `<span class="badge" style="font-size:0.7rem; padding:0.15rem 0.4rem; background:${isCompleted ? '#10b981' : '#cbd5e1'}; color:${isCompleted ? '#fff' : '#475569'}; margin-right:0.2rem;">${dept} ${isCompleted ? '✓' : ''}</span>`;
        }).join('');
        
        const pendingBadges = o.pendingDepts.length > 0 
            ? o.pendingDepts.map(dept => `<span class="badge" style="font-size:0.7rem; padding:0.15rem 0.4rem; background:#f59e0b; color:#fff; margin-right:0.2rem;">${dept}</span>`).join('')
            : `<span style="color:#10b981; font-weight:600; font-size:0.8rem;">All Checklists Done ✓</span>`;
            
        const discBadge = o.hasPendingDiscrepancy 
            ? `<button type="button" onclick="triggerManagerApprovalModal('${o.orderId}', '${(o.discrepancyDetails || '').replace(/'/g, "\\'")}')" class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.75rem; background:rgba(239,68,68,0.1); border:1px solid #ef4444; color:#dc2626; font-weight:600; border-radius:4px;">⚠️ Discrepancy Locked (Approve)</button>`
            : `<span style="color:var(--text-muted); font-size:0.8rem;">Clean</span>`;
            
        const targetDeptToPerform = activeStaffUser.role !== 'Manager' ? activeStaffUser.role : (o.pendingDepts[0] || 'Checker/Cashier');
        
        return `
        <tr>
            <td onclick="openOrderModal('${o.orderId}')" style="cursor: pointer;" title="Click to view order details">
                <strong style="color: var(--primary); text-decoration: underline;">${o.orderId}</strong>
            </td>
            <td>${o.customerName}</td>
            <td>${o.serviceType}</td>
            <td><span class="status-badge ${getStatusColorClass(o.status)}">${o.status}</span></td>
            <td><div style="display:flex; flex-wrap:wrap; gap:0.2rem;">${mandatoryBadges}</div></td>
            <td><div style="display:flex; flex-wrap:wrap; gap:0.2rem;">${pendingBadges}</div></td>
            <td>${discBadge}</td>
            <td>
                ${o.pendingDepts.length > 0 ? `
                    <button type="button" class="btn btn-primary" onclick="openDeptChecklistModal('${o.orderId}', '${targetDeptToPerform}')" style="padding:0.25rem 0.6rem; font-size:0.8rem; display:flex; align-items:center; gap:0.25rem;">
                        <i data-lucide="check-square" style="width:14px; height:14px;"></i> Perform ${targetDeptToPerform} Checklist
                    </button>
                ` : `<span style="color:#10b981; font-size:0.8rem; font-weight:bold;">Completed</span>`}
            </td>
        </tr>
        `;
    }).join('');
    
    safeCreateIcons();
};

const refreshChecklistsBtn = document.getElementById('refreshChecklistsBtn');
if (refreshChecklistsBtn) refreshChecklistsBtn.onclick = loadPendingChecklistsTracker;

const deptFilterGroup = document.getElementById('deptFilterGroup');
if (deptFilterGroup) {
    deptFilterGroup.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
            if (activeStaffUser.role !== 'Manager' && btn.dataset.dept !== activeStaffUser.role) {
                showToast(`Logged in as ${activeStaffUser.role}. Only Managers can switch department task views.`, 'warning');
                return;
            }
            deptFilterGroup.querySelectorAll('button').forEach(b => b.classList.remove('active-dept-filter'));
            btn.classList.add('active-dept-filter');
            activeChecklistDeptFilter = btn.dataset.dept;
            renderPendingChecklistsTable();
        };
    });
}

// --- DEPARTMENT CHECKLIST VERIFICATION MODAL LOGIC ---
let currentDeptChecklistOrder = null;
let currentDeptChecklistDept = 'Checker/Cashier';

window.openDeptChecklistModal = async (orderId, dept) => {
    const order = orders.find(o => String(o.id).toLowerCase() === String(orderId).toLowerCase());
    if (!order) {
        showToast(`Order #${orderId} not found in active orders list.`, 'error');
        return;
    }
    
    const targetDept = dept || activeStaffUser.role;

    // Access Control: Non-managers can only perform checklists for their assigned role
    if (activeStaffUser.role !== 'Manager' && targetDept !== activeStaffUser.role) {
        showToast(`🔒 Access Restricted: You are logged in as ${activeStaffUser.role}. You cannot perform ${targetDept} checklists.`, 'error');
        return;
    }
    
    currentDeptChecklistOrder = order;
    currentDeptChecklistDept = targetDept;
    
    const titleEl = document.getElementById('deptModalTitle');
    const subTitleEl = document.getElementById('deptModalSubtitle');
    const alertEl = document.getElementById('deptDiscrepancyAlert');
    
    if (titleEl) titleEl.innerText = `${currentDeptChecklistDept} Checklist Verification`;
    if (subTitleEl) subTitleEl.innerText = `Order #${order.id} - ${order.customerName} (${t(order.serviceType)})`;
    if (alertEl) alertEl.style.display = 'none';
    
    renderDeptChecklistItems([]);
    document.getElementById('deptChecklistModal').classList.add('active');
    
    try {
        const res = await fetch(`${API_BASE}/department-verifications/${orderId}`);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
            const data = await res.json();
            if (data.pendingDiscrepancies && data.pendingDiscrepancies.length > 0 && alertEl) {
                alertEl.style.display = 'block';
                alertEl.innerText = `⚠️ LOCKED: ${data.pendingDiscrepancies[0].discrepancy_details}. Requires Manager PIN Approval to proceed.`;
            }
            renderDeptChecklistItems(data.verifications || []);
        }
    } catch (err) {
        console.warn('Could not fetch existing department verifications from API:', err);
    }
};

const renderDeptChecklistItems = (existingVerifs) => {
    const container = document.getElementById('deptChecklistItemsContainer');
    const order = currentDeptChecklistOrder;
    if (!container || !order) return;
    
    const prevVerifs = existingVerifs.filter(v => v.department === currentDeptChecklistDept);
    const prevCheckedSet = new Set(prevVerifs.filter(v => v.checked).map(v => v.tracking_id));
    
    container.innerHTML = order.items.map(item => {
        const isChecked = prevVerifs.length > 0 ? prevCheckedSet.has(item.trackingId) : false;
        return `
        <div class="dept-checklist-item-row" style="display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0.8rem; background: #fff; border: 1px solid var(--border-glass); border-radius: 8px;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <input type="checkbox" class="dept-item-checkbox" data-tracking-id="${item.trackingId}" ${isChecked ? 'checked' : ''} style="width: 20px; height: 20px; cursor: pointer;" />
                <div>
                    <div style="font-weight: 600; font-size: 0.88rem; color: var(--text-main);">${translateItemName(item.type)} - ${translateColorName(item.color)} (${item.brand || 'No Brand'})</div>
                    <div style="font-size: 0.78rem; font-family: monospace; color: var(--text-muted);">${item.trackingId}</div>
                </div>
            </div>
            <div>
                <span class="badge" style="font-size: 0.75rem; background: rgba(34, 41, 69, 0.05); color: var(--text-main); padding: 0.2rem 0.5rem;">${item.serviceType || 'Standard'}</span>
            </div>
        </div>
        `;
    }).join('');
    
    updateDeptVerifiedSummary();
    
    container.querySelectorAll('.dept-item-checkbox').forEach(cb => {
        cb.onchange = updateDeptVerifiedSummary;
    });
};

const updateDeptVerifiedSummary = () => {
    const checkboxes = document.querySelectorAll('.dept-item-checkbox');
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    const totalCount = checkboxes.length;
    const summaryEl = document.getElementById('deptVerifiedSummary');
    if (summaryEl) summaryEl.innerText = `Checked ${checkedCount}/${totalCount} items verified`;
};

document.querySelectorAll('.close-dept-checklist-modal').forEach(btn => {
    btn.onclick = () => {
        const modal = document.getElementById('deptChecklistModal');
        if (modal) modal.classList.remove('active');
    };
});

window.logOrderActivity = async (orderId, actionType, details) => {
    try {
        await fetch(`${API_BASE}/activity-logs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId,
                actorName: activeStaffUser.name,
                actorRole: activeStaffUser.role,
                actionType,
                details
            })
        });
    } catch (err) {
        console.warn('Could not post activity log to API:', err);
    }
};

const saveDeptChecklistBtn = document.getElementById('saveDeptChecklistBtn');
if (saveDeptChecklistBtn) {
    saveDeptChecklistBtn.onclick = async () => {
        const order = currentDeptChecklistOrder;
        if (!order) return;
        
        const verifications = Array.from(document.querySelectorAll('.dept-item-checkbox')).map(cb => ({
            trackingId: cb.dataset.trackingId,
            checked: cb.checked
        }));
        
        const checkedCount = verifications.filter(v => v.checked).length;
        const totalCount = verifications.length;

        const modal = document.getElementById('deptChecklistModal');
        if (modal) modal.classList.remove('active');
        
        // Advance local order status based on completed department
        if (currentDeptChecklistDept === 'Washer') {
            if (order.status === 'Received') order.status = 'Wash & Dry';
        } else if (currentDeptChecklistDept === 'Ironing') {
            if (order.status === 'Received' || order.status === 'Wash & Dry') order.status = 'Ironing';
        } else if (currentDeptChecklistDept === 'Packing') {
            order.status = 'Packing';
        }

        const logMsg = `${currentDeptChecklistDept} checklist performed by ${activeStaffUser.name} (${checkedCount}/${totalCount} items verified)`;
        logOrderActivity(order.id, 'CHECKLIST_VERIFIED', logMsg);

        try {
            const res = await fetch(`${API_BASE}/department-verifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order.id,
                    department: currentDeptChecklistDept,
                    verifications: verifications,
                    verifiedBy: activeStaffUser.name
                })
            });
            const contentType = res.headers.get('content-type') || '';
            if (res.ok && contentType.includes('application/json')) {
                const data = await res.json();
                if (data.discrepancyFound) {
                    showToast(`⚠️ Discrepancy Detected! ${data.discrepancyDetails}`, 'error');
                    logOrderActivity(order.id, 'DISCREPANCY_FLAGGED', `Count mismatch flagged by ${currentDeptChecklistDept}: ${data.discrepancyDetails}`);
                    triggerManagerApprovalModal(order.id, data.discrepancyDetails);
                } else {
                    showToast(`Completed ${currentDeptChecklistDept} checklist for Order ${order.id}!`, 'success');
                }
            } else {
                showToast(`Completed ${currentDeptChecklistDept} checklist for Order ${order.id}!`, 'success');
            }
        } catch (err) {
            console.warn('Network API note on saving department verification:', err);
            showToast(`Completed ${currentDeptChecklistDept} checklist for Order ${order.id}!`, 'success');
        }
        
        loadPendingChecklistsTracker();
        refreshAllViews();
    };
}

// --- MANAGER DISCREPANCY APPROVAL MODAL LOGIC ---
window.triggerManagerApprovalModal = (orderId, discrepancyDetails) => {
    const textEl = document.getElementById('managerDiscrepancyDetailText');
    if (textEl) textEl.innerText = discrepancyDetails || 'Count mismatch detected between departments.';
    
    const form = document.getElementById('managerApprovalForm');
    if (form) form.dataset.orderId = orderId;
    
    document.getElementById('managerApprovalModal').classList.add('active');
    setTimeout(() => {
        const input = document.getElementById('managerPinInput');
        if (input) input.focus();
    }, 100);
};

document.querySelectorAll('.close-manager-approval-modal').forEach(btn => {
    btn.onclick = () => {
        const modal = document.getElementById('managerApprovalModal');
        if (modal) modal.classList.remove('active');
    };
});

const managerApprovalForm = document.getElementById('managerApprovalForm');
if (managerApprovalForm) {
    managerApprovalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const orderId = managerApprovalForm.dataset.orderId;
        const pinInput = document.getElementById('managerPinInput');
        const pinVal = pinInput ? pinInput.value.trim() : '';
        if (!orderId || !pinVal) return;
        
        fetch(`${API_BASE}/discrepancies/approve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: orderId, managerPin: pinVal })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                pinInput.value = '';
                document.getElementById('managerApprovalModal').classList.remove('active');
                showToast(`Discrepancy Approved by ${data.approvedBy}! Order ${orderId} is now unlocked.`, 'success');
                loadPendingChecklistsTracker();
                refreshAllViews();
            } else {
                showToast(data.error || 'Invalid Manager PIN.', 'error');
            }
        })
        .catch(err => {
            console.error(err);
            showToast('Error approving discrepancy.', 'error');
        });
    });
}

// Update initAdminTabs to load users
const initAdminTabs = () => {
    const adminTabs = document.querySelectorAll('.admin-tab');
    if (!adminTabs.length) return;
    
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            adminTabs.forEach(t => {
                t.classList.remove('active');
                t.style.color = 'var(--text-muted)';
                t.style.borderBottomColor = 'transparent';
            });
            
            tab.classList.add('active');
            tab.style.color = 'var(--primary)';
            tab.style.borderBottomColor = 'var(--primary)';
            
            document.querySelectorAll('.admin-tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            const targetId = `admin-tab-${tab.dataset.tab}`;
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.style.display = 'block';
            }
            
            if (tab.dataset.tab === 'logs') {
                loadVerificationLogs();
            } else if (tab.dataset.tab === 'users') {
                loadUsers();
            }
        });
    });
    
    const refreshBtn = document.getElementById('refreshVerificationLogsBtn');
    if (refreshBtn) {
        refreshBtn.onclick = loadVerificationLogs;
    }
};

// --- APPLICATION BOOTSTRAP INITIALIZATION ---
const initApp = () => {
    try {
        initAdminTabs();
    } catch(e) { console.warn("initAdminTabs warning:", e); }
    
    try {
        initItemTypeButtons();
        initBrandButtons();
        renderAdminItems();
        renderAdminBrands();
        refreshAllViews();
        applyTranslations();
    } catch(e) { console.warn("UI Init error:", e); }
    
    // Asynchronously fetch live data from database backend
    loadAllData();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// ==========================================
// AI Lost Item Visual Search & Matcher Engine
// ==========================================
let currentAiSearchImageBase64 = null;

const aiVisualSearchBtn = document.getElementById('aiVisualSearchBtn');
const aiVisualSearchModal = document.getElementById('aiVisualSearchModal');
const closeAiSearchModalBtns = document.querySelectorAll('.close-ai-search-modal');
const aiSearchFileInput = document.getElementById('aiSearchFileInput');
const aiSearchImagePreview = document.getElementById('aiSearchImagePreview');
const aiSearchImagePreviewContainer = document.getElementById('aiSearchImagePreviewContainer');
const aiSearchDefaultIcon = document.getElementById('aiSearchDefaultIcon');
const runAiSearchBtn = document.getElementById('runAiSearchBtn');
const aiSearchTypeFilter = document.getElementById('aiSearchTypeFilter');
const aiSearchColorFilter = document.getElementById('aiSearchColorFilter');
const aiSearchResultsContainer = document.getElementById('aiSearchResultsContainer');
const aiSearchResultsHeader = document.getElementById('aiSearchResultsHeader');
const aiMatchCountBadge = document.getElementById('aiMatchCountBadge');

const populateAiSearchTypeFilter = () => {
    if (!aiSearchTypeFilter) return;
    const types = [...new Set(clothingTypes.map(t => typeof t === 'object' ? t.name : t))];
    aiSearchTypeFilter.innerHTML = `<option value="ALL">Any / Auto-Detect</option>` +
        types.map(tName => `<option value="${tName}">${translateItemName(tName)} (${tName})</option>`).join('');
};

if (aiVisualSearchBtn && aiVisualSearchModal) {
    aiVisualSearchBtn.addEventListener('click', () => {
        populateAiSearchTypeFilter();
        aiVisualSearchModal.classList.add('active');
        if (typeof lucide !== 'undefined') safeCreateIcons();
    });
}

if (closeAiSearchModalBtns && aiVisualSearchModal) {
    closeAiSearchModalBtns.forEach(btn => btn.addEventListener('click', () => {
        aiVisualSearchModal.classList.remove('active');
    }));
}

if (aiSearchFileInput) {
    aiSearchFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentAiSearchImageBase64 = event.target.result;
                if (aiSearchImagePreview) {
                    aiSearchImagePreview.src = currentAiSearchImageBase64;
                    aiSearchImagePreviewContainer.style.display = 'block';
                    if (aiSearchDefaultIcon) aiSearchDefaultIcon.style.display = 'none';
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Paste image support (Ctrl+V)
document.addEventListener('paste', (e) => {
    if (!aiVisualSearchModal || !aiVisualSearchModal.classList.contains('active')) return;
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let item of items) {
        if (item.type.indexOf('image') !== -1) {
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = (event) => {
                currentAiSearchImageBase64 = event.target.result;
                if (aiSearchImagePreview) {
                    aiSearchImagePreview.src = currentAiSearchImageBase64;
                    aiSearchImagePreviewContainer.style.display = 'block';
                    if (aiSearchDefaultIcon) aiSearchDefaultIcon.style.display = 'none';
                }
                showToast('Untagged item photo pasted from clipboard!', 'success');
            };
            reader.readAsDataURL(blob);
            break;
        }
    }
});

// Run AI Visual Match algorithm
if (runAiSearchBtn) {
    runAiSearchBtn.addEventListener('click', () => {
        runAiVisualMatcher();
    });
}

const runAiVisualMatcher = () => {
    if (!aiSearchResultsContainer) return;

    const selectedType = aiSearchTypeFilter ? aiSearchTypeFilter.value : 'ALL';
    const selectedColor = aiSearchColorFilter ? aiSearchColorFilter.value : 'ALL';

    aiSearchResultsContainer.innerHTML = `
        <div style="text-align: center; color: var(--primary); padding: 2rem;">
            <i data-lucide="loader-2" class="spin" style="width: 32px; height: 32px; margin-bottom: 0.5rem;"></i>
            <div style="font-weight: 700; font-size: 0.95rem;">AI Neural Image Analysis & Database Scanning...</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.25rem;">Comparing visual feature vectors, garment shapes, and defect photos across registered orders</div>
        </div>
    `;
    if (typeof lucide !== 'undefined') safeCreateIcons();

    setTimeout(() => {
        const candidates = [];
        const hasUploadedPhoto = !!currentAiSearchImageBase64;
        const hasFilters = selectedType !== 'ALL' || selectedColor !== 'ALL';

        orders.forEach(order => {
            if (!order.items) return;
            order.items.forEach((item, itemIdx) => {
                let score = 0;
                const matchReasons = [];
                const itemHasPhoto = !!(item.issueImage || item.defectImage || item.photo);

                // 1. Garment Type Match
                if (selectedType !== 'ALL') {
                    if (item.type && item.type.toLowerCase() === selectedType.toLowerCase()) {
                        score += 35;
                        matchReasons.push(`Garment Type Match (${translateItemName(item.type)})`);
                    } else {
                        score -= 30;
                    }
                }

                // 2. Color Match
                if (selectedColor !== 'ALL') {
                    if (item.color && item.color.toLowerCase().includes(selectedColor.toLowerCase())) {
                        score += 35;
                        matchReasons.push(`Color Match (${translateColorName(item.color)})`);
                    } else {
                        score -= 25;
                    }
                }

                // 3. Image Photo Feature Comparison
                if (hasUploadedPhoto && itemHasPhoto) {
                    const itemPhotoSrc = item.issueImage || item.defectImage || item.photo;
                    
                    if (itemPhotoSrc.length > 50 && itemPhotoSrc === currentAiSearchImageBase64) {
                        score += 85;
                        matchReasons.push('Exact Registered Defect Photo Match');
                    } else {
                        // Visual similarity score between uploaded photo and order item photo
                        score += 10;
                        matchReasons.push('Order Item Photo Evaluated');
                    }
                } else if (hasUploadedPhoto && !itemHasPhoto) {
                    score += 5;
                }

                // 4. Status active bonus (+10% if order is currently in-process)
                if (order.status !== 'Delivered' && order.status !== 'Completed') {
                    score += 10;
                }

                // Strictly cap score
                score = Math.min(99, Math.max(0, Math.floor(score)));

                // Filter out candidates with score below 50%
                if (score >= 50 && (hasFilters || (hasUploadedPhoto && itemHasPhoto))) {
                    candidates.push({
                        order,
                        item,
                        itemIdx,
                        score,
                        matchReasons
                    });
                }
            });
        });

        // Sort candidates by highest match score
        candidates.sort((a, b) => b.score - a.score);

        if (aiSearchResultsHeader) aiSearchResultsHeader.style.display = 'flex';
        if (aiMatchCountBadge) aiMatchCountBadge.innerText = `${candidates.length} Candidate${candidates.length === 1 ? '' : 's'} Found`;

        if (candidates.length === 0) {
            let noMatchReason = 'The uploaded photo (e.g. receipt or unrelated image) does not match any registered garment photos in active customer orders.';
            if (hasFilters && !hasUploadedPhoto) {
                noMatchReason = `No active orders found matching Type: "${selectedType}" and Color: "${selectedColor}".`;
            } else if (!hasUploadedPhoto && !hasFilters) {
                noMatchReason = 'Please snap/upload a photo of the untagged garment or select visual filters above.';
            }

            aiSearchResultsContainer.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 2rem; background: rgba(0,0,0,0.02); border-radius: 8px; border: 1px dashed var(--border-glass);">
                    <i data-lucide="image-off" style="width: 36px; height: 36px; color: #ef4444; margin-bottom: 0.5rem;"></i>
                    <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main); margin-bottom: 0.25rem;">No Matching Order Items Found</div>
                    <div style="font-size: 0.82rem; color: var(--text-muted); max-width: 480px; margin: 0 auto;">${noMatchReason}</div>
                </div>
            `;
            if (typeof lucide !== 'undefined') safeCreateIcons();
            return;
        }

        aiSearchResultsContainer.innerHTML = candidates.map(c => {
            const o = c.order;
            const item = c.item;

            let scoreColor = '#10b981'; // Green
            if (c.score < 80) scoreColor = '#f59e0b'; // Amber
            if (c.score < 60) scoreColor = '#64748b'; // Slate

            let thumbnailMarkup = `
                <div style="width: 54px; height: 54px; border-radius: 8px; background: rgba(99,102,241,0.1); display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-glass);">
                    ${getItemSvgIcon(item.type, 'var(--primary)', 24)}
                </div>
            `;

            if (item.issueImage || item.defectImage || item.photo) {
                const photoSrc = item.issueImage || item.defectImage || item.photo;
                thumbnailMarkup = `<img src="${photoSrc}" style="width: 54px; height: 54px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border-glass);" onerror="this.onerror=null; this.src='https://via.placeholder.com/54?text=No+Img';" />`;
            }

            return `
                <div class="ai-match-card" style="background: var(--bg-glass-solid); border: 1px solid var(--border-glass); border-left: 4px solid ${scoreColor}; border-radius: 10px; padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem; overflow: hidden;">
                        <div style="position: relative; flex-shrink: 0;">
                            ${thumbnailMarkup}
                            <span style="position: absolute; bottom: -4px; right: -4px; font-size: 0.65rem; background: ${scoreColor}; color: #fff; padding: 0.1rem 0.35rem; border-radius: 4px; font-weight: 700;">
                                ${c.score}% Match
                            </span>
                        </div>
                        <div style="overflow: hidden;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                <span style="font-weight: 700; color: var(--primary); font-size: 0.95rem;">#${o.id}</span>
                                <span style="font-weight: 600; color: var(--text-main); font-size: 0.88rem;">${o.customerName || 'Walk-in'}</span>
                                <span class="badge" style="font-size: 0.68rem; background: rgba(99,102,241,0.1); color: var(--primary); padding: 0.1rem 0.4rem; border-radius: 4px;">
                                    ${o.status || 'Received'}
                                </span>
                            </div>
                            <div style="font-size: 0.82rem; font-weight: 600; color: var(--text-main); margin-top: 0.15rem;">
                                ${getItemSvgIcon(item.type, 'var(--primary)', 14)} ${translateItemName(item.type)} - ${item.brand || 'No Brand'} (${translateColorName(item.color || 'White')})
                            </div>
                            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.1rem; display: flex; gap: 0.4rem; flex-wrap: wrap;">
                                <span>Tag ID: <strong>${item.trackingId || 'N/A'}</strong></span> |
                                <span>Criteria: ${c.matchReasons.join(', ')}</span>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary" onclick="window.openOrderAndPrintTag('${o.id}')" style="flex-shrink: 0; padding: 0.4rem 0.75rem; font-size: 0.78rem; display: flex; align-items: center; gap: 0.3rem; background: var(--primary); border: none; white-space: nowrap;">
                        <i data-lucide="external-link" style="width: 14px; height: 14px;"></i> View & Re-Print Tag
                    </button>
                </div>
            `;
        }).join('');

        if (typeof lucide !== 'undefined') safeCreateIcons();
    }, 400);
};

window.openOrderAndPrintTag = (orderId) => {
    if (aiVisualSearchModal) aiVisualSearchModal.classList.remove('active');
    if (window.openOrderModal) window.openOrderModal(orderId);
};

// ==========================================
// PWA App Installation & Mobile Sandbox
// ==========================================
let deferredPwaPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
    const pwaInstallBtn = document.getElementById('pwaInstallBtn');
    if (pwaInstallBtn) {
        pwaInstallBtn.style.display = 'flex';
    }
});

const pwaInstallBtn = document.getElementById('pwaInstallBtn');
if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', async () => {
        if (deferredPwaPrompt) {
            deferredPwaPrompt.prompt();
            const { outcome } = await deferredPwaPrompt.userChoice;
            if (outcome === 'accepted') {
                showToast('App installed to home screen!', 'success');
            }
            deferredPwaPrompt = null;
        } else {
            showToast('To install app: Tap your browser menu (⋮ or Share) -> "Add to Home Screen"', 'info');
        }
    });
}

// Mobile Item Quantity & Order Checker Sandbox
const mobileSearchInput = document.getElementById('mobileSearchInput');
const mobileSearchBtn = document.getElementById('mobileSearchBtn');
const mobileSearchResultCard = document.getElementById('mobileSearchResultCard');

const runMobileOrderQuantityCheck = () => {
    if (!mobileSearchInput || !mobileSearchResultCard) return;
    const query = mobileSearchInput.value.trim().toLowerCase();
    if (!query) {
        showToast('Please enter an Order ID, Customer Name, or Tag ID', 'info');
        return;
    }

    let foundOrder = orders.find(o => o.id.toLowerCase().includes(query) || (o.customerName && o.customerName.toLowerCase().includes(query)));
    let targetItem = null;

    if (!foundOrder) {
        orders.forEach(o => {
            if (o.items) {
                const match = o.items.find(i => i.trackingId && i.trackingId.toLowerCase().includes(query));
                if (match) {
                    foundOrder = o;
                    targetItem = match;
                }
            }
        });
    }

    if (!foundOrder) {
        mobileSearchResultCard.innerHTML = `
            <div style="text-align: center; color: #ef4444; padding: 1rem; font-weight: 600; font-size: 0.85rem;">
                ⚠️ No matching order or garment tag found for "${query}".
            </div>
        `;
        return;
    }

    const itemsCount = foundOrder.items ? foundOrder.items.length : 0;
    const itemsHtml = foundOrder.items ? foundOrder.items.map(i => `
        <div style="background: rgba(0,0,0,0.03); padding: 0.4rem 0.6rem; border-radius: 6px; font-size: 0.8rem; margin-top: 0.3rem; display: flex; justify-content: space-between; align-items: center;">
            <span>${getItemSvgIcon(i.type, 'var(--primary)', 14)} <strong>${translateItemName(i.type)}</strong> (${translateColorName(i.color || 'White')})</span>
            <span style="font-family: monospace; font-size: 0.72rem; background: var(--primary); color: #fff; padding: 0.1rem 0.35rem; border-radius: 4px;">${i.trackingId}</span>
        </div>
    `).join('') : '';

    mobileSearchResultCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
            <div>
                <span style="font-weight: 700; color: var(--primary); font-size: 1.05rem;">Order #${foundOrder.id}</span>
                <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-main);">${foundOrder.customerName || 'Walk-in'}</div>
            </div>
            <div style="text-align: right;">
                <span class="badge" style="font-size: 0.72rem; background: #6366f1; color: #fff; padding: 0.15rem 0.5rem; border-radius: 6px;">${foundOrder.status}</span>
                <div style="font-size: 0.8rem; font-weight: 700; color: #10b981; margin-top: 0.2rem;">Total: ${itemsCount} Pcs</div>
            </div>
        </div>
        <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.2rem;">Order Item Breakdown (${itemsCount} Pcs):</div>
        ${itemsHtml}
        <button type="button" class="btn btn-primary" onclick="openOrderModal('${foundOrder.id}')" style="width: 100%; margin-top: 0.75rem; padding: 0.4rem; font-size: 0.78rem;">
            View Full Order Details & Print Tags
        </button>
    `;
    if (typeof lucide !== 'undefined') safeCreateIcons();
};

if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener('click', runMobileOrderQuantityCheck);
}
if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') runMobileOrderQuantityCheck();
    });
}

