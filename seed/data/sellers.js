// Product.universal.sellerId is a required ref to the User model, so the seed needs
// at least one seller to attach products to. These users are created with the User
// model's normal flow (so the password-hashing pre-save hook runs) and reused on
// subsequent runs. Built strictly against /server/models/user.model.js:
//   fullname (required), email (required, unique), password (required for local provider),
//   role enum ["user","admin","seller"], provider enum ["local","google"].
//
// Default seed password for every seller below: "SeedPass123!"

const sellers = [
    { fullname: "TechHub Store", email: "seed.seller.techhub@devmarket.local", password: "SeedPass123!", role: "seller", isVerified: true, provider: "local" },
    { fullname: "Gadget Galaxy", email: "seed.seller.gadgetgalaxy@devmarket.local", password: "SeedPass123!", role: "seller", isVerified: true, provider: "local" },
    { fullname: "ProGear Electronics", email: "seed.seller.progear@devmarket.local", password: "SeedPass123!", role: "seller", isVerified: true, provider: "local" },
    { fullname: "NextLevel Devices", email: "seed.seller.nextlevel@devmarket.local", password: "SeedPass123!", role: "seller", isVerified: true, provider: "local" }
];

module.exports = { sellers };
