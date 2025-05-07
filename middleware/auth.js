const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
 
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  console.log(token, process.env.JWT_SECRET);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  console.log("I got to the middleware!");
  console.log(err, user);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function isCreator(req, res, next) {
  if (req.user.role !== 'creator') return res.sendStatus(403);
  next();
}

function isConsumer(req, res, next) {
  console.log("which err");
  if (req.user.role !== 'consumer') return res.sendStatus(403);
  next();
}

module.exports = { authenticateToken, isCreator, isConsumer };
