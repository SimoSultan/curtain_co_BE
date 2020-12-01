const User = require('../models/user');
const passport = require('passport');

// TODO: validations and checks for existing users

function isUniqueEmail({ body }) {
  const email = body.email;
  return User.findOne({ email: email });
}

async function register(req, res) {
  if (!await isUniqueEmail(req)) {
    try {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: "Invalid Fields" });
    }
  }
  res.status(400).json({ message: "Existing Email" });
}

const authenticate = passport.authenticate('local', { failureFlash: true });

function login(req, res) {
  authenticate(req, res, () => {
    console.log('authenticated', req.user.email);
    console.log('session object:', req.session);
    console.log('req.user:', req.user);
    res.status(200);
    res.json({ user: req.user, sessionID: req.sessionID });
  });
}

function logout(req, res) {
  req.logout();
  console.log('logged out user');
  console.log('session object:', req.session);
  console.log('req.user:', req.user);
  res.sendStatus(204);
}

module.exports = {
  register,
  login,
  logout
};