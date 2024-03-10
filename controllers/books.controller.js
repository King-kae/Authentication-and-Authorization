const bookModel = require('../models/book')
const jwt = require('jsonwebtoken')
require('dotenv').config()


// CRUD

// Create a new book
const addNewBook = async (req, res) => {
    const bookInfo = req.body
    await bookModel.create(bookInfo)
        .then((book) => {
            const payload = { _id: req.user._id, email: req.user.email, username: req.user.username };
            const token = jwt.sign({ user: payload }, process.env.JWT_SECRET);
            console.log(token)
            res.render('lIndex', { 
                user: req.user, 
                book, token, 
                success: `Book created successfully!` 
            });
        }).catch((err) => {
            console.log(err.message);
            res.status(500).send({
                success: false,
                message: err.message
            })
        })
}

// Read books
const getAllBooks = async (req, res) => {
    await bookModel.find()
        .then(books => {
            console.log(req.user)
            // res.status(200)
            res.render('books', { user: req.user, books, token: req.token })
        }).catch((err) => {
            res.status(500).send(err.message)
        })
}

// By id
const getBookById = async (req, res) => {
    const id = req.params.id
    await bookModel.findById(id)
    .then((book) => {
        res.status(200).send(book)
    }).catch((err) => {
        res.status(500).send(err.message)
    })
}


// Update a book
const updateBookById = async (req, res) => {
    const book = req.body
    const id = req.params.id
    await bookModel.findByIdAndUpdate(id, book, { new: true })
    .then((book) => {
        res.status(200).send({
            message: 'Book updated successfully',
            data: book
        })
    }).catch((err) => {
        res.status(500).send(err.message)
    })
}

// Delete a book
const deleteBookById = async (req, res) => {
    const id = req.params.id
    await bookModel.findByIdAndDelete(id)
    .then((book) => {
        res.status(200).send({
            message: 'Book deleted successfully'
        })
    }).catch((err) => {
        res.status(500).send(err.message)
    })
}

module.exports = {
    addNewBook,
    getAllBooks,
    getBookById,
    updateBookById,
    deleteBookById
}