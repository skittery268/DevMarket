// Raw product pools, grouped by the category `key` defined in ./categories.js.
//
// Each entry is { title, brand, price, attrs } where:
//   - title : final Product.universal.title (5-100 chars)
//   - brand : surfaced as the `brand` attribute and used in descriptions
//   - price : Product.universal.price (positive number)
//   - attrs : category-specific specs (string values, keys MUST be in the
//             category's allowedAttributes — the seed also filters defensively)
//
// Common attributes (rating, reviewsCount, discount, warranty, color, etc.)
// are generated automatically in helpers.js, so they are not repeated here.

const productPools = {
    smartphones: [
        { title: "Apple iPhone 15 Pro 256GB", brand: "Apple", price: 1099, attrs: { screenSize: "6.1\"", screenType: "Super Retina XDR OLED", ram: "8 GB", storage: "256 GB", os: "iOS 17", processor: "A17 Pro", camera: "48 MP triple", battery: "3274 mAh", refreshRate: "120 Hz" } },
        { title: "Apple iPhone 15 128GB", brand: "Apple", price: 799, attrs: { screenSize: "6.1\"", screenType: "Super Retina XDR OLED", ram: "6 GB", storage: "128 GB", os: "iOS 17", processor: "A16 Bionic", camera: "48 MP dual", battery: "3349 mAh", refreshRate: "60 Hz" } },
        { title: "Apple iPhone 14 128GB", brand: "Apple", price: 699, attrs: { screenSize: "6.1\"", screenType: "Super Retina XDR OLED", ram: "6 GB", storage: "128 GB", os: "iOS 17", processor: "A15 Bionic", camera: "12 MP dual", battery: "3279 mAh", refreshRate: "60 Hz" } },
        { title: "Samsung Galaxy S24 Ultra 512GB", brand: "Samsung", price: 1299, attrs: { screenSize: "6.8\"", screenType: "Dynamic AMOLED 2X", ram: "12 GB", storage: "512 GB", os: "Android 14", processor: "Snapdragon 8 Gen 3", camera: "200 MP quad", battery: "5000 mAh", refreshRate: "120 Hz" } },
        { title: "Samsung Galaxy S23 256GB", brand: "Samsung", price: 899, attrs: { screenSize: "6.1\"", screenType: "Dynamic AMOLED 2X", ram: "8 GB", storage: "256 GB", os: "Android 14", processor: "Snapdragon 8 Gen 2", camera: "50 MP triple", battery: "3900 mAh", refreshRate: "120 Hz" } },
        { title: "Samsung Galaxy A55 128GB", brand: "Samsung", price: 449, attrs: { screenSize: "6.6\"", screenType: "Super AMOLED", ram: "8 GB", storage: "128 GB", os: "Android 14", processor: "Exynos 1480", camera: "50 MP triple", battery: "5000 mAh", refreshRate: "120 Hz" } },
        { title: "Google Pixel 8 Pro 256GB", brand: "Google", price: 999, attrs: { screenSize: "6.7\"", screenType: "LTPO OLED", ram: "12 GB", storage: "256 GB", os: "Android 14", processor: "Tensor G3", camera: "50 MP triple", battery: "5050 mAh", refreshRate: "120 Hz" } },
        { title: "Google Pixel 7a 128GB", brand: "Google", price: 499, attrs: { screenSize: "6.1\"", screenType: "OLED", ram: "8 GB", storage: "128 GB", os: "Android 14", processor: "Tensor G2", camera: "64 MP dual", battery: "4385 mAh", refreshRate: "90 Hz" } },
        { title: "Xiaomi 14 256GB", brand: "Xiaomi", price: 799, attrs: { screenSize: "6.36\"", screenType: "LTPO AMOLED", ram: "12 GB", storage: "256 GB", os: "HyperOS", processor: "Snapdragon 8 Gen 3", camera: "50 MP triple Leica", battery: "4610 mAh", refreshRate: "120 Hz" } },
        { title: "Xiaomi Redmi Note 13 Pro 256GB", brand: "Xiaomi", price: 379, attrs: { screenSize: "6.67\"", screenType: "AMOLED", ram: "8 GB", storage: "256 GB", os: "MIUI 14", processor: "Snapdragon 7s Gen 2", camera: "200 MP triple", battery: "5100 mAh", refreshRate: "120 Hz" } },
        { title: "POCO X6 Pro 512GB", brand: "POCO", price: 399, attrs: { screenSize: "6.67\"", screenType: "AMOLED", ram: "12 GB", storage: "512 GB", os: "HyperOS", processor: "Dimensity 8300 Ultra", camera: "64 MP triple", battery: "5000 mAh", refreshRate: "120 Hz" } },
        { title: "OnePlus 12 256GB", brand: "OnePlus", price: 799, attrs: { screenSize: "6.82\"", screenType: "LTPO AMOLED", ram: "12 GB", storage: "256 GB", os: "OxygenOS 14", processor: "Snapdragon 8 Gen 3", camera: "50 MP triple Hasselblad", battery: "5400 mAh", refreshRate: "120 Hz" } },
        { title: "Nothing Phone (2) 256GB", brand: "Nothing", price: 599, attrs: { screenSize: "6.7\"", screenType: "LTPO OLED", ram: "12 GB", storage: "256 GB", os: "Nothing OS 2.0", processor: "Snapdragon 8+ Gen 1", camera: "50 MP dual", battery: "4700 mAh", refreshRate: "120 Hz" } },
        { title: "Honor Magic6 Pro 512GB", brand: "Honor", price: 1099, attrs: { screenSize: "6.8\"", screenType: "LTPO OLED", ram: "12 GB", storage: "512 GB", os: "MagicOS 8", processor: "Snapdragon 8 Gen 3", camera: "180 MP triple", battery: "5600 mAh", refreshRate: "120 Hz" } },
        { title: "Realme GT 5 256GB", brand: "Realme", price: 549, attrs: { screenSize: "6.74\"", screenType: "AMOLED", ram: "12 GB", storage: "256 GB", os: "realme UI 5.0", processor: "Snapdragon 8 Gen 2", camera: "50 MP triple", battery: "5240 mAh", refreshRate: "144 Hz" } }
    ],

    laptops: [
        { title: "Apple MacBook Air 13 M3 256GB", brand: "Apple", price: 1099, attrs: { screenSize: "13.6\"", processor: "Apple M3", ram: "8 GB", storage: "256 GB SSD", gpu: "8-core GPU", os: "macOS Sonoma", batteryLife: "18 h", weight: "1.24 kg" } },
        { title: "Apple MacBook Pro 14 M3 Pro 512GB", brand: "Apple", price: 1999, attrs: { screenSize: "14.2\"", processor: "Apple M3 Pro", ram: "18 GB", storage: "512 GB SSD", gpu: "14-core GPU", os: "macOS Sonoma", batteryLife: "17 h", weight: "1.61 kg" } },
        { title: "Dell XPS 13 Plus 9320", brand: "Dell", price: 1399, attrs: { screenSize: "13.4\"", processor: "Intel Core i7-1360P", ram: "16 GB", storage: "512 GB SSD", gpu: "Intel Iris Xe", os: "Windows 11", batteryLife: "12 h", weight: "1.26 kg" } },
        { title: "Dell Inspiron 15 3530", brand: "Dell", price: 649, attrs: { screenSize: "15.6\"", processor: "Intel Core i5-1335U", ram: "8 GB", storage: "512 GB SSD", gpu: "Intel UHD", os: "Windows 11", batteryLife: "8 h", weight: "1.65 kg" } },
        { title: "ASUS ROG Zephyrus G14 GA403", brand: "ASUS", price: 1799, attrs: { screenSize: "14\"", processor: "AMD Ryzen 9 8945HS", ram: "16 GB", storage: "1 TB SSD", gpu: "GeForce RTX 4060", os: "Windows 11", batteryLife: "10 h", weight: "1.5 kg" } },
        { title: "ASUS ZenBook 14 OLED UX3405", brand: "ASUS", price: 1099, attrs: { screenSize: "14\"", processor: "Intel Core Ultra 7 155H", ram: "16 GB", storage: "1 TB SSD", gpu: "Intel Arc", os: "Windows 11", batteryLife: "13 h", weight: "1.28 kg" } },
        { title: "Lenovo ThinkPad X1 Carbon Gen 11", brand: "Lenovo", price: 1649, attrs: { screenSize: "14\"", processor: "Intel Core i7-1355U", ram: "16 GB", storage: "1 TB SSD", gpu: "Intel Iris Xe", os: "Windows 11 Pro", batteryLife: "15 h", weight: "1.12 kg" } },
        { title: "Lenovo Legion 5 Pro 16", brand: "Lenovo", price: 1499, attrs: { screenSize: "16\"", processor: "AMD Ryzen 7 7745HX", ram: "16 GB", storage: "1 TB SSD", gpu: "GeForce RTX 4070", os: "Windows 11", batteryLife: "8 h", weight: "2.5 kg" } },
        { title: "HP Spectre x360 14", brand: "HP", price: 1449, attrs: { screenSize: "13.5\"", processor: "Intel Core Ultra 7 155H", ram: "16 GB", storage: "1 TB SSD", gpu: "Intel Arc", os: "Windows 11", batteryLife: "13 h", weight: "1.36 kg" } },
        { title: "HP Pavilion 15-eg3000", brand: "HP", price: 729, attrs: { screenSize: "15.6\"", processor: "Intel Core i5-1335U", ram: "16 GB", storage: "512 GB SSD", gpu: "Intel Iris Xe", os: "Windows 11", batteryLife: "9 h", weight: "1.74 kg" } },
        { title: "Acer Swift 3 SF314", brand: "Acer", price: 699, attrs: { screenSize: "14\"", processor: "Intel Core i5-1240P", ram: "8 GB", storage: "512 GB SSD", gpu: "Intel Iris Xe", os: "Windows 11", batteryLife: "11 h", weight: "1.2 kg" } },
        { title: "Acer Predator Helios 16", brand: "Acer", price: 1899, attrs: { screenSize: "16\"", processor: "Intel Core i9-14900HX", ram: "32 GB", storage: "1 TB SSD", gpu: "GeForce RTX 4080", os: "Windows 11", batteryLife: "6 h", weight: "2.6 kg" } },
        { title: "MSI Stealth 16 Studio", brand: "MSI", price: 1999, attrs: { screenSize: "16\"", processor: "Intel Core i7-13700H", ram: "32 GB", storage: "1 TB SSD", gpu: "GeForce RTX 4070", os: "Windows 11", batteryLife: "7 h", weight: "1.99 kg" } },
        { title: "Huawei MateBook X Pro 2024", brand: "Huawei", price: 1599, attrs: { screenSize: "14.2\"", processor: "Intel Core Ultra 9 185H", ram: "32 GB", storage: "1 TB SSD", gpu: "Intel Arc", os: "Windows 11", batteryLife: "12 h", weight: "0.98 kg" } },
        { title: "Microsoft Surface Laptop 5 13", brand: "Microsoft", price: 1299, attrs: { screenSize: "13.5\"", processor: "Intel Core i5-1235U", ram: "8 GB", storage: "512 GB SSD", gpu: "Intel Iris Xe", os: "Windows 11", batteryLife: "18 h", weight: "1.27 kg" } }
    ],

    headphones: [
        { title: "Apple AirPods Pro 2 USB-C", brand: "Apple", price: 249, attrs: { type: "In-ear", connection: "Bluetooth 5.3", anc: "Active", batteryLife: "30 h with case", codec: "AAC", driver: "Custom" } },
        { title: "Apple AirPods Max", brand: "Apple", price: 549, attrs: { type: "Over-ear", connection: "Bluetooth 5.0", anc: "Active", batteryLife: "20 h", codec: "AAC", driver: "40 mm" } },
        { title: "Sony WH-1000XM5", brand: "Sony", price: 399, attrs: { type: "Over-ear", connection: "Bluetooth 5.2", anc: "Active", batteryLife: "30 h", codec: "LDAC", driver: "30 mm" } },
        { title: "Sony WF-1000XM5", brand: "Sony", price: 299, attrs: { type: "In-ear", connection: "Bluetooth 5.3", anc: "Active", batteryLife: "24 h with case", codec: "LDAC", driver: "8.4 mm" } },
        { title: "Bose QuietComfort Ultra Headphones", brand: "Bose", price: 429, attrs: { type: "Over-ear", connection: "Bluetooth 5.3", anc: "Active", batteryLife: "24 h", codec: "aptX Adaptive", driver: "35 mm" } },
        { title: "Bose QuietComfort Earbuds II", brand: "Bose", price: 279, attrs: { type: "In-ear", connection: "Bluetooth 5.3", anc: "Active", batteryLife: "24 h with case", codec: "aptX Adaptive", driver: "9.3 mm" } },
        { title: "Sennheiser Momentum 4 Wireless", brand: "Sennheiser", price: 349, attrs: { type: "Over-ear", connection: "Bluetooth 5.2", anc: "Active", batteryLife: "60 h", codec: "aptX Adaptive", driver: "42 mm" } },
        { title: "JBL Tour One M2", brand: "JBL", price: 299, attrs: { type: "Over-ear", connection: "Bluetooth 5.3", anc: "Active", batteryLife: "50 h", codec: "LDAC", driver: "40 mm" } },
        { title: "Beats Studio Pro", brand: "Beats", price: 349, attrs: { type: "Over-ear", connection: "Bluetooth 5.3", anc: "Active", batteryLife: "40 h", codec: "AAC", driver: "40 mm" } },
        { title: "Marshall Major IV", brand: "Marshall", price: 149, attrs: { type: "On-ear", connection: "Bluetooth 5.1", anc: "None", batteryLife: "80 h", codec: "SBC", driver: "40 mm" } },
        { title: "Jabra Elite 10", brand: "Jabra", price: 249, attrs: { type: "In-ear", connection: "Bluetooth 5.3", anc: "Active", batteryLife: "27 h with case", codec: "Dolby Audio", driver: "10 mm" } },
        { title: "Samsung Galaxy Buds3 Pro", brand: "Samsung", price: 249, attrs: { type: "In-ear", connection: "Bluetooth 5.4", anc: "Active", batteryLife: "26 h with case", codec: "SSC", driver: "10.5 mm" } },
        { title: "Anker Soundcore Liberty 4", brand: "Anker", price: 99, attrs: { type: "In-ear", connection: "Bluetooth 5.3", anc: "Active", batteryLife: "28 h with case", codec: "LDAC", driver: "9.2 mm" } },
        { title: "Audio-Technica ATH-M50x", brand: "Audio-Technica", price: 149, attrs: { type: "Over-ear", connection: "Wired 3.5 mm", anc: "None", batteryLife: "N/A", codec: "Analog", driver: "45 mm" } }
    ],

    monitors: [
        { title: "LG UltraGear 27GP850-B", brand: "LG", price: 449, attrs: { screenSize: "27\"", resolution: "2560x1440", panelType: "Nano IPS", refreshRate: "180 Hz", responseTime: "1 ms", ports: "HDMI 2.0, DP 1.4" } },
        { title: "LG 27UL850-W", brand: "LG", price: 499, attrs: { screenSize: "27\"", resolution: "3840x2160", panelType: "IPS", refreshRate: "60 Hz", responseTime: "5 ms", ports: "HDMI, DP, USB-C" } },
        { title: "Samsung Odyssey G7 32", brand: "Samsung", price: 699, attrs: { screenSize: "32\"", resolution: "2560x1440", panelType: "VA", refreshRate: "240 Hz", responseTime: "1 ms", ports: "HDMI 2.0, DP 1.4" } },
        { title: "Samsung Smart Monitor M8 32", brand: "Samsung", price: 599, attrs: { screenSize: "32\"", resolution: "3840x2160", panelType: "VA", refreshRate: "60 Hz", responseTime: "4 ms", ports: "HDMI, USB-C" } },
        { title: "Dell UltraSharp U2723QE", brand: "Dell", price: 619, attrs: { screenSize: "27\"", resolution: "3840x2160", panelType: "IPS Black", refreshRate: "60 Hz", responseTime: "5 ms", ports: "HDMI, DP, USB-C" } },
        { title: "ASUS ROG Swift PG279QM", brand: "ASUS", price: 849, attrs: { screenSize: "27\"", resolution: "2560x1440", panelType: "IPS", refreshRate: "240 Hz", responseTime: "1 ms", ports: "HDMI, DP 1.4" } },
        { title: "ASUS ProArt PA278CV", brand: "ASUS", price: 329, attrs: { screenSize: "27\"", resolution: "2560x1440", panelType: "IPS", refreshRate: "75 Hz", responseTime: "5 ms", ports: "HDMI, DP, USB-C" } },
        { title: "BenQ PD2705U", brand: "BenQ", price: 549, attrs: { screenSize: "27\"", resolution: "3840x2160", panelType: "IPS", refreshRate: "60 Hz", responseTime: "5 ms", ports: "HDMI, DP, USB-C" } },
        { title: "AOC 24G2 Gaming Monitor", brand: "AOC", price: 169, attrs: { screenSize: "23.8\"", resolution: "1920x1080", panelType: "IPS", refreshRate: "144 Hz", responseTime: "1 ms", ports: "HDMI, DP, VGA" } },
        { title: "Gigabyte M27Q rev 2.0", brand: "Gigabyte", price: 299, attrs: { screenSize: "27\"", resolution: "2560x1440", panelType: "SS IPS", refreshRate: "170 Hz", responseTime: "0.5 ms", ports: "HDMI, DP, USB-C" } },
        { title: "MSI Optix MAG274QRF-QD", brand: "MSI", price: 379, attrs: { screenSize: "27\"", resolution: "2560x1440", panelType: "Rapid IPS", refreshRate: "165 Hz", responseTime: "1 ms", ports: "HDMI, DP, USB-C" } },
        { title: "Acer Nitro XV272U", brand: "Acer", price: 289, attrs: { screenSize: "27\"", resolution: "2560x1440", panelType: "IPS", refreshRate: "170 Hz", responseTime: "1 ms", ports: "HDMI, DP" } },
        { title: "ViewSonic VX2758-2KP-MHD", brand: "ViewSonic", price: 259, attrs: { screenSize: "27\"", resolution: "2560x1440", panelType: "IPS", refreshRate: "144 Hz", responseTime: "1 ms", ports: "HDMI, DP" } }
    ],

    "gaming-gear": [
        { title: "Sony DualSense Wireless Controller", brand: "Sony", price: 69, attrs: { platform: "PlayStation 5", connection: "Bluetooth / USB-C", type: "Gamepad", batteryLife: "12 h", compatibility: "PS5, PC" } },
        { title: "Xbox Wireless Controller", brand: "Microsoft", price: 59, attrs: { platform: "Xbox Series X|S", connection: "Bluetooth / Xbox Wireless", type: "Gamepad", batteryLife: "40 h", compatibility: "Xbox, PC, Mobile" } },
        { title: "8BitDo Ultimate Controller", brand: "8BitDo", price: 69, attrs: { platform: "PC / Switch", connection: "2.4G / Bluetooth", type: "Gamepad", batteryLife: "22 h", compatibility: "Switch, PC, Android" } },
        { title: "Razer Kishi V2 Mobile Controller", brand: "Razer", price: 99, attrs: { platform: "Mobile", connection: "USB-C", type: "Mobile gamepad", batteryLife: "N/A", compatibility: "Android, iPhone 15" } },
        { title: "Logitech G29 Driving Force", brand: "Logitech", price: 299, attrs: { platform: "PlayStation / PC", connection: "USB", type: "Racing wheel", batteryLife: "N/A", compatibility: "PS5, PS4, PC" } },
        { title: "Thrustmaster T300 RS GT", brand: "Thrustmaster", price: 399, attrs: { platform: "PlayStation / PC", connection: "USB", type: "Racing wheel", batteryLife: "N/A", compatibility: "PS5, PS4, PC" } },
        { title: "Elgato Stream Deck MK.2", brand: "Elgato", price: 149, attrs: { platform: "PC / Mac", connection: "USB-C", type: "Stream controller", batteryLife: "N/A", compatibility: "Windows, macOS" } },
        { title: "HyperX QuadCast S Microphone", brand: "HyperX", price: 159, attrs: { platform: "PC / Mac", connection: "USB", type: "Microphone", batteryLife: "N/A", compatibility: "PC, PS5, Mac" } },
        { title: "NZXT Capsule USB Microphone", brand: "NZXT", price: 129, attrs: { platform: "PC", connection: "USB", type: "Microphone", batteryLife: "N/A", compatibility: "Windows, macOS" } },
        { title: "Razer Goliathus Extended Chroma", brand: "Razer", price: 59, attrs: { platform: "PC", connection: "USB", type: "Mousepad", batteryLife: "N/A", compatibility: "Universal" } },
        { title: "SteelSeries QcK Heavy XXL", brand: "SteelSeries", price: 39, attrs: { platform: "PC", connection: "N/A", type: "Mousepad", batteryLife: "N/A", compatibility: "Universal" } },
        { title: "Backbone One Mobile Controller", brand: "Backbone", price: 99, attrs: { platform: "Mobile", connection: "USB-C", type: "Mobile gamepad", batteryLife: "N/A", compatibility: "Android, iPhone" } },
        { title: "Razer Wolverine V2 Chroma", brand: "Razer", price: 149, attrs: { platform: "Xbox / PC", connection: "USB", type: "Gamepad", batteryLife: "N/A", compatibility: "Xbox, PC" } }
    ],

    keyboards: [
        { title: "Keychron K2 Wireless Mechanical", brand: "Keychron", price: 99, attrs: { switchType: "Gateron Brown", layout: "75%", connection: "Bluetooth / USB-C", backlight: "RGB", formFactor: "Compact" } },
        { title: "Keychron Q1 QMK Custom", brand: "Keychron", price: 179, attrs: { switchType: "Gateron G Pro Red", layout: "75%", connection: "USB-C", backlight: "RGB", formFactor: "Gasket mount" } },
        { title: "Logitech MX Keys S", brand: "Logitech", price: 109, attrs: { switchType: "Scissor", layout: "Full-size", connection: "Bluetooth / Logi Bolt", backlight: "White", formFactor: "Low profile" } },
        { title: "Logitech G915 TKL Lightspeed", brand: "Logitech", price: 229, attrs: { switchType: "GL Tactile", layout: "TKL", connection: "Lightspeed / Bluetooth", backlight: "RGB", formFactor: "Low profile" } },
        { title: "Razer Huntsman V3 Pro", brand: "Razer", price: 249, attrs: { switchType: "Analog Optical", layout: "Full-size", connection: "USB-C", backlight: "RGB", formFactor: "Full-size" } },
        { title: "Razer BlackWidow V4 Pro", brand: "Razer", price: 229, attrs: { switchType: "Green Mechanical", layout: "Full-size", connection: "USB-C", backlight: "RGB", formFactor: "Full-size" } },
        { title: "Corsair K70 RGB Pro", brand: "Corsair", price: 169, attrs: { switchType: "Cherry MX Red", layout: "Full-size", connection: "USB-C", backlight: "RGB", formFactor: "Full-size" } },
        { title: "SteelSeries Apex Pro TKL", brand: "SteelSeries", price: 219, attrs: { switchType: "OmniPoint 2.0", layout: "TKL", connection: "USB-C", backlight: "RGB", formFactor: "TKL" } },
        { title: "Ducky One 3 SF", brand: "Ducky", price: 129, attrs: { switchType: "Cherry MX Brown", layout: "65%", connection: "USB-C", backlight: "RGB", formFactor: "Compact" } },
        { title: "HyperX Alloy Origins Core", brand: "HyperX", price: 89, attrs: { switchType: "HyperX Red", layout: "TKL", connection: "USB-C", backlight: "RGB", formFactor: "TKL" } },
        { title: "Varmilo VA87M Sea Melody", brand: "Varmilo", price: 159, attrs: { switchType: "Cherry MX Silent Red", layout: "TKL", connection: "USB-C", backlight: "White", formFactor: "TKL" } },
        { title: "Akko 3068B Plus", brand: "Akko", price: 89, attrs: { switchType: "Akko CS Jelly Pink", layout: "65%", connection: "Bluetooth / 2.4G / USB-C", backlight: "RGB", formFactor: "Compact" } },
        { title: "Royal Kludge RK84", brand: "Royal Kludge", price: 69, attrs: { switchType: "RK Hot-swap Brown", layout: "75%", connection: "Bluetooth / 2.4G / USB-C", backlight: "RGB", formFactor: "Compact" } }
    ],

    mice: [
        { title: "Logitech MX Master 3S", brand: "Logitech", price: 99, attrs: { sensor: "Darkfield 8K", dpi: "8000", connection: "Bluetooth / Logi Bolt", buttons: "7", weight: "141 g" } },
        { title: "Logitech G Pro X Superlight 2", brand: "Logitech", price: 159, attrs: { sensor: "HERO 2", dpi: "32000", connection: "Lightspeed Wireless", buttons: "5", weight: "60 g" } },
        { title: "Logitech G502 X Plus", brand: "Logitech", price: 149, attrs: { sensor: "HERO 25K", dpi: "25600", connection: "Lightspeed Wireless", buttons: "13", weight: "106 g" } },
        { title: "Razer DeathAdder V3 Pro", brand: "Razer", price: 149, attrs: { sensor: "Focus Pro 30K", dpi: "30000", connection: "HyperSpeed Wireless", buttons: "5", weight: "63 g" } },
        { title: "Razer Viper V3 Pro", brand: "Razer", price: 159, attrs: { sensor: "Focus Pro 35K", dpi: "35000", connection: "HyperSpeed Wireless", buttons: "6", weight: "54 g" } },
        { title: "Razer Basilisk V3 Pro", brand: "Razer", price: 159, attrs: { sensor: "Focus Pro 30K", dpi: "30000", connection: "HyperSpeed / Bluetooth", buttons: "11", weight: "112 g" } },
        { title: "SteelSeries Aerox 5 Wireless", brand: "SteelSeries", price: 139, attrs: { sensor: "TrueMove Air", dpi: "18000", connection: "2.4G / Bluetooth", buttons: "9", weight: "74 g" } },
        { title: "Glorious Model O 2 Wireless", brand: "Glorious", price: 99, attrs: { sensor: "BAMF 2.0", dpi: "26000", connection: "2.4G Wireless", buttons: "6", weight: "63 g" } },
        { title: "Corsair Dark Core RGB Pro SE", brand: "Corsair", price: 89, attrs: { sensor: "Marksman 18K", dpi: "18000", connection: "Slipstream / Bluetooth", buttons: "8", weight: "133 g" } },
        { title: "Zowie EC2-C", brand: "Zowie", price: 69, attrs: { sensor: "3360", dpi: "3200", connection: "Wired USB", buttons: "5", weight: "73 g" } },
        { title: "Pulsar X2 Wireless", brand: "Pulsar", price: 95, attrs: { sensor: "PixArt PAW3395", dpi: "26000", connection: "2.4G Wireless", buttons: "6", weight: "52 g" } },
        { title: "Microsoft Surface Mouse", brand: "Microsoft", price: 49, attrs: { sensor: "BlueTrack", dpi: "1000", connection: "Bluetooth", buttons: "2", weight: "78 g" } },
        { title: "Apple Magic Mouse", brand: "Apple", price: 79, attrs: { sensor: "Laser tracking", dpi: "1300", connection: "Bluetooth", buttons: "Touch surface", weight: "99 g" } }
    ],

    "pc-components": [
        { title: "NVIDIA GeForce RTX 4090 Founders Edition", brand: "NVIDIA", price: 1599, attrs: { type: "Graphics card", interface: "PCIe 4.0", capacity: "24 GB GDDR6X", tdp: "450 W", formFactor: "Triple slot", chipset: "AD102" } },
        { title: "NVIDIA GeForce RTX 4070 Super", brand: "NVIDIA", price: 599, attrs: { type: "Graphics card", interface: "PCIe 4.0", capacity: "12 GB GDDR6X", tdp: "220 W", formFactor: "Dual slot", chipset: "AD104" } },
        { title: "AMD Radeon RX 7900 XTX", brand: "AMD", price: 949, attrs: { type: "Graphics card", interface: "PCIe 4.0", capacity: "24 GB GDDR6", tdp: "355 W", formFactor: "Triple slot", chipset: "Navi 31" } },
        { title: "Intel Core i9-14900K", brand: "Intel", price: 549, attrs: { type: "Processor", capacity: "24 cores", tdp: "125 W", socket: "LGA1700", chipset: "Raptor Lake Refresh" } },
        { title: "Intel Core i5-14600K", brand: "Intel", price: 299, attrs: { type: "Processor", capacity: "14 cores", tdp: "125 W", socket: "LGA1700", chipset: "Raptor Lake Refresh" } },
        { title: "AMD Ryzen 9 7950X", brand: "AMD", price: 549, attrs: { type: "Processor", capacity: "16 cores", tdp: "170 W", socket: "AM5", chipset: "Zen 4" } },
        { title: "AMD Ryzen 5 7600X", brand: "AMD", price: 249, attrs: { type: "Processor", capacity: "6 cores", tdp: "105 W", socket: "AM5", chipset: "Zen 4" } },
        { title: "ASUS ROG Strix Z790-E Gaming", brand: "ASUS", price: 499, attrs: { type: "Motherboard", interface: "PCIe 5.0", formFactor: "ATX", socket: "LGA1700", chipset: "Z790" } },
        { title: "MSI MAG B650 Tomahawk WiFi", brand: "MSI", price: 219, attrs: { type: "Motherboard", interface: "PCIe 4.0", formFactor: "ATX", socket: "AM5", chipset: "B650" } },
        { title: "Corsair Vengeance 32GB DDR5-6000", brand: "Corsair", price: 119, attrs: { type: "Memory", interface: "DDR5", capacity: "32 GB (2x16)", formFactor: "DIMM" } },
        { title: "G.Skill Trident Z5 32GB DDR5-6400", brand: "G.Skill", price: 139, attrs: { type: "Memory", interface: "DDR5", capacity: "32 GB (2x16)", formFactor: "DIMM" } },
        { title: "Samsung 990 Pro 2TB NVMe SSD", brand: "Samsung", price: 169, attrs: { type: "SSD", interface: "PCIe 4.0 NVMe", capacity: "2 TB", formFactor: "M.2 2280" } },
        { title: "WD Black SN850X 1TB NVMe SSD", brand: "Western Digital", price: 99, attrs: { type: "SSD", interface: "PCIe 4.0 NVMe", capacity: "1 TB", formFactor: "M.2 2280" } },
        { title: "Seasonic Focus GX-850 80+ Gold", brand: "Seasonic", price: 139, attrs: { type: "Power supply", capacity: "850 W", formFactor: "ATX", tdp: "850 W" } },
        { title: "Noctua NH-D15 CPU Cooler", brand: "Noctua", price: 109, attrs: { type: "Air cooler", formFactor: "Dual tower", socket: "LGA1700 / AM5", tdp: "220 W" } },
        { title: "Corsair iCUE H150i Elite LCD", brand: "Corsair", price: 279, attrs: { type: "Liquid cooler", formFactor: "360 mm AIO", socket: "LGA1700 / AM5", tdp: "300 W" } }
    ],

    smartwatches: [
        { title: "Apple Watch Series 9 GPS 45mm", brand: "Apple", price: 429, attrs: { screenSize: "45 mm", os: "watchOS 10", battery: "18 h", waterResistance: "50 m", sensors: "ECG, SpO2, Heart rate", connectivity: "Bluetooth, Wi-Fi" } },
        { title: "Apple Watch Ultra 2 49mm", brand: "Apple", price: 799, attrs: { screenSize: "49 mm", os: "watchOS 10", battery: "36 h", waterResistance: "100 m", sensors: "ECG, SpO2, Depth", connectivity: "LTE, GPS, Wi-Fi" } },
        { title: "Apple Watch SE 2 40mm", brand: "Apple", price: 249, attrs: { screenSize: "40 mm", os: "watchOS 10", battery: "18 h", waterResistance: "50 m", sensors: "Heart rate, Accelerometer", connectivity: "Bluetooth, Wi-Fi" } },
        { title: "Samsung Galaxy Watch6 44mm", brand: "Samsung", price: 329, attrs: { screenSize: "44 mm", os: "Wear OS 4", battery: "40 h", waterResistance: "5 ATM", sensors: "ECG, BIA, SpO2", connectivity: "Bluetooth, Wi-Fi" } },
        { title: "Samsung Galaxy Watch6 Classic 47mm", brand: "Samsung", price: 429, attrs: { screenSize: "47 mm", os: "Wear OS 4", battery: "40 h", waterResistance: "5 ATM", sensors: "ECG, BIA, SpO2", connectivity: "LTE, GPS" } },
        { title: "Garmin Fenix 7", brand: "Garmin", price: 699, attrs: { screenSize: "47 mm", os: "Garmin OS", battery: "18 days", waterResistance: "10 ATM", sensors: "Pulse Ox, Compass, Altimeter", connectivity: "GPS, Bluetooth" } },
        { title: "Garmin Venu 3", brand: "Garmin", price: 449, attrs: { screenSize: "45 mm", os: "Garmin OS", battery: "14 days", waterResistance: "5 ATM", sensors: "ECG, Pulse Ox", connectivity: "GPS, Bluetooth, Wi-Fi" } },
        { title: "Huawei Watch GT 4 46mm", brand: "Huawei", price: 249, attrs: { screenSize: "46 mm", os: "HarmonyOS", battery: "14 days", waterResistance: "5 ATM", sensors: "Heart rate, SpO2", connectivity: "GPS, Bluetooth" } },
        { title: "Amazfit GTR 4", brand: "Amazfit", price: 199, attrs: { screenSize: "1.43\"", os: "Zepp OS", battery: "14 days", waterResistance: "5 ATM", sensors: "Heart rate, SpO2", connectivity: "GPS, Bluetooth" } },
        { title: "Google Pixel Watch 2", brand: "Google", price: 349, attrs: { screenSize: "41 mm", os: "Wear OS 4", battery: "24 h", waterResistance: "5 ATM", sensors: "ECG, EDA, SpO2", connectivity: "LTE, GPS, Wi-Fi" } },
        { title: "Fitbit Versa 4", brand: "Fitbit", price: 199, attrs: { screenSize: "1.58\"", os: "Fitbit OS", battery: "6 days", waterResistance: "50 m", sensors: "Heart rate, SpO2", connectivity: "GPS, Bluetooth" } },
        { title: "Xiaomi Watch S3", brand: "Xiaomi", price: 149, attrs: { screenSize: "1.43\"", os: "HyperOS", battery: "15 days", waterResistance: "5 ATM", sensors: "Heart rate, SpO2", connectivity: "GPS, Bluetooth" } },
        { title: "Withings ScanWatch 2", brand: "Withings", price: 349, attrs: { screenSize: "38 mm", os: "Withings OS", battery: "30 days", waterResistance: "5 ATM", sensors: "ECG, SpO2, Temperature", connectivity: "Bluetooth" } }
    ],

    tablets: [
        { title: "Apple iPad Pro 12.9 M2 256GB", brand: "Apple", price: 1099, attrs: { screenSize: "12.9\"", processor: "Apple M2", ram: "8 GB", storage: "256 GB", os: "iPadOS 17", connectivity: "Wi-Fi 6E" } },
        { title: "Apple iPad Air 11 M2 128GB", brand: "Apple", price: 599, attrs: { screenSize: "11\"", processor: "Apple M2", ram: "8 GB", storage: "128 GB", os: "iPadOS 17", connectivity: "Wi-Fi 6E" } },
        { title: "Apple iPad 10.9 64GB", brand: "Apple", price: 349, attrs: { screenSize: "10.9\"", processor: "Apple A14 Bionic", ram: "4 GB", storage: "64 GB", os: "iPadOS 17", connectivity: "Wi-Fi" } },
        { title: "Apple iPad mini 6 64GB", brand: "Apple", price: 499, attrs: { screenSize: "8.3\"", processor: "Apple A15 Bionic", ram: "4 GB", storage: "64 GB", os: "iPadOS 17", connectivity: "Wi-Fi" } },
        { title: "Samsung Galaxy Tab S9 Ultra 256GB", brand: "Samsung", price: 1199, attrs: { screenSize: "14.6\"", processor: "Snapdragon 8 Gen 2", ram: "12 GB", storage: "256 GB", os: "Android 14", connectivity: "Wi-Fi 6E" } },
        { title: "Samsung Galaxy Tab S9 128GB", brand: "Samsung", price: 799, attrs: { screenSize: "11\"", processor: "Snapdragon 8 Gen 2", ram: "8 GB", storage: "128 GB", os: "Android 14", connectivity: "Wi-Fi 6E" } },
        { title: "Samsung Galaxy Tab A9+ 64GB", brand: "Samsung", price: 219, attrs: { screenSize: "11\"", processor: "Snapdragon 695", ram: "4 GB", storage: "64 GB", os: "Android 13", connectivity: "Wi-Fi" } },
        { title: "Xiaomi Pad 6 128GB", brand: "Xiaomi", price: 329, attrs: { screenSize: "11\"", processor: "Snapdragon 870", ram: "6 GB", storage: "128 GB", os: "MIUI Pad 14", connectivity: "Wi-Fi" } },
        { title: "Lenovo Tab P12", brand: "Lenovo", price: 349, attrs: { screenSize: "12.7\"", processor: "MediaTek Dimensity 7050", ram: "8 GB", storage: "128 GB", os: "Android 13", connectivity: "Wi-Fi 6" } },
        { title: "Huawei MatePad Pro 13.2", brand: "Huawei", price: 999, attrs: { screenSize: "13.2\"", processor: "Kirin 9000s", ram: "12 GB", storage: "256 GB", os: "HarmonyOS 4", connectivity: "Wi-Fi 6" } },
        { title: "Microsoft Surface Pro 9", brand: "Microsoft", price: 999, attrs: { screenSize: "13\"", processor: "Intel Core i5-1235U", ram: "8 GB", storage: "256 GB", os: "Windows 11", connectivity: "Wi-Fi 6E" } },
        { title: "Amazon Fire Max 11", brand: "Amazon", price: 229, attrs: { screenSize: "11\"", processor: "MediaTek MT8188J", ram: "4 GB", storage: "64 GB", os: "Fire OS", connectivity: "Wi-Fi 6" } },
        { title: "OnePlus Pad 128GB", brand: "OnePlus", price: 479, attrs: { screenSize: "11.61\"", processor: "MediaTek Dimensity 9000", ram: "8 GB", storage: "128 GB", os: "OxygenOS 13.1", connectivity: "Wi-Fi 6" } }
    ],

    "photo-video": [
        { title: "Sony Alpha A7 IV Body", brand: "Sony", price: 2499, attrs: { type: "Mirrorless camera", sensor: "Full-frame CMOS", megapixels: "33 MP", videoResolution: "4K 60p", mount: "Sony E", stabilization: "5-axis IBIS" } },
        { title: "Sony ZV-E10 Kit 16-50mm", brand: "Sony", price: 799, attrs: { type: "Mirrorless camera", sensor: "APS-C CMOS", megapixels: "24 MP", videoResolution: "4K 30p", mount: "Sony E", stabilization: "Electronic" } },
        { title: "Canon EOS R6 Mark II Body", brand: "Canon", price: 2499, attrs: { type: "Mirrorless camera", sensor: "Full-frame CMOS", megapixels: "24 MP", videoResolution: "4K 60p", mount: "Canon RF", stabilization: "5-axis IBIS" } },
        { title: "Canon EOS R50 Kit 18-45mm", brand: "Canon", price: 799, attrs: { type: "Mirrorless camera", sensor: "APS-C CMOS", megapixels: "24 MP", videoResolution: "4K 30p", mount: "Canon RF", stabilization: "Electronic" } },
        { title: "Nikon Z6 III Body", brand: "Nikon", price: 2499, attrs: { type: "Mirrorless camera", sensor: "Full-frame CMOS", megapixels: "24 MP", videoResolution: "6K 60p", mount: "Nikon Z", stabilization: "5-axis IBIS" } },
        { title: "Nikon Zf Body", brand: "Nikon", price: 1999, attrs: { type: "Mirrorless camera", sensor: "Full-frame CMOS", megapixels: "24 MP", videoResolution: "4K 60p", mount: "Nikon Z", stabilization: "5-axis IBIS" } },
        { title: "Fujifilm X-T5 Body", brand: "Fujifilm", price: 1699, attrs: { type: "Mirrorless camera", sensor: "APS-C X-Trans 5", megapixels: "40 MP", videoResolution: "6.2K 30p", mount: "Fujifilm X", stabilization: "5-axis IBIS" } },
        { title: "Fujifilm X100VI", brand: "Fujifilm", price: 1599, attrs: { type: "Compact camera", sensor: "APS-C X-Trans 5", megapixels: "40 MP", videoResolution: "6.2K 30p", mount: "Fixed 23mm", stabilization: "5-axis IBIS" } },
        { title: "Panasonic Lumix S5 II Body", brand: "Panasonic", price: 1999, attrs: { type: "Mirrorless camera", sensor: "Full-frame CMOS", megapixels: "24 MP", videoResolution: "6K 30p", mount: "Leica L", stabilization: "5-axis IBIS" } },
        { title: "GoPro HERO12 Black", brand: "GoPro", price: 399, attrs: { type: "Action camera", sensor: "1/1.9\" CMOS", megapixels: "27 MP", videoResolution: "5.3K 60p", mount: "GoPro mount", stabilization: "HyperSmooth 6.0" } },
        { title: "DJI Osmo Pocket 3", brand: "DJI", price: 519, attrs: { type: "Gimbal camera", sensor: "1\" CMOS", megapixels: "9.4 MP", videoResolution: "4K 120p", mount: "Built-in gimbal", stabilization: "3-axis mechanical" } },
        { title: "DJI Mini 4 Pro", brand: "DJI", price: 759, attrs: { type: "Camera drone", sensor: "1/1.3\" CMOS", megapixels: "48 MP", videoResolution: "4K 100p", mount: "Built-in gimbal", stabilization: "3-axis gimbal" } },
        { title: "Insta360 X4", brand: "Insta360", price: 499, attrs: { type: "360 camera", sensor: "Dual 1/2\" CMOS", megapixels: "72 MP", videoResolution: "8K 30p", mount: "Standard 1/4\"", stabilization: "FlowState" } }
    ],

    audio: [
        { title: "Sonos Era 300", brand: "Sonos", price: 449, attrs: { type: "Smart speaker", power: "Class-D amplified", connection: "Wi-Fi / Bluetooth", batteryLife: "N/A", waterResistance: "None" } },
        { title: "Sonos Beam Gen 2 Soundbar", brand: "Sonos", price: 499, attrs: { type: "Soundbar", power: "5.0 channel", connection: "HDMI eARC / Wi-Fi", batteryLife: "N/A", waterResistance: "None" } },
        { title: "JBL Charge 5", brand: "JBL", price: 179, attrs: { type: "Portable speaker", power: "40 W", connection: "Bluetooth 5.1", batteryLife: "20 h", waterResistance: "IP67" } },
        { title: "JBL Flip 6", brand: "JBL", price: 129, attrs: { type: "Portable speaker", power: "30 W", connection: "Bluetooth 5.1", batteryLife: "12 h", waterResistance: "IP67" } },
        { title: "Bose SoundLink Flex", brand: "Bose", price: 149, attrs: { type: "Portable speaker", power: "Built-in", connection: "Bluetooth 4.2", batteryLife: "12 h", waterResistance: "IP67" } },
        { title: "Marshall Stanmore III", brand: "Marshall", price: 379, attrs: { type: "Bookshelf speaker", power: "80 W", connection: "Bluetooth 5.2 / RCA", batteryLife: "N/A", waterResistance: "None" } },
        { title: "Marshall Emberton II", brand: "Marshall", price: 169, attrs: { type: "Portable speaker", power: "20 W", connection: "Bluetooth 5.1", batteryLife: "30 h", waterResistance: "IP67" } },
        { title: "Harman Kardon Aura Studio 3", brand: "Harman Kardon", price: 279, attrs: { type: "Home speaker", power: "130 W", connection: "Bluetooth / AUX", batteryLife: "N/A", waterResistance: "None" } },
        { title: "Yamaha YAS-209 Soundbar", brand: "Yamaha", price: 349, attrs: { type: "Soundbar", power: "200 W", connection: "HDMI / Bluetooth", batteryLife: "N/A", waterResistance: "None" } },
        { title: "Edifier R1280T Bookshelf Speakers", brand: "Edifier", price: 119, attrs: { type: "Bookshelf speakers", power: "42 W", connection: "RCA / AUX", batteryLife: "N/A", waterResistance: "None" } },
        { title: "Audioengine A2+ Wireless", brand: "Audioengine", price: 269, attrs: { type: "Desktop speakers", power: "60 W", connection: "Bluetooth / USB / RCA", batteryLife: "N/A", waterResistance: "None" } },
        { title: "Denon Home 350", brand: "Denon", price: 599, attrs: { type: "Wireless speaker", power: "High output", connection: "Wi-Fi / Bluetooth", batteryLife: "N/A", waterResistance: "None" } },
        { title: "Ultimate Ears BOOM 3", brand: "Ultimate Ears", price: 149, attrs: { type: "Portable speaker", power: "Built-in", connection: "Bluetooth 5.0", batteryLife: "15 h", waterResistance: "IP67" } }
    ],

    tv: [
        { title: "LG OLED55C3 55\" 4K", brand: "LG", price: 1399, attrs: { screenSize: "55\"", resolution: "3840x2160", panelType: "OLED evo", os: "webOS 23", refreshRate: "120 Hz", hdr: "Dolby Vision, HDR10" } },
        { title: "LG OLED65G3 65\" 4K", brand: "LG", price: 2599, attrs: { screenSize: "65\"", resolution: "3840x2160", panelType: "OLED evo MLA", os: "webOS 23", refreshRate: "120 Hz", hdr: "Dolby Vision, HDR10" } },
        { title: "Samsung Neo QLED QN90C 65\"", brand: "Samsung", price: 2199, attrs: { screenSize: "65\"", resolution: "3840x2160", panelType: "Neo QLED Mini-LED", os: "Tizen", refreshRate: "120 Hz", hdr: "HDR10+" } },
        { title: "Samsung The Frame 55\" 4K", brand: "Samsung", price: 1499, attrs: { screenSize: "55\"", resolution: "3840x2160", panelType: "QLED", os: "Tizen", refreshRate: "120 Hz", hdr: "HDR10+" } },
        { title: "Sony BRAVIA XR A80L 55\" OLED", brand: "Sony", price: 1799, attrs: { screenSize: "55\"", resolution: "3840x2160", panelType: "OLED", os: "Google TV", refreshRate: "120 Hz", hdr: "Dolby Vision, HDR10" } },
        { title: "Sony BRAVIA X90L 65\"", brand: "Sony", price: 1499, attrs: { screenSize: "65\"", resolution: "3840x2160", panelType: "Full Array LED", os: "Google TV", refreshRate: "120 Hz", hdr: "Dolby Vision, HDR10" } },
        { title: "TCL C745 55\" QLED", brand: "TCL", price: 699, attrs: { screenSize: "55\"", resolution: "3840x2160", panelType: "QLED", os: "Google TV", refreshRate: "144 Hz", hdr: "Dolby Vision, HDR10+" } },
        { title: "Hisense U8K 65\" Mini-LED", brand: "Hisense", price: 1299, attrs: { screenSize: "65\"", resolution: "3840x2160", panelType: "Mini-LED ULED", os: "VIDAA", refreshRate: "144 Hz", hdr: "Dolby Vision, HDR10+" } },
        { title: "Philips OLED808 55\"", brand: "Philips", price: 1599, attrs: { screenSize: "55\"", resolution: "3840x2160", panelType: "OLED", os: "Google TV", refreshRate: "120 Hz", hdr: "Dolby Vision, HDR10+" } },
        { title: "Xiaomi TV A2 50\" 4K", brand: "Xiaomi", price: 399, attrs: { screenSize: "50\"", resolution: "3840x2160", panelType: "LED", os: "Android TV", refreshRate: "60 Hz", hdr: "Dolby Vision, HDR10" } },
        { title: "Panasonic MZ2000 55\" OLED", brand: "Panasonic", price: 2399, attrs: { screenSize: "55\"", resolution: "3840x2160", panelType: "Master OLED Ultimate", os: "My Home Screen", refreshRate: "120 Hz", hdr: "Dolby Vision, HDR10+" } },
        { title: "LG QNED80 50\" 4K", brand: "LG", price: 799, attrs: { screenSize: "50\"", resolution: "3840x2160", panelType: "QNED", os: "webOS 23", refreshRate: "60 Hz", hdr: "HDR10" } },
        { title: "Samsung Crystal UHD 43\" 4K", brand: "Samsung", price: 449, attrs: { screenSize: "43\"", resolution: "3840x2160", panelType: "Crystal UHD LED", os: "Tizen", refreshRate: "60 Hz", hdr: "HDR10+" } }
    ],

    networking: [
        { title: "TP-Link Archer AX73", brand: "TP-Link", price: 129, attrs: { type: "Wi-Fi router", wifiStandard: "Wi-Fi 6 (AX5400)", speed: "5400 Mbps", ports: "4x Gigabit LAN", coverage: "Large home" } },
        { title: "ASUS RT-AX88U Pro", brand: "ASUS", price: 299, attrs: { type: "Wi-Fi router", wifiStandard: "Wi-Fi 6 (AX6000)", speed: "6000 Mbps", ports: "8x Gigabit LAN", coverage: "Large home" } },
        { title: "Netgear Nighthawk RAX50", brand: "Netgear", price: 199, attrs: { type: "Wi-Fi router", wifiStandard: "Wi-Fi 6 (AX5400)", speed: "5400 Mbps", ports: "4x Gigabit LAN", coverage: "Medium home" } },
        { title: "Ubiquiti UniFi U6 Lite", brand: "Ubiquiti", price: 99, attrs: { type: "Access point", wifiStandard: "Wi-Fi 6 (AX1500)", speed: "1500 Mbps", ports: "1x Gigabit PoE", coverage: "Single room" } },
        { title: "MikroTik hAP ax2", brand: "MikroTik", price: 89, attrs: { type: "Wi-Fi router", wifiStandard: "Wi-Fi 6 (AX1800)", speed: "1800 Mbps", ports: "5x Gigabit", coverage: "Medium home" } },
        { title: "Keenetic Giga KN-1011", brand: "Keenetic", price: 159, attrs: { type: "Wi-Fi router", wifiStandard: "Wi-Fi 6 (AX1800)", speed: "1800 Mbps", ports: "4x Gigabit LAN", coverage: "Large home" } },
        { title: "TP-Link Deco X60 (3-pack)", brand: "TP-Link", price: 279, attrs: { type: "Mesh system", wifiStandard: "Wi-Fi 6 (AX3000)", speed: "3000 Mbps", ports: "2x Gigabit per unit", coverage: "Whole home" } },
        { title: "Google Nest Wifi Pro (2-pack)", brand: "Google", price: 299, attrs: { type: "Mesh system", wifiStandard: "Wi-Fi 6E (AXE5400)", speed: "5400 Mbps", ports: "2x Gigabit per unit", coverage: "Whole home" } },
        { title: "Synology RT6600ax", brand: "Synology", price: 299, attrs: { type: "Wi-Fi router", wifiStandard: "Wi-Fi 6 (AX6600)", speed: "6600 Mbps", ports: "1x 2.5G + 4x Gigabit", coverage: "Large home" } },
        { title: "Zyxel NWA110AX Access Point", brand: "Zyxel", price: 119, attrs: { type: "Access point", wifiStandard: "Wi-Fi 6 (AX1800)", speed: "1800 Mbps", ports: "1x Gigabit PoE", coverage: "Office room" } },
        { title: "D-Link DIR-X1860", brand: "D-Link", price: 89, attrs: { type: "Wi-Fi router", wifiStandard: "Wi-Fi 6 (AX1800)", speed: "1800 Mbps", ports: "4x Gigabit LAN", coverage: "Medium home" } },
        { title: "Huawei WiFi AX3 Pro", brand: "Huawei", price: 79, attrs: { type: "Wi-Fi router", wifiStandard: "Wi-Fi 6+ (AX3000)", speed: "3000 Mbps", ports: "3x Gigabit LAN", coverage: "Medium home" } },
        { title: "Mercusys Halo H80X (3-pack)", brand: "Mercusys", price: 169, attrs: { type: "Mesh system", wifiStandard: "Wi-Fi 6 (AX3000)", speed: "3000 Mbps", ports: "3x Gigabit per unit", coverage: "Whole home" } }
    ],

    "home-electronics": [
        { title: "Dyson V15 Detect Absolute", brand: "Dyson", price: 749, attrs: { type: "Cordless vacuum", power: "230 AW", capacity: "0.77 L", connectivity: "None", features: "Laser dust detection, LCD screen" } },
        { title: "Roborock S8 Pro Ultra", brand: "Roborock", price: 1599, attrs: { type: "Robot vacuum", power: "6000 Pa", capacity: "Auto-empty dock", connectivity: "Wi-Fi, App", features: "Self-wash mop, LiDAR" } },
        { title: "Xiaomi Robot Vacuum X20", brand: "Xiaomi", price: 499, attrs: { type: "Robot vacuum", power: "5000 Pa", capacity: "2.5 L dustbin", connectivity: "Wi-Fi, App", features: "Mopping, LiDAR navigation" } },
        { title: "Philips Airfryer XXL HD9650", brand: "Philips", price: 299, attrs: { type: "Air fryer", power: "2225 W", capacity: "7.3 L", connectivity: "None", features: "Fat removal, Keep warm" } },
        { title: "Ninja Foodi MAX Dual Zone", brand: "Ninja", price: 249, attrs: { type: "Air fryer", power: "2470 W", capacity: "9.5 L", connectivity: "None", features: "Dual zone, 6 cooking modes" } },
        { title: "De'Longhi Magnifica S", brand: "De'Longhi", price: 549, attrs: { type: "Coffee machine", power: "1450 W", capacity: "1.8 L", connectivity: "None", features: "Built-in grinder, Milk frother" } },
        { title: "Nespresso Vertuo Next", brand: "Nespresso", price: 159, attrs: { type: "Capsule coffee machine", power: "1500 W", capacity: "1.1 L", connectivity: "Bluetooth", features: "Centrifusion, 5 cup sizes" } },
        { title: "Apple HomePod mini", brand: "Apple", price: 99, attrs: { type: "Smart speaker", power: "Built-in", capacity: "N/A", connectivity: "Wi-Fi, Bluetooth", features: "Siri, Thread, HomeKit hub" } },
        { title: "Amazon Echo Dot 5th Gen", brand: "Amazon", price: 49, attrs: { type: "Smart speaker", power: "Built-in", capacity: "N/A", connectivity: "Wi-Fi, Bluetooth", features: "Alexa, Temperature sensor" } },
        { title: "Google Nest Hub 2nd Gen", brand: "Google", price: 99, attrs: { type: "Smart display", power: "Built-in", capacity: "N/A", connectivity: "Wi-Fi, Bluetooth", features: "Google Assistant, Sleep sensing" } },
        { title: "Xiaomi Smart Air Purifier 4", brand: "Xiaomi", price: 199, attrs: { type: "Air purifier", power: "38 W", capacity: "Up to 48 m²", connectivity: "Wi-Fi, App", features: "HEPA filter, PM2.5 sensor" } },
        { title: "Dyson Hot+Cool HP07", brand: "Dyson", price: 649, attrs: { type: "Air purifier fan heater", power: "2000 W", capacity: "Whole room", connectivity: "Wi-Fi, App", features: "HEPA filter, Heating & cooling" } },
        { title: "Tefal OptiGrill+ GC712", brand: "Tefal", price: 199, attrs: { type: "Electric grill", power: "2000 W", capacity: "4 portions", connectivity: "None", features: "Automatic cooking sensor" } },
        { title: "iRobot Roomba j7+", brand: "iRobot", price: 799, attrs: { type: "Robot vacuum", power: "High-efficiency", capacity: "Auto-empty dock", connectivity: "Wi-Fi, App", features: "Obstacle avoidance, Self-empty" } }
    ]
};

module.exports = { productPools };
