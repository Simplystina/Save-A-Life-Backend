const Joi = require("joi");

exports.makeBloodRequest = {
  body: Joi.object().keys({
    recipientName: Joi.string(),
    bloodType: Joi.string(),
    location: Joi.string().required(),
    hospitalName: Joi.string().required(),
    hospitalStateOfResidence: Joi.string().lowercase().required(),
    doctorsName: Joi.string().required(),
    age: Joi.number().required(),
    reason: Joi.string(),
    lastDonationDate: Joi.string(),
    isRequestForSelf: Joi.boolean(),
  }),
};
