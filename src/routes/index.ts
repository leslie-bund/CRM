import express, { Request, Response } from 'express';
import { landingPageHandler } from '../controller/controllers';
export const indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', landingPageHandler);
