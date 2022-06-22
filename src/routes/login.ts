import express from "express";
import { loginPostHandler, loginGetHandler } from "../controller/controllers";
export const loginRouter = express.Router();

/* GET login form page. */
loginRouter.get('/', loginGetHandler);

/* POST login form page */
loginRouter.post('/', loginPostHandler);