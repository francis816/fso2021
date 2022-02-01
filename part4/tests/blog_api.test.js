const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    for (let blog of helper.initialBlogs) {
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
})


test('blogs are returned as json', async () => {
    await api
        .get(`/api/blogs`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})


test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('identifier in id property rather than _id property', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        url: 'https://www.ynharari.com/book/sapiens-2/.',
        likes: 123
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const title = blogsAtEnd.map(b => b.title)
    expect(title).toContain('Sapiens: A Brief History of Humankind')
})

test('default likes to zero if a blogs didnt define likes', async () => {
    const newBlog = {
        title: 'Homo Deus: A Brief History of Tomorrow',
        author: 'Yuval Noah Harari',
        url: 'https://www.ynharari.com/book/homo-deus/'
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
})

test('return 400 if title is empty', async () => {
    const newBlog = {
        author: 'Yuval Noah Harari',
        url: 'https://www.ynharari.com',
        likes: 111
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('return 400 if url is empty', async () => {
    const newBlog = {
        title: '21 Lessons for the 21st Century',
        author: 'Yuval Noah Harari',
        likes: 222
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

afterAll(() => {
    mongoose.connection.close()
})