const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.auth = (req,res,next) => {
   try{
    const token = req.headers.authorization.split(" ")[1]

    if(!token) return res.status(400).json({message:"Token is missing"})

    const decode = jwt.verify(token, process.env.secret_key)
    //console.log(decode)

    req.user = decode

    //console.log(req.user)

    next()
    
    //res.json(token)

   } catch(error){
    res.status(400).json({message:error})
   }
}

exports.protect = async(req,res,next) => {
   let token;

   if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"));
   try{
      token = req.headers.authorization.split(" ")[1]
      if(!token) return res.status(400).json({message:"Token is missing"})

      const decoded = jwt.verify(token, process.env.secret_key)

      req.user = await User.findById(decoded.id).select('-password')

      next()

   } catch(error){
      res.status(400).json({message:error})
   }
}

exports.admin = (req,res,next) => {
   if(req.user && req.user.isAdmin){
      next()
   } else{
      res.status(403).json({message:"Not authorized as admin"})
   }
}

