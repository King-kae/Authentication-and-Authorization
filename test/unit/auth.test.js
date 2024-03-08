const { signupUser } = require('../controllers/auth')
const User = require('../../models/user')

jest.mock('../../models/user')

const req = {
    body: {
        username: "fake_user",
        email: "fake_user@example.com",
        password: "fake_password"
    }
}

const res = {
    status: jest.fn((x) => x),
    send: jest.fn((x) => x)
}

it('should send a message, user already exists when user exists', async () => {
    User.findOne.mockImplementationOnce(() => ({
        id: 1,
        email: "email",
        password: "password"
    }));
    await signupUser(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledTimes(2)
});

it('should create a new user', async () => {
    // User.findOne.mockImplementationOnce(() => undefined);
    User.findOne.mockResolvedValueOnce(undefined);
    User.create.mockImplementationOnce(() => ({
        id: 1,
        username: 'fake_user',
        email: "fake_user@example.com",
        password: 'fake_password'
    }))
    await signupUser(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(User.create).toHaveBeenCalledWith({
        username: "fake_user",
        email: "fake_user@example.com",
        password: "fake_password"
    })
   
})
