const bookModel = require('../models/book')


// CRUD

// Create a new book
const addNewBook = async (req, res) => {
    const bookInfo = req.body
    await bookModel.create(bookInfo)
        .then((book) => {
            res.status(200).send({
                success: true,
                message: "Book created successfully",
                data: book
            })
        }).catch((err) => {
            res.status(500).send({
                success: false,
                message: err.message
            })
        })
}

// Read books
const getAllBooks = async (req, res) => {
    await bookModel.find()
        .then((books) => {
            console.log(req.user)
            res.status(200)
            res.render('books', { user: req.user, books})
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