const mongoose = require("mongoose")

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const Recipient = new mongoose.Schema(
  {
    id: ObjectId,
    userId: { type: String, required: true },
    points: { type: String, required: true },
    lastDonationDate: {type: Date},
   
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);


const RecipientModel = mongoose.model("recipient", Recipient);

module.exports = RecipientModel;