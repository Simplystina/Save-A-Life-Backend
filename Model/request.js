const mongoose = require("mongoose")

const Schema = mongoose.Schema
const Types = mongoose.Types
const ObjectId = Schema.ObjectId

const Request = new mongoose.Schema(
  {
    id: ObjectId,
    recipientId: { type: Types.ObjectId, required: true, ref: "users" },
    points: { type: String, required: true },
    bloodType: { type: String },
    location: { type: String },
    status :  { type: String },
    requestDate : { type: Date },
    recipientName : {type :String},
    hospitalName : {type :String},
    doctorsName: {type: String},
    age : {type : Number},
    reason : {type : String},
    suggestedDonors : [{type: ObjectId, ref: 'donor'}]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);


const RequestModel = mongoose.model("request", Request);

module.exports = RequestModel;