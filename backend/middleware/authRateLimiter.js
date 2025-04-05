const erl = require("express-rate-limit");

const authRateLimiter = erl({
  windowMs: 60 * 1000,
  max: 5,
  message:
    "Too many requests made from this IP. Please wait one minute and try again.",
  headers: true,
});

module.exports = authRateLimiter;
