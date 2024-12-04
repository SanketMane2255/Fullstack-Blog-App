const Admin = require('../models/user')
const Blog = require('../models/blog')


exports.getAllUsers = async(req,res) => {
    try{
        const users = await Admin.find().select('-password')
        res.status(200).json(users)

    } catch(error){
        res.status(400).json({message:error})
    }
}

exports.getSpecificUserDetails = async(req,res) => {
    const {id} = req.params
    try{
        const user = await Admin.findById(id).select('-password')
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
      
        res.status(200).json(user)

     } catch(error){
        res.status(400).json({message:error})
    }
}

exports.updateUser = async(req,res) => {
    const {id} = req.params
    const {name,email,password} = req.body
    try{
        const user = await Admin.findByIdAndUpdate(id,{name,email,password})
        res.status(200).json({message:"User updated successfully"})

    } catch(error){
        res.status(400).json({message:error})
    }
}

exports.deleteUser = async(req,res) => {
    const {id} = req.params
    console.log(id)
    try{
          // Update blogs authored by the user
    await Blog.deleteMany(
        { 'author.userId': id },
        //{ $unset: { 'author.userId': "" } } // Remove the userId field while keeping the name
      );

        const user = await Admin.findByIdAndDelete(id)
        res.status(200).json({message:"User deleted successfully"})

    } catch(error){
        res.status(400).json({message:error})
    }
}