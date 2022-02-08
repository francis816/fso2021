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
