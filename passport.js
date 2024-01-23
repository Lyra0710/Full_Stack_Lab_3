const passport = require('passport'); 
const GoogleStrategy = require('passport-google-oauth2').Strategy;  
const LocalStrategy = require('passport-local').Strategy; //for local login
const User = require('./models/User'); 

passport.serializeUser((user , done) => { 
    done(null , user.id); 
});
// passport.deserializeUser(function(user, done) { 
//     done(null, user); 
// }); 

passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id);
      done(null, user);
  } catch (err) {
      done(err);
  }
});
  
// passport.use(new GoogleStrategy({ 
//     clientID:"634675413249-li82hg87a1pr4cjlgla3oi1os65n3cig.apps.googleusercontent.com",  
//     clientSecret:"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", 
//     callbackURL:"http://localhost:3000/auth/callback", 
//     passReqToCallback:true
//   }, 
//   function(request, accessToken, refreshToken, profile, done) { 
//     return done(null, profile); 
//   } 
// ));
passport.use(new GoogleStrategy({ 
  clientID:"634675413249-li82hg87a1pr4cjlgla3oi1os65n3cig.apps.googleusercontent.com",  
  clientSecret:"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", 
  callbackURL:"http://localhost:3000/auth/callback", 
  passReqToCallback:true
}, 
async (request, accessToken, refreshToken, profile, done) => {
  // Checking if the user already exists in your MongoDB and creating a new user when the user is a new one.
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
        user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName
        });
    }

    return done(null, user);
} catch (err) {
    return done(err);
}

  })
);

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try{
    const user = await User.findOne ({email});
    if(!user){
      return done(null, false, {message: 'Incorrect email'});
    }
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return done(null, false, { message: 'Incorrect password.' });
  }

  return done(null, user);
} catch (err) {
  return done(err);
}
}));