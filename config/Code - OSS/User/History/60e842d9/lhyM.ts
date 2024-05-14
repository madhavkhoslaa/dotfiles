import dotenv from "dotenv";
dotenv.config();
console.log(process.env);

const config = {
  port: process.env.PORT,
};
export { config };

// Add a generic config loader
