// passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Host = require('../model/profile');
require('dotenv').config();

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Google OAuth credentials not found.');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback',
    },
    async (token, tokenSecret, profile, done) => {
      try {
        console.log('Google Profiless:', profile); 

        if (!profile.emails || profile.emails.length === 0) {
          console.error('Google OAuth did not return an email:', profile); 
          return done(new Error('No email associated sswith the Google account'), null);
        }

        const email = profile.emails[0].value; 
        const profileImage = profile.photos?.[0]?.value || '/no-profile-picture.jpg';

        console.log('Extracted Email:', email);

        let host = await Host.findOne({ googleId: profile.id });

        if (!host) {
          host = new Host({
            name: profile.displayName,
            email,
            googleId: profile.id,
            profileImage,
          });
          await host.save();
        }

        return done(null, host);

      } catch (error) {
        console.error('Error during passport strategy:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Host.findById(id);
    if (!user) {
      return done(new Error('User not found'), null);
    }
    done(null, user);
  } catch (error) {
    console.error('Error deserializing user:', error);
    done(error, null);
  }
});

module.exports = passport;
