const express = require("express")
const requestController = require("../controllers/request")

require("dotenv").config()

const requestRouter = express.Router()

requestRouter.post("/create", requestController.createBloodRequest);

module.exports = requestRouter;