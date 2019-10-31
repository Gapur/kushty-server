const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');

const Users = require('./models/users');
const config = require('./config.js');

passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

exports.getToken = (user) => jwt.sign(user, config.secretKey, { expiresIn: 3600 });

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
  (jwt_payload, done) => {
    console.log('JWT payload: ', jwt_payload);
    Users.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      }

      return done(null, false);
    });
  }));

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    return next();
  }
  const err = new Error('You are not authorized to perform this operation!');
  err.status = 403;
  return next(err);
};
