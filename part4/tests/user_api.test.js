const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')


beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('helloworld', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
})

test('create a new user', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: 'mikec123',
        name: 'Mike Chang',
        password: 'mc123123'
    }

    await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
})


describe('invalid users', () => {
    test('username too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'gi',
            name: 'gigi chang',
            password: 'gigi1234567'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('shorter than the minimum allowed length')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).not.toContain(newUser.username)
    })

    test('password too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'gigigi',
            name: 'gigi chang',
            password: 'gi'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('must be > 3 characters')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).not.toContain(newUser.username)
    })

    test('username already existed', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'abcd root',
            password: 'root123456'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    }, 10000)
})


afterAll(() => {
    mongoose.connection.close()
})