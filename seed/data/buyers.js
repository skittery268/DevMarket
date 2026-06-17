// Buyer (regular "user") accounts used as review authors.
// The base seed only creates seller users, which is not enough to give each
// product 3–10 reviews from DIFFERENT people, so this pool guarantees variety.
//
// Built strictly against /server/models/user.model.js:
//   fullname (required), email (required, unique), password (required for local
//   provider), role enum ["user","admin","seller"], provider enum ["local","google"].
//
// Created via the User model's normal .save() flow so the password-hashing
// pre-save hook runs. Default seed password for every buyer: "SeedPass123!".
// Emails are namespaced (seed.buyer.*@devmarket.local) so they are easy to
// recognise and are found-or-created idempotently on every run.

const NAMES = [
    "Alex Carter", "Maria Gomez", "James Wilson", "Emily Chen", "Daniel Park",
    "Olivia Brown", "Liam Murphy", "Sophia Rossi", "Noah Schmidt", "Ava Johnson",
    "Lucas Müller", "Mia Andersson", "Ethan Walker", "Isabella Ferrari", "Mason Lee",
    "Charlotte Davis", "Logan Martin", "Amelia Nowak", "Benjamin Clark", "Harper Singh",
    "Henry Kovac", "Ella Petrova", "Jack Thompson", "Grace Kim", "Samuel Costa",
    "Chloe Dubois", "David Novak", "Zoe Adams", "Matthew Reyes", "Lily Tanaka",
    "Ryan O'Neill", "Hannah Berg", "Nathan Cruz", "Victoria Lopez", "Adam Kowalski",
    "Nora Haddad", "Oscar Lindqvist", "Layla Hassan", "Felix Bauer", "Aria Nguyen"
];

// Reuse the seller's transliterate-free slug rules inline (kept tiny on purpose).
const emailSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/(^\.|\.$)/g, "");

const buyers = NAMES.map((fullname) => ({
    fullname,
    email: `seed.buyer.${emailSlug(fullname)}@devmarket.local`,
    password: "SeedPass123!",
    role: "user",
    isVerified: true,
    provider: "local"
}));

module.exports = { buyers };
