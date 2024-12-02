const User = require('../models/user')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



exports.register = async(req,res) => {
    const {name,email,password,isAdmin} = req.body
    try{
        const hashPassword = await bcrypt.hash(password,10)
        const user = await User.create({name,email,password:hashPassword,isAdmin})
        res.status(200).json({message:"Registration Successful"})

    } catch(error){
        res.status(400).json({message:error})
    }
}



exports.login = async(req,res) => {
    const {email,password} = req.body
    try{
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message:"User not found"})

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(400).json({message:"Invalid Password"})

        const token = jwt.sign({id:user._id,name: user.name},process.env.secret_key,{expiresIn:"30d"})
            
        res.status(201).json({message:"Login Successful",token,name:user.name,isAdmin:user.isAdmin})

    } catch(error){
        res.status(400).json({message:error})
    }
}

// exports.profile = async(req,res) => {
//    // console.log(req.user,"User controller hai")
//     try{
//         const userId = req.user.id
//         const user = await User.findById(req.user.id).select('-password');
//        // console.log(user)
//        const blogs = await Blog.find({author:userId})
//         if (!user) return res.status(404).json({ error: 'User not found' });
//         console.log(blogs)
    
//         res.status(200).json({ 
//             user ,
//             blogCount:blogs.length,
//             blogs
//         });

//     } catch(error){
//         res.status(400).json({message:error})
//     }
// }

exports.profile = async (req, res) => { 
    try {
        const userId = req.user.id; // Extracted from the token
        const user = await User.findById(userId).select('-password'); // Fetch user details excluding password

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch blogs where `author.userId` matches the logged-in user's ID
        const blogs = await Blog.find({ "author.userId": userId });

        res.status(200).json({ 
            user,
            blogCount: blogs.length,
            blogs
        });
    } catch (error) {
        console.error("Error in profile route:", error.message);
        res.status(400).json({ message: error.message });
    }
};
