
const RequestModel = require("../Model/request")
const asyncHandler = require("../Middleware/async")
const RequestModel = require("../Model/request");
const DonorModel = require("../Model/donor");

const bloodCompatibility = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // Universal recipient
  "AB-": ["A-", "B-", "AB-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"], // Universal donor
};
exports.createBloodRequest = asyncHandler(async(req,rest, next)=>{
  const data = {
    ...req.body,
    recipientId: req.user.id,
  };
  const createdRequest = await RequestModel.create(data);
  // Get compatible blood types for recipient
  const compatibleBloodTypes =
    bloodCompatibility[createdRequest.bloodType] || [];

  const suggestedDonors = await DonorModel.find({
    bloodType: { $in: compatibleBloodTypes },
    location: createdRequest.location,
    lastDonationDate: { $lte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }, // 3-month gap
    isCurrentlyDonating: true, // Ensure they are eligible
  })//.limit(5); // Limit to 5 suggestions
  
})
