const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true,'content未填寫']
    },
    image: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        required: [true, 'name未填寫']
    },
    likes: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
})

module.exports = postSchema
