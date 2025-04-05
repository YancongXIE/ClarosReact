// index.js (for AWS Lambda)
const serverlessExpress = require("@vendia/serverless-express");
const app = require("app");

exports.handler = serverlessExpress({ app });
