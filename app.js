const express = require("express")
const cors = require("cors")
const auth = require("./Middleware/auth")
const bodyParser = require("body-parser")
const { errorHandler } = require("./core");

require("dotenv").config()

//import Routers
const authRouter = require("./Routers/auth")
const userRouter = require("./Routers/user")
const requestRouter = require("./Routers/request");
const rateLimiterUsingThirdParty  = require('./Middleware/rateLimit')


const PORT = process.env.PORT 

const app = express()



app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())


app.options('*', cors()); // preflight OPTIONS; put before other routes
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT,PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//app.use(rateLimiterUsingThirdParty); //rate limiting
app.use('/auth', authRouter)
app.use('/user', auth, userRouter)
app.use('/request', auth, requestRouter)
app.use(errorHandler);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    status: 'Resource Not Found',
    error: '404 Content Do Not Exist Or Has Been Deleted'
  });
});




module.exports = app