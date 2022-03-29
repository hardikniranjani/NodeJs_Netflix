function checkRole(req,res,next){
      
      if(req.user.role.toString() == 'admin') return next();
      res.status(401).send({ msg: "You are not authorized!!!" });
}

module.exports = checkRole;