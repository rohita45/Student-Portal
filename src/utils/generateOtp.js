// src/utils/generateOtp.js
/**
 * Generates a numeric OTP of the given length (default: 6 digits).
 */
export function generateOTP(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return otp;
}
