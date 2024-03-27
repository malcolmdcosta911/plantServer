const axios = require("axios");
module.exports = function (phone, otp) {
  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&route=otp&variables_values=${otp}&flash=0&numbers=${phone}`;
  return axios.get(url);
};
