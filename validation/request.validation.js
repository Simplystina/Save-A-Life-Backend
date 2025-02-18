const Joi = require("joi");

exports.makeBloodRequest = {
  body: Joi.object().keys({
    recipientName: Joi.string().required(),
    bloodType: Joi.string().required(),
    location: Joi.string().required(),
    requestDate: Joi.string().required(),
    hospitalName: Joi.string().required(),
    doctorsName: Joi.string().required(),
    age: Joi.number().required(),
    reason: Joi.string(),
    lastDonationDate: Joi.string(),
  }),
};
