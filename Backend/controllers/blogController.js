const Blog = require('../models/blog')


exports.getAllBlog = async(req,res) => {
    try{
        const blog = await Blog.find().populate('author','name-_id').populate('comments.user', 'name');
        //console.log(blog)
        res.status(200).json({blog})

    } catch(error){
        res.status(400).json({message:error})
    }
}

exports.getSPECIFICBlog = async(req,res) =>{
    const {id} = req.params
    try{
        const blog = await Blog.findById(id).populate('author','name-_id')
        res.status(200).json(blog)
    } catch(error){
        res.status(400).json({message:error})
    }
}

exports.create = async(req,res) => {
    //console.log(req.user)
    const {title, content} = req.body
    //const userId = req.user.id; // Extracted from token
    //const userName = req.user.name; // Extracted from token
    //console.log(req.user.id)
    //console.log(req.user.name)
    try{
        const blog = await Blog.create({
            title,
            content,
            author:{
                userId:req.user.id,
                name:req.user.name
            }
        })
        //console.log(blog)
        await blog.save()
        res.status(200).json({message:"Blog has been created successfully"})

    } catch(error){
        res.status(400).json({message:error})
    }
}

exports.addCommnet = async(req,res) => {
    
    // const userId = req.user.id :- Instead of it you can put directly put req.user.id in push method
    //     console.log(userId)
        const {blogId} = req.params
        const {comment} = req.body
    try{
        const blog = await Blog.findById(blogId)
        //console.log(blog)
        if(!blog) return res.status(400).json({message:"Blog not found"})

        blog.comments.push({user:req.user.id,comment})

        await blog.save()

         const updatedBlog = await Blog.findById(blogId).populate({
            path: 'comments.user', // Path to populate
            select: 'name-_id', // Select only the 'name' field of the user
          });

        res.status(200).json({message:"Comment added successfully",blog:updatedBlog})
        
 } catch(error){
        res.status(400).json({message:error})
    }
}

exports.likeBlog = async(req,res) => {
    const {blogId} = req.params

    try{
        const blog = await Blog.findById(blogId)
        if(!blog) return res.status(400).json({message:"Blog not found"})

        if(blog.likes.includes(req.user.id)){
            blog.likes = blog.likes.filter((id) => id.toString() !== req.user.id)
        } else{
            blog.likes.push(req.user.id)
        }

        await blog.save()

        res.status(200).json({message:"Blog likes updated successfully",blog})

    } catch(error){
        res.status(400).json({message:error})
    }
}

exports.updateBlog = async(req,res) => {
    const {blogId} = req.params
    const {title,content} = req.body

    try{
        const blog = await Blog.findByIdAndUpdate(blogId,{title,content})
        res.status(200).json({message:"Blog updated successfully",blog})

    } catch(error){
        res.status(400).json({message:error})
    }
}


exports.deleteBlog = async(req,res) => {
    console.log(req.user.id)
    const {blogId} = req.params

    try{
        const blog = await Blog.findById(blogId)
        if(!blog){
            return res.status(404).json({message:"Blog not found"})
        }

        //console.log(blog.author)

        if(blog.author.userId.toString() !== req.user.id){
            return res.status(403).json({message:"You are not authorised person to delete the blog"})
        }

        await Blog.findByIdAndDelete(blogId);
        res.status(200).json({message:"Blog deleted Successfully"})

    } catch(error){
        res.status(400).json({message:error})
    }
}






// ************ Update and Delete  by Admin **********************

exports.updateBlogByAdmin = async(req,res) => {
    const {id} = req.params
    const {title,content} = req.body

    try{
        const blog = await Blog.findByIdAndUpdate(id,{title,content})
        res.status(200).json({message:"Blog updated successfully"})

    } catch(error){
        res.status(400).json({message:error})
    }
}


exports.deleteBlogByAdmin = async(req,res) => {
    const {id} = req.params
    try{
        const blog = await Blog.findByIdAndDelete(id)
        res.status(200).json({message:"Blog deleted successfully"})

    } catch(error){
        res.status(400).json({message:error})
    }
}



























































 


// exports.createComment = async (req, res) => {
//     const { id } = req.params; // Blog ID from URL
//     const { comment } = req.body; // Comment text from the request body
  
//     try {
//       // Ensure that comment text is provided
//       if (!comment) {
//         return res.status(400).json({ message: "Comment text is required" });
//       }
  
//       // Find the blog post by its ID
//       const blog = await Blog.findById(id);
//       if (!blog) {
//         return res.status(404).json({ message: "Blog not found" });
//       }
  
//       // Get the logged-in user's ID (assuming you have user data in req.user)
//       const userId = req.user.userId;
  
//       // Create the comment object
//       const newComment = {
//         user: userId,
//         comment,
//       };
  
//       // Add the new comment to the blog's comments array
//       blog.comments.push(newComment);
  
//       // Save the updated blog with the new comment
//       await blog.save();
  
//       // Optionally, populate the author's username in the comment for a richer response
//       const updatedBlog = await Blog.findById(id)
//         .populate('comments.user', 'name')  // Populate the user who commented
//         .populate('author', 'name'); // Populate the author field
  
//       res.status(201).json({
//         message: "Comment added successfully",
//         blog: updatedBlog, // Return the updated blog with the new comment
//       });
//     } catch (error) {
//       console.error("Error adding comment:", error);
//       res.status(500).json({ message: "Error adding comment", error: error.message });
//     }
//   };