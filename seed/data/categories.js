// 15 categories built strictly against /server/models/category.model.js:
//   name (required, unique, 5-50 chars), description (required, 10-500 chars),
//   allowedAttributes ([String], >= 1), image { url, public_id }, isActive (default true),
//   parentCategory (default null).
//
// `key` is NOT a schema field — it is a local identifier used only to link products
// to their category inside the seed; it is never written to the database.

// Attribute keys every product may carry, regardless of category.
const COMMON_ATTRS = [
    "brand",
    "rating",
    "reviewsCount",
    "discount",
    "oldPrice",
    "warranty",
    "color",
    "condition",
    "availability",
    "countryOfOrigin",
    "sku"
];

// Helper to keep the definitions readable.
const cat = (key, name, description, specificAttrs) => ({
    key,
    name,
    description,
    allowedAttributes: [...COMMON_ATTRS, ...specificAttrs],
    image: {
        url: `https://picsum.photos/seed/category-${key}/1200/600`,
        public_id: `seed/categories/${key}`
    }
});

const categories = [
    cat(
        "smartphones",
        "Smartphones",
        "Modern smartphones for work, communication and entertainment: flagships and affordable models from leading brands with advanced cameras and long-lasting batteries.",
        ["screenSize", "screenType", "ram", "storage", "os", "processor", "camera", "battery", "refreshRate"]
    ),
    cat(
        "laptops",
        "Laptops",
        "Ultrabooks, workstations and gaming laptops for every budget — from lightweight machines for study to powerful rigs for editing and gaming.",
        ["screenSize", "processor", "ram", "storage", "gpu", "os", "batteryLife", "weight"]
    ),
    cat(
        "headphones",
        "Headphones",
        "Wireless and wired headphones: over-ear, in-ear and on-ear models with active noise cancellation and high-quality sound.",
        ["type", "connection", "anc", "batteryLife", "codec", "driver"]
    ),
    cat(
        "monitors",
        "Monitors",
        "Monitors for work, design and gaming: from office Full HD panels to high refresh-rate gaming displays and professional 4K screens.",
        ["screenSize", "resolution", "panelType", "refreshRate", "responseTime", "ports"]
    ),
    cat(
        "gaming-gear",
        "Gaming Accessories",
        "Gamepads, racing wheels, streaming gear and gaming surfaces — everything that makes gameplay more comfortable and immersive.",
        ["platform", "connection", "type", "batteryLife", "compatibility"]
    ),
    cat(
        "keyboards",
        "Keyboards",
        "Mechanical and membrane keyboards for work and play: compact layouts, custom switches and configurable backlighting.",
        ["switchType", "layout", "connection", "backlight", "formFactor"]
    ),
    cat(
        "mice",
        "Computer Mice",
        "Gaming and office mice with precise sensors, comfortable grips and long battery life for wireless models.",
        ["sensor", "dpi", "connection", "buttons", "weight"]
    ),
    cat(
        "pc-components",
        "PC Components",
        "Graphics cards, processors, motherboards, memory, storage and cooling for building and upgrading desktop PCs.",
        ["type", "interface", "capacity", "tdp", "formFactor", "chipset", "socket"]
    ),
    cat(
        "smartwatches",
        "Smartwatches",
        "Smartwatches and fitness trackers for monitoring activity, health and notifications — with GPS, heart-rate tracking and water resistance.",
        ["screenSize", "os", "battery", "waterResistance", "sensors", "connectivity"]
    ),
    cat(
        "tablets",
        "Tablets",
        "Tablets for study, work and creativity: compact models for reading and powerful tablets with stylus and keyboard support.",
        ["screenSize", "processor", "ram", "storage", "os", "connectivity"]
    ),
    cat(
        "photo-video",
        "Photo & Video",
        "Mirrorless cameras, action cameras, drones and gimbals for professional-grade photo and video capture.",
        ["type", "sensor", "megapixels", "videoResolution", "mount", "stabilization"]
    ),
    cat(
        "audio",
        "Audio Equipment",
        "Portable and stationary speakers, soundbars and multi-room systems for great sound at home and on the go.",
        ["type", "power", "connection", "batteryLife", "waterResistance"]
    ),
    cat(
        "tv",
        "Televisions",
        "OLED, QLED and LED televisions with 4K, HDR and smart platform support — for movies, sports and gaming on the big screen.",
        ["screenSize", "resolution", "panelType", "os", "refreshRate", "hdr"]
    ),
    cat(
        "networking",
        "Networking Equipment",
        "Wi-Fi routers, mesh systems, access points and network storage for stable internet at home and in the office.",
        ["type", "wifiStandard", "speed", "ports", "coverage"]
    ),
    cat(
        "home-electronics",
        "Home Electronics",
        "Smart and household appliances for the home: robot vacuums, coffee machines, air fryers, air purifiers and smart speakers.",
        ["type", "power", "capacity", "connectivity", "features"]
    )
];

module.exports = { categories, COMMON_ATTRS };
