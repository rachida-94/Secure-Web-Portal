const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth-controller');
const verifyAuthentication = require('../middleware/auth-middleware');
const adminOnly = require('../middleware/admin-middleware');

router.get('/', verifyAuthentication, authController.getUser);
router.get('/admin', verifyAuthentication, adminOnly, authController.getUser);
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

router.get(
  '/profile', 
  passport.authenticate('jwt', { session: false }),
  authController.getUser
);

//////////////////
// GitHub OAuth //
//////////////////
router.get('/github', passport.authenticate('github'));

router.get(
  '/github/callback', 
  passport.authenticate('github'),
  (req, res) => {
    // This function only runs if authentication succeeded
    // req.user is now populated by Passport with user data
    res.redirect('/api/auth/welcome');
  }
);

router.get('/welcome', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'You must be logged in to see this.' });
  res.send(`Welcome ${req.user.username}!!!`);
});

module.exports = router;