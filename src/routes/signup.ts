import express from "express";
import { signupPostHandler, signupGetHandler } from "../controller/controllers";
export const signUpRouter = express.Router();

/* GET signUp form page. */
signUpRouter.get('/', signupGetHandler);

/* POST signUp form page. */
signUpRouter.post('/', signupPostHandler);

