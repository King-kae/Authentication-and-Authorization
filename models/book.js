const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookModel = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    isbn: {
        type: String,
        required: true
    }
},
    { timeStamp: true }
)

module.exports = mongoose.model('books', bookModel)