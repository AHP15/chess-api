import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      success: false,
      error: "No token is provided!!",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        error: err.message
      });
    }

    req.userId = decoded.id;
    next();
  });
}