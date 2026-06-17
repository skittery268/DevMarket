// Small, dependency-free helpers used by the seed generator.
// They build documents that strictly match the Mongoose schemas in /server/models.

const { POSITIVE, NEUTRAL, NEGATIVE } = require("./data/comments");

// Pseudo helpers -------------------------------------------------------------

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randFloat = (min, max, decimals = 1) => {
    const value = Math.random() * (max - min) + min;
    return Number(value.toFixed(decimals));
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const pickSome = (arr, count) => {
    const copy = [...arr];
    const result = [];
    while (result.length < count && copy.length) {
        result.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return result;
};

const chance = (probability) => Math.random() < probability;

// Transliterate + slugify so values are always URL-safe (used for image seeds / public_id).
const TRANSLIT = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
};

const slugify = (text) =>
    String(text)
        .toLowerCase()
        .split("")
        .map((ch) => (TRANSLIT[ch] !== undefined ? TRANSLIT[ch] : ch))
        .join("")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || "item";

// Document builders ----------------------------------------------------------

// Stable, public, high-quality placeholder images (matches the { url, public_id } sub-schema).
const buildImages = (slug, count) => {
    const images = [];
    for (let i = 1; i <= count; i++) {
        images.push({
            url: `https://picsum.photos/seed/${slug}-${i}/900/900`,
            public_id: `seed/products/${slug}-${i}`
        });
    }
    return images;
};

// Force every attribute value to a string — the app validates attributes as z.record(z.string()).
const stringifyAttrs = (attrs) => {
    const out = {};
    for (const [key, value] of Object.entries(attrs)) {
        if (value === undefined || value === null) continue;
        out[key] = String(value);
    }
    return out;
};

// Varied, non-templated descriptions assembled from rotating fragments + real specs.
const INTROS = [
    (t) => `${t} is a well-rounded choice for anyone who values quality without compromise.`,
    (t) => `Meet the ${t}: a device that feels equally at home during work and downtime.`,
    (t) => `The ${t} combines modern design with dependable hardware in a single package.`,
    (t) => `If you were looking for the right balance of price and capability, the ${t} delivers.`,
    (t) => `The ${t} is built for everyday use and noticeably simplifies familiar tasks.`,
    (t) => `We added the ${t} to the catalog because this model is genuinely worth your attention.`,
    (t) => `The ${t} stands out with clean build quality, thoughtful ergonomics and predictable results.`
];

const BODIES = [
    "The manufacturer focused on the details, and it shows in every element.",
    "It sets up quickly and fits effortlessly into your existing ecosystem.",
    "The casing feels great in the hand and is built for daily use.",
    "Internal components were chosen to leave plenty of headroom for years to come.",
    "Special attention was paid to stable performance under load.",
    "The model has already earned positive reviews for its consistent behaviour.",
    "Everything you need to get started is included in the box."
];

const CLOSERS = [
    "A great pick whether it is a gift or a treat for yourself.",
    "Go for it if reliability and a clear result matter to you.",
    "Shipping and warranty come with no surprises.",
    "Suitable for newcomers and people who know exactly what they want alike.",
    "One of the most balanced offers in this price range.",
    "Stock is limited, so we recommend not putting it off."
];

// Human-readable labels for the specs we like to surface in the text.
const SPEC_LABELS = {
    screenSize: "display size",
    screenType: "display type",
    resolution: "resolution",
    panelType: "panel",
    refreshRate: "refresh rate",
    processor: "processor",
    ram: "memory",
    storage: "storage",
    gpu: "graphics",
    battery: "battery",
    batteryLife: "battery life",
    os: "operating system",
    camera: "camera",
    connection: "connection",
    anc: "noise cancelling",
    switchType: "switches",
    sensor: "sensor",
    dpi: "sensor resolution",
    capacity: "capacity",
    power: "power",
    wifiStandard: "Wi-Fi standard",
    speed: "speed",
    waterResistance: "water resistance",
    megapixels: "sensor",
    videoResolution: "video"
};

const buildDescription = (title, attrs) => {
    const parts = [pick(INTROS)(title), pick(BODIES)];

    // Surface up to three real specs so each description is unique and informative.
    const specKeys = Object.keys(attrs).filter((k) => SPEC_LABELS[k]);
    const chosen = pickSome(specKeys, Math.min(3, specKeys.length));
    if (chosen.length) {
        const specSentence = chosen
            .map((k) => `${SPEC_LABELS[k]}: ${attrs[k]}`)
            .join(", ");
        parts.push(`Key specs — ${specSentence}.`);
    }

    parts.push(pick(CLOSERS));

    let text = parts.join(" ");
    if (text.length > 1000) text = text.slice(0, 997).trimEnd() + "...";
    return text;
};

// Common attributes shared by every category (kept in sync with allowedAttributes).
const COLORS = ["Black", "Silver", "White", "Graphite", "Blue", "Space Gray", "Green", "Beige"];
const WARRANTIES = ["12 months", "24 months", "36 months"];
const CONDITIONS = ["New", "New", "New", "Open box"];
const COUNTRIES = ["China", "Vietnam", "Taiwan", "South Korea", "Malaysia", "India"];

let skuCounter = 1000;

const buildCommonAttrs = (brand, basePrice) => {
    const discountOptions = ["0", "0", "0", "5", "10", "15", "20", "25"];
    const discount = pick(discountOptions);
    const availability = pick(["In stock", "In stock", "In stock", "Pre-order", "Low stock"]);

    const attrs = {
        brand,
        rating: randFloat(3.8, 5.0, 1),
        reviewsCount: randInt(3, 2480),
        discount,
        warranty: pick(WARRANTIES),
        color: pick(COLORS),
        condition: pick(CONDITIONS),
        availability,
        countryOfOrigin: pick(COUNTRIES),
        sku: `DM-${++skuCounter}`
    };

    // When discounted, expose the original price so the markdown is honest.
    if (discount !== "0") {
        const factor = 1 + Number(discount) / 100;
        attrs.oldPrice = Math.round((basePrice * factor) / 10) * 10;
    }

    return attrs;
};

// Assemble final Product documents from the raw pools.
const buildProductDocs = (pools, categoriesByKey, sellerIds) => {
    const docs = [];
    let index = 0;

    for (const [categoryKey, entries] of Object.entries(pools)) {
        const category = categoriesByKey[categoryKey];
        if (!category) {
            throw new Error(`No category found for key "${categoryKey}"`);
        }

        const allowed = new Set(category.allowedAttributes);

        for (const entry of entries) {
            const merged = {
                ...buildCommonAttrs(entry.brand, entry.price),
                ...entry.attrs
            };

            // Safety net: never emit an attribute key the category does not allow.
            const filtered = {};
            for (const [key, value] of Object.entries(merged)) {
                if (allowed.has(key)) filtered[key] = value;
            }
            const attributes = stringifyAttrs(filtered);

            const slug = `${slugify(entry.title)}-${index}`;

            docs.push({
                universal: {
                    title: entry.title,
                    description: buildDescription(entry.title, attributes),
                    price: entry.price,
                    stock: chance(0.12) ? randInt(1, 3) : randInt(5, 80),
                    category: category._id,
                    sellerId: sellerIds[index % sellerIds.length],
                    images: buildImages(slug, randInt(2, 3))
                },
                attributes
            });

            index++;
        }
    }

    return docs;
};

// Review helpers -------------------------------------------------------------

// A natural-looking rating distribution: mostly 4–5, some 3, few 1–2.
// (cumulative weights: 5→45%, 4→30%, 3→15%, 2→6%, 1→4%)
const weightedRating = () => {
    const r = Math.random();
    if (r < 0.45) return 5;
    if (r < 0.75) return 4;
    if (r < 0.90) return 3;
    if (r < 0.96) return 2;
    return 1;
};

// Pick the fragment pool that matches the rating's sentiment.
const poolForRating = (rating) => {
    if (rating >= 4) return POSITIVE;
    if (rating === 3) return NEUTRAL;
    return NEGATIVE;
};

// Compose a unique buyer comment for a given rating. Combines an opener, one or
// two distinct detail sentences and an optional closer — that yields thousands of
// combinations, so `used` (a Set of strings) keeps every seeded comment distinct.
const buildComment = (rating, used) => {
    const pool = poolForRating(rating);

    for (let attempt = 0; attempt < 25; attempt++) {
        const opener = pick(pool.openers);
        const details = pickSome(pool.details, chance(0.5) ? 2 : 1);
        const closer = chance(0.5) ? pick(pool.closers) : null;

        const content = [opener, ...details, closer].filter(Boolean).join(" ");

        if (!used.has(content)) {
            used.add(content);
            return content;
        }
    }

    // Extremely unlikely fallback: guarantee uniqueness with a distinct suffix.
    const unique = `${pick(pool.openers)} ${pick(pool.details)} (#${used.size + 1})`;
    used.add(unique);
    return unique;
};

module.exports = {
    randInt,
    randFloat,
    pick,
    pickSome,
    chance,
    slugify,
    buildImages,
    buildDescription,
    buildProductDocs,
    weightedRating,
    buildComment
};
