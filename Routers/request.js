const express = require("express")
const requestController = require("../controllers/request")
const requestValidator = require("../validation/request.validation")
const { validate } = require("../Middleware/validate");

require("dotenv").config()

const requestRouter = express.Router()

requestRouter.post("/create", validate(requestValidator.makeBloodRequest), requestController.createBloodRequest);

module.exports = requestRouter;