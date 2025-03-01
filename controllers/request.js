
const RequestModel = require("../Model/request")
const asyncHandler = require("../Middleware/async")
const DonorModel = require("../Model/donor");
const { ErrorResponse} = require("../core");

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
exports.createBloodRequest = asyncHandler(async(req,res, next)=>{
  console.log(req.user)
  const data = {
    ...req.body,
    recipientId: req.user.userid,
  };
  const createdRequest = await RequestModel.create(data);
  // Get compatible blood types for recipient
  const compatibleBloodTypes =
    bloodCompatibility[createdRequest.bloodType] || [];

  const suggestedDonors = await DonorModel.find({
    bloodType: { $in: compatibleBloodTypes },
    stateOfResidence: createdRequest.hospitalStateOfResidence,
    lastDonationDate: { $lte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }, // 3-month gap
    isCurrentlyDonating: true, // Ensure they are eligible
  })//.limit(5); // Limit to 5 suggestions

  const suggestedDonorIds = suggestedDonors.map((donor) => donor._id);

  // Update the created request with suggested donor IDs
  createdRequest.suggestedDonors = suggestedDonorIds;
  if(suggestedDonorIds.length > 0){
    createdRequest.status = "suggested"
  }
  await createdRequest.save();
  return res.status(201).json({
    message: "Request Created Successfully",
    data: createdRequest,
    success: true,
  });
})

exports.getMyBloodRequest = asyncHandler(async(req,res, next)=>{
  console.log(req.user)
  const requests = await RequestModel.find({recipientId : req.user.userid})
  return res.status(201).json({
    message: "Request retrieved Successfully",
    data: requests,
    success: true,
  });
})