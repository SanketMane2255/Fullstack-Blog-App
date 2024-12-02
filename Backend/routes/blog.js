const express = require('express')
const { getAllBlog, create, getSPECIFICBlog,addCommnet, likeBlog, deleteBlog,deleteBlogByAdmin, updateBlogByAdmin, updateBlog } = require('../controllers/blogController')
const { auth, protect, admin } = require('../middleware/auth')

const router = express.Router()

router.get('/getAllBlogs', getAllBlog)
router.get('/getSpecificBlog/:id',auth,getSPECIFICBlog)
router.post('/create',auth, create)
router.post('/:blogId/comment',auth, addCommnet)
router.post('/:blogId/like',auth, likeBlog)
router.put('/:blogId/update',auth, updateBlog)
router.delete('/:blogId/delete',auth, deleteBlog)



router.put('/updateBlog/:id',protect,admin, updateBlogByAdmin)
router.delete('/deleteBlog/:id',protect,admin, deleteBlogByAdmin)



module.exports = router