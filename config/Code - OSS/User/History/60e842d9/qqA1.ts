import dotenv from "dotenv";
dotenv.config();
console.log(process.ENV);
export { process as Config };

// Add a generic config loader
