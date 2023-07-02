import * as dotenv from 'dotenv';
import { Server } from './server';

dotenv.config();

new Server().server.listen(process.env.PORT);