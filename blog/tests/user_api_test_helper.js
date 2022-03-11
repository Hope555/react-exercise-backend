const User = require('../models/user')

const initialUsers = [
  {
    "username": "hellas",
    "name": "Arto Hellas",
    "password": "artohellas",
  },
  {
    "username": "mluukkai",
    "name": "Matti Luukkainen",
    "password": "mattiluukkainen",
  },
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialUsers,
  usersInDb
}