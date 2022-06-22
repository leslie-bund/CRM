import { NextFunction, Request, Response } from "express";
import { staffSchema, loginSchema, checkUnique, createStaff, leadSchema, createLead } from '../models/models';
import { staffObj, lead } from "../models/model_interfaces";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db, writeToFile } from '../util';
const debug = require('debug')('week5-009:server');


export function signupGetHandler(req: Request, res: Response, next: NextFunction) {
    return res.render('signup');
  }

export async function addNewLead(req: Request, res: Response) {
    // Validate form inputs
    const { value, error } = leadSchema.validate(req.body)    
    // Send Validation error back to client
    if (error) {
        res.header('Refresh', '4')
        return res.render('add', {errorMsg: `${error.message}`});
    }
    // Ensure no duplicate email
    const duplicateResult = await checkUnique(value);
    if (typeof duplicateResult !== 'boolean') {
        res.header('Refresh', '4')
        return res.render('add', {errorMsg: `${duplicateResult.duplicated}`});
    }

    await createLead(value);
    return res.render('add', {errorMsg: `Successfully added ${value.firstname} ${value.lastname}`, flag: `success`});
}

export async function signupPostHandler(req: Request, res: Response, next: NextFunction) {
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
    const token = jwt.sign(data, `Leslie_Will_Know_How_To_Code_Someday`, { expiresIn: 600 });
    res.cookie('authorization', token)
    res.redirect(301, '../users');
}

export function loginGetHandler(req: Request, res: Response, next: NextFunction) {
    return res.render('login');
}

export async function loginPostHandler(req: Request, res: Response, next: NextFunction) {

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
            
            const token = jwt.sign(data, `Leslie_Will_Know_How_To_Code_Someday`, { expiresIn: 180 });

            res.cookie('authorization', token);
            return res.redirect(301,'../users');
        } else {
            res.header('Refresh', '5')
            return res.render('login', {error: `Wrong Password`});
        }
    });
}

export async function getAllUsers(req: Request, res: Response) {
    // Read all users from db and filter only customers
    const database = await db;
    const customers = database.filter((lead: staffObj | lead) => !lead.hasOwnProperty('password'))

    return res.render('users', {data: customers})
}

export async function removeClient(id: number) {
    const database = await db;
    const client = database.find((record: staffObj | lead) => record.id === id);
    database.splice(database.indexOf(client), 1)
    await writeToFile(null, database);
    return;
}