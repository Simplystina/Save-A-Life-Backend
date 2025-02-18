/**
 * Get token from model, create cookie and send response
 * @param { Object} user The Mongoose Object
 * @param { Number } statusCode The Status Key `[201, 200, 203]`
 * @param { Function } res The Response Function
 */
const sendTokenResponse = async (user, statusCode, res, code, league_name) => {
  // Create token
  const token = Array.isArray(user)
    ? user[0].getSignedJwtToken()
    : user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.MODE === 'production') {
    options.secure = true;
  }

  let data = Array.isArray(user) ? user[0].toObject() : user.toObject();
  if (code) {
    res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: Array.isArray(data)
        ? {
            ...data[0],
            Token: undefined,
            TokenExpire: undefined,
            password: undefined
          }
        : {
            ...data,
            Token: undefined,
            TokenExpire: undefined,
            password: undefined
        },
     invitationCode: `User has been added successfully to the League ${league_name}` 
    });
  } else {
    res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: Array.isArray(data)
        ? {
            ...data[0],
            Token: undefined,
            TokenExpire: undefined,
            password: undefined
          }
        : {
            ...data,
            Token: undefined,
            TokenExpire: undefined,
            password: undefined
        },
    });
  }
  
};

module.exports = sendTokenResponse;
