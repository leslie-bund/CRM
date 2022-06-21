import express, { NextFunction, Request, Response } from "express";
import { db } from '../util';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { staffObj, lead } from "../models/model_interfaces";
import { loginSchema } from "../models/models";
export const loginRouter = express.Router();

/* GET login form page. */
loginRouter.get('/', function(req: Request, res: Response, next: NextFunction) {
    return res.render('login');
  });

/* POST login form page */
loginRouter.post('/', async function(req: Request, res: Response, next: NextFunction) {

    // Validate form inputs
    const { value, error } = loginSchema.validate(req.body, { presence: 'required'})
    
    // Send Validation error back to client
    if (error) {
        res.header('Refresh', '5')
        return res.render('login', {error: `${error.message}`});
    }

    // Ensure username exists
    const database = await db;
    const staff = database
        .filter((element: staffObj) => element.password !== undefined)
        .find((element: staffObj) => element.username === value.username);
    
    // Send db username validation error back to client
    if (!staff) {
        res.header('Refresh', '5')
        return res.render('login', {error: `Username ${value.username} does not exist`});
    }

    // Validate password
    bcrypt.compare(value.password, staff.password).then(function(result) {
        if (result) {
            // Sign new authorization token and send to header
            const data = {
                time: Date(),
                id: staff.id,
            }
          
            const token = jwt.sign(data, `Leslie_Will_Know_How_To_Code_Someday`);
        
            res.header('Authorization', token);
            return res.redirect(301, '../users');
        } else {
            res.header('Refresh', '5')
            return res.render('login', {error: `Wrong Password`});
        }
    });

  });