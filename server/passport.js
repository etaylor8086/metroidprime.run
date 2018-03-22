const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config');
const db = require('./queries');
const User = require('./models/user');

module.exports = function (passport) {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.token.secretKey;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload.data.id);
    User.getUserByParameter(jwt_payload.data.id, 'id', true, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user.enabled) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  }));
}