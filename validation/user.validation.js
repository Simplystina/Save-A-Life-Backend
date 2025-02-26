const Joi = require("joi");

exports.signup = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    bloodType: Joi.string().uppercase().required(),
    stateOfResidence: Joi.string().required().lowercase(),
    currentAddress: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    lastDonationDate: Joi.string(),
  }),
};

exports.login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

exports.verify = {
  query: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
  }),
};
