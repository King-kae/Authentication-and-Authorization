const supertest = require('supertest')
const express = require('express')
const app = require('../../server')
const router = require('../../routes/books.routes')

describe('Book Route', () => {

    it('GET /books works', async () => {
        const res = await supertest(app).get('/books')
        expect(res.status).toEqual(200)
    })
    
})