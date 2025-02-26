const mongoose = require("mongoose")

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const Donor = new mongoose.Schema(
  {
    id: ObjectId,
    userId: { type: ObjectId, ref: "users" },
    lastDonationDate: { type: Date },
    bloodType: { type: String },
    donationPoints: { type: Number, default: 0 },
    stateOfResidence: { type: String, required: true },
    isCurrentlyDonating: { type: Boolean, default: true },
    numberOfTimesDonated: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);


const DonorModel = mongoose.model("donor", Donor);

module.exports = DonorModel;