import dotenv from "dotenv";

dotenv.config();

const ENV = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    
}

export default ENV;
