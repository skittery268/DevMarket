// Modules
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Models
const User = require("../models/user.model");

// ---------------------------------------IMPORTS---------------------------------------

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            callbackURL: "/api/v1/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    user = await User.findOne({ email: profile.emails[0].value });

                    if (!user) {
                        user = await User.create({
                            googleId: profile.id,
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            isVerified: true,
                            provider: "google"
                        });
                    } else {
                        user.googleId = profile.id;
                        user.provider = "google";
                        await user.save();
                    }
                }

                done(null, user);
            } catch (error) {
                done(error );
            }
        }
    )
)