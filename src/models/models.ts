// import fs from 'fs/promises';
// import path from 'path';
import { db, writeToFile } from '../util';
import { staffObj, staffReqObj } from './model_interfaces';
import bcrypt from  'bcrypt';
import Joi from 'joi';

export const staffSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required() ,
    firstname: Joi.string()
        .max(50)  ,
    lastname: Joi.string()
        .max(50)  ,
    gender: Joi.string()
        .min(1)
        .max(1)
        .pattern(new RegExp('(m|f)')) ,
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'edu'] } }) ,
    phone: Joi.number() ,
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,}$')),
    confirmPassword: Joi.ref('password')
}).with('firstname','lastname')
    .with('pass','conpass')

export const loginSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required() ,
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,}$'))
})

export async function checkUnique(obj: staffReqObj): Promise<boolean | {duplicated: string}>{
    const database = await db;
    const mailDup = database.find((element: staffObj) => obj.email === element.email)
    const usernameDup = database.find((element: staffObj) => obj.username === element.username)
    
    if (mailDup) {
        return {duplicated: 'Email has already been taken. Please choose another'};
    }
    if (usernameDup) {
        return {duplicated: 'Username has already been claimed. Please choose another'};
    }
    return true;
}

export async function createStaff(obj: staffReqObj): Promise<number> {
    const { username, firstname, lastname, email, gender, phone, password } = obj;

    // Get last index in db
    const  database = await db;
    let nextId = (database[database.length - 1]?.id + 1) || 1;

    bcrypt.hash(password, 8).then(async function updateDbAfterNewStaff(hash) {
        // Store hash in your password DB.
        const newStaff: staffObj = {
            username,
            fullname: `${firstname} ${lastname}`,
            email,
            gender,
            phone,
            password: hash,
            id: nextId
        }
        await writeToFile(newStaff);
    });
    return nextId;
}