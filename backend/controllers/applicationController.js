import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import cloudinary from "cloudinary";
 
export const getApplicationCountByJobId = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const applicationCount = await Application.countDocuments({ jobId });

    res.status(200).json({
      success: true,
      applicationCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const countApplicationsByJob = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.params;

  // Validate job ID
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return next(new ErrorHandler("Invalid job ID.", 400));
  }

  // Count applications
  const applicationCount = await Application.countDocuments({ jobId });

  res.status(200).json({
    success: true,
    count: applicationCount,
  });
});
export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;

  // Validate user role
  if (role === "Employer") {
    return next(new ErrorHandler("Employer not allowed to access this resource.", 400));
  }

  // Validate file upload
  if (!req.files || !req.files.resume || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume File Required!", 400));
  }

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

  // Validate file format
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(new ErrorHandler("Invalid file type. Please upload a PNG file.", 400));
  }

  // Upload file to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath);

  // Check Cloudinary upload response
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
    return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
  }

  // Extract fields from request body
  const { name, email, coverLetter, phone, address, jobId } = req.body;

  // Validate jobId
  if (!jobId) {
    return next(new ErrorHandler("Job ID not provided.", 400));
  }

  // Fetch job details
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  // Create applicant and employer IDs
  const applicantID = {
    user: req.user._id,
    role: "Job Seeker",
  };

  const employerID = {
    user: jobDetails.postedBy,
    role: "Employer",
  };

  // Validate required fields
  if (!name || !email || !coverLetter || !phone || !address || !applicantID || !employerID || !resume) {
    return next(new ErrorHandler("Please fill all required fields.", 400));
  }

  // Create new application
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    jobId,
  });

  // Send success response
  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});


export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);
export const getApplicationsByJob = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.params;

  // Validate job ID
  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    return next(new ErrorHandler("Invalid job ID.", 400));
  }

  // Find applications
  const applications = await Application.find({ jobId }).populate("applicantID.user", "name email");

  res.status(200).json({
    success: true,
    applications,
  });
});
