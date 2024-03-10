const express = require('express')
const router = express.Router()
const { addNewBook, getAllBooks, getBookById, updateBookById, deleteBookById } = require('../controllers/books.controller')


router.get('/', getAllBooks)
router.post('/', addNewBook)
router.get('/:id', getBookById)
router.put('/:id', updateBookById)
router.delete('/:id', deleteBookById)

module.exports = router