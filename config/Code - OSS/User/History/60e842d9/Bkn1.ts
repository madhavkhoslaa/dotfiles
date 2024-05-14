import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT,
  mongoose_string: process.env.CONNECTION_STRING,
};
export { config };
