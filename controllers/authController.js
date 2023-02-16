const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
  const { user, password } = req.body
  if (!user || !password) return res.status(400).json({ "message": "Username and password are reauired"})
  const currentUser = await User.findOne({ username: user }).exec()
  if (!currentUser) return res.sendStatus(401)
  // Compare password
  const match = await bcrypt.compare(password, currentUser.password)
  if (match) {
    const accessToken = jwt.sign(
      { "username": currentUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '20m'}
    )
    const refreshToken = jwt.sign(
      { "username": currentUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d'}
    )
    // Saving refreshToken to current user
    currentUser.refreshToken = refreshToken
    const result = await currentUser.save()
    console.log(result)
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    })
    res.json({ accessToken })
  } else {
    res.sendStatus(401)
  }
}

module.exports = { handleLogin }