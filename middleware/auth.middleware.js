require("dotenv").config();
const jwt = require("jsonwebtoken");

// verify-token domain
function verifyToken(req, res, next) {
  
  const token = req.header("x-access-token");
  
  if (!token)
    return res.status(401).send({msg : "Access Denied. Please Login again!!!"});
  try {
    //getting token secret from env file
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      algorithm: 'HS256',
    });
    
    req.user = decoded;
    
    next();
  } catch (err) {
    
    res.status(400).send({msg : "Token Expired"});
  }
};

module.exports =  verifyToken ;
