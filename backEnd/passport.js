const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/Users');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let existingUser = await User.findOne({ where: { googleId: profile.id } });
        
        if (existingUser) {
            return done(null, existingUser);
        }

        // If not, create a new user
        const newUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
        });

        done(null, newUser);
    } catch (error) {
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findByPk(id).then(user => {
        done(null, user);
    });
});