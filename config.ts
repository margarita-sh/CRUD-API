import * as dotenv from 'dotenv';
import * as path from 'path'

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

const config = {
  PORT: process.env.APPLICATION_PORT,
};

export default config;