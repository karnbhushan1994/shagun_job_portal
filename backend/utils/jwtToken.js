export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken(); // Assuming this method works as expected
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Set httpOnly to true for security
    secure: process.env.NODE_ENV === 'production', // Set secure flag in production
    sameSite: 'Strict' // Set SameSite attribute to Strict for CSRF protection
  };

  // Send the response with the token as a cookie
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token,
  });
};
