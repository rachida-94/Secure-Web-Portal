require('dotenv').config();
const User = require('../models/User');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
  /*
    - done(error, false) => failure, authentication denied
    - done(null, false) => no error, but no valid user found
    - done(null, user) => success, attach user to req.user
  */
  try {
    const foundUser = await User.findById(jwt_payload.data._id);
    if (!foundUser) return done(null, false);
    return done(null, foundUser);
  } catch(error) {
    return done(error, false);
  }
}));