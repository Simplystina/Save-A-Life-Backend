const mongoose = require("mongoose");
const { Schema } = mongoose;

const RequestSchema = new Schema(
  {
    recipientId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    bloodType: { type: String, required: true },
    isRequestForSelf: { type: Boolean, default: false },
    status: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "suggested",
        "accepted",
        "cancelled",
        "completed",
      ],
    },
    recipientName: { type: String, required: true },
    hospitalName: { type: String, required: true },
    hospitalLocation: { type: String, required: true },
    hospitalStateOfResidence: { type: String, required: true },
    doctorsName: { type: String, required: true },
    age: { type: Number, required: true },
    reason: { type: String, required: true },
    acceptedDonorId: { type: Schema.Types.ObjectId, ref: "Donor" },
    suggestedDonors: [{ type: Schema.Types.ObjectId, ref: "Donor" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

const RequestModel = mongoose.model("Request", RequestSchema);

module.exports = RequestModel;
