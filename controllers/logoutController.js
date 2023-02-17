const User = require('../model/User')

// Can't delete access token from there, DONT FORGET WHEN STARTING build frontend
const handleLogout = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204) // No content
  const refreshToken = cookies.jwt

  // Check database for refresh token
  const foundUser = await User.findOne({refreshToken}).exec()
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true , maxAge: 24 * 60 * 60 * 1000 })
    return res.sendStatus(204) // No content 
  }
  
  // Delete refreshToken in db
  foundUser.refreshToken = ''
  const result = await foundUser.save()
  console.log(result)

  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'None',
    secure: true
  })
  res.sendStatus(204)
}
  
  module.exports = { handleLogout }