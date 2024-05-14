import dotenv from "dotenv";
dotenv.config();
console.log(PROCESS.ENV);
export { process as Config };

// Add a generic config loader
