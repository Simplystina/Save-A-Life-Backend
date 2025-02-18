const express = require("express")
const authController = require("../controllers/auth")
const { validate } = require("../Middleware/validate");
const userValidation = require("../validation/user.validation")

require("dotenv").config()

const authRouter = express.Router()


authRouter.post("/signup", validate(userValidation.signup), authController.register)
authRouter.post('/login', validate(userValidation.login), authController.login)
authRouter.post('/resend-link', authController.resendVerification)
authRouter.get('/verify', validate(userValidation.verify), authController.verify)

module.exports = authRouter