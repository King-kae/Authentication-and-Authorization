const User = require('../../models/user')

const signupUser = async (req, res) => {
    const { username, email, password } = req.body
    try {
            
        const existingUser = await User.findOne({ email: email})
        if (existingUser) {
            res.status(400);
            res.send({
                message: "User already exists"
            });
        }

        const user = await User.create({ email, username, password })
        
        res.status(200);
        res.send(user);
    } catch (err) {
       console.log(err)
    }
}

module.exports = {
    signupUser
}