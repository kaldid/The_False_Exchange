
import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next) {
  
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)
    req.user = decoded; // Attach user info to request
    next(); // Proceed to next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

export default authMiddleware