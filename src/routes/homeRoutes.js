// authMiddleware.js
const express = require('express')
const homeRouter = express.Router()
const auth = require('../middlewares/auth/authMiddleware')

homeRouter.get('/',auth, (req, res) => {
    return res.status(200).json({ message: "Wohooo! You are succesfully logged in" })
})

module.exports = homeRouter