// Modules
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Utils
const sendMail = require("../utils/email");

// ---------------------------------------IMPORTS---------------------------------------

// Schema for user model
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "User name is required!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "User email is required!"],
        unique: [true, "User with this email already exists!"]
    },
    password: {
        type: String,
        required: [function () { return this.provider === "local" }, "User password is required"],
        select: false
    },
    role: {
        type: String,
        enum: ["user", "admin", "seller"],
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    }
}, { timestamps: true });

// We hashing user password before saving user document
userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare user password
userSchema.methods.comparePassword = async function(candidate) {
    return await bcrypt.compare(candidate, this.password);
};

// Method to send verification link on user email
userSchema.methods.sendVerificationLink = async function() {
    const token = await jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const link = `${process.env.SERVER_URL}/api/auth/verification?token=${token}`;

    const html = `
        <h1>Verification Link</h1>
        <a href="${link}">Click here to verificate your account</a>
    `;

    sendMail(this.email, "Verification Link", html);
};

// Indexing
userSchema.index({ isVerified: 1 });

const User = mongoose.model("Users", userSchema);

module.exports = User;