const jwt = require("jsonwebtoken")
const httpStatus = require("http-status")
const { ErrorResponse, asyncHandler } = require("../core");

const verifyToken = (req, res, next)=>{
    const bearerHeader = req.headers["authorization"]
   

    if (typeof bearerHeader ===  'undefined') {

        return next(
          new ErrorResponse(
            "A token is required for authentication",
            403
          )
        );
      
    }
    try {
        const bearer = bearerHeader.split(' ')
        const token = bearer[1]
        
        const decoded = jwt.verify(token, process.env.JWT_TOKEN)
        console.log(decoded,"decoded")
        req.user = decoded
    } catch (error) {
        console.log(error)
        return next(
          new ErrorResponse("Invalid Token", 401)
        );
        
    }
    return next()
}

module.exports = verifyToken