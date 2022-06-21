import express, { NextFunction, Request, Response } from "express";
import { staffSchema, checkUnique, createStaff } from '../models/models';
// import { hashPassword } from '../util';
// import Joi from 'joi';
const debug = require('debug')('week5-009:server');
import jwt from 'jsonwebtoken';
export const signUpRouter = express.Router();

/* GET signUp form page. */
signUpRouter.get('/', function(req: Request, res: Response, next: NextFunction) {
    res.render('signup');
  });

  /* GET signUp form page. */
signUpRouter.post('/', async function(req: Request, res: Response, next: NextFunction) {
    // Validate form inputs
    const { value, error } = staffSchema.validate(req.body, { presence: 'required'})
    
    // Send Validation error back to client
    if (error) {
        res.header('Refresh', '5')
       return res.render('signup', {errorMsg: `${error.message}`});
    }

    // Ensure no duplicate email
    const duplicateResult = await checkUnique(value);
    if (typeof duplicateResult !== 'boolean') {
        res.header('Refresh', '5')
        return res.render('signup', {errorMsg: `${duplicateResult.duplicated}`});
    }

    // create the user, join fullname and hash password before registering to db then return boolean 
    const id = await createStaff(value);
    let data = {
        time: Date(),
        id: id,
    }
    
    // Sign token to expire in 2mins
    const token = jwt.sign(data, `Leslie_Will_Know_How_To_Code_Someday`, { expiresIn: 120 });

    res.cookie('authorization', token)
    res.redirect(301, '../users');
  });

