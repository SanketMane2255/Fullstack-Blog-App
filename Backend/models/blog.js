const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {type:String, required:true},
    content:{type:String, required:true},
    //author:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    author: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true }, // Add this field to store the author's name
      },
    likes:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    comments:[
        {
            user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
            comment: {type:String, required:true}
        },
    ],
}, {timestamps: true});

module.exports = mongoose.model('Blog',blogSchema)