import dotenv from "dotenv";
dotenv.config();
console.log(process.env);
export { process as Config };

// Add a generic config loader
