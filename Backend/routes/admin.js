const express = require('express')
const { getAllUsers, getSpecificUserDetails, updateUser, deleteUser } = require('../controllers/adminController')
const { protect, admin } = require('../middleware/auth')

const router = express.Router()

router.get('/getAllUsers',protect,admin, getAllUsers)
router.get('/getSpecificUser/:id',protect,admin, getSpecificUserDetails)
router.put('/updateUser/:id',protect,admin, updateUser)
router.delete ('/deleteUser/:id',protect,admin, deleteUser)







module.exports = router