const jwt = require('jsonwebtoken');

function verifyAuthentication(req, res, next) {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token or incorrect format..' })
    }

    token = token.split(' ').pop().trim();

    const jwtSecretKey = process.env.JWT_SECRET;
    const payload = jwt.verify(token, jwtSecretKey);

    req.user = payload.data;
    
    next();
  } catch(error) {
    console.error(error);
    res.status(401).json({ error: 'Token is invalid. '});
  }
}

module.exports = verifyAuthentication;