import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for the company."], // Custom error message
  },
  description: {
    type: String,
    required: [true, "Please provide a description for the company."], // Custom error message
  },
  url: {
    type: String,
    required: [true, "Please provide a URL for the company."], // Custom error message
  },
  country: {
    type: String,
    required: [true, "Please provide a country for the company."], // Custom error message
  },
  city: {
    type: String,
    required: [true, "Please provide a city for the company."], // Custom error message
  },
  location: {
    type: String,
    required: [true, "Please provide a location for the company."], // Custom error message
  },
  // logo: {
  //   type: String,
  //   required: [true, "Please provide a logo for the company."], // Custom error message
  // },
  email: {
    type: String,
    required: [true, "Please provide an email for the company."], // Custom error message
  },
  tag: {
    type: String,
    required: [true, "Please provide a tag for the company."], // Custom error message
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Please provide the user ID."], // Custom error message
  },
  count: {
    type: Number,
    default: 0,
  }
});

export const Company = mongoose.model("Company", companySchema);
