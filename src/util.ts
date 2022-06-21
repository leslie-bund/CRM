import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import { staffObj, lead } from './models/model_interfaces';
import { NextFunction, Request, Response } from "express";
// import bcrypt from 'bcrypt'; 
// import Joi from 'joi';
const debug = require('debug')('week5-009:server');
// import path from 'path';

export const db = (async function readDatabaseFile() {
    while(true) {
        try {
            const dbString = await fs.readFile('database.json', 'utf-8');
            return JSON.parse(dbString);
        } catch (error) {
            debug(error);
            await fs.writeFile('database.json', JSON.stringify([]), 'utf8');
        }
    }
})()

export async function writeToFile(obj: staffObj) {
    const database = await db;
    database.push(obj);
    await fs.writeFile('database.json', JSON.stringify(database), 'utf8');
    return;
}

export async function isValidUser(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.authorization
    
    let payload: any
    try {
      payload = jwt.verify(token, `Leslie_Will_Know_How_To_Code_Someday`);
      
      // Confirm that payload exists
      const database = await db;
      const exists = database.some((element: staffObj | lead) => element.id === payload.id)

      if (exists) {
        next();
      } else {
        res.status(400);
        return res.render('error', { message: 'Not authorized to access this page', error: {status: '', stack: ''} });
      }
    } catch (e: any) {
        // Plan for errors
        let message = [];
        if (e.name === 'JsonWebTokenError') message.push('Kindly login with your correct credentials')
        if (e.name === 'TokenExpiredError') message.push('Your session has timed out, Login again')
        
        return res.render('login', {error: message.pop()});
    }
}
