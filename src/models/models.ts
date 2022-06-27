// import fs from 'fs/promises';
// import path from 'path';
import { db, writeToFile } from '../util';
import { staffObj, staffReqObj, lead, leadReqObj } from './model_interfaces';
import bcrypt from  'bcrypt';
import Joi from 'joi';

export const leadSchema = Joi.object({
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
    address: Joi.string().max(250),
    notes: Joi.string().max(500)
}).with('firstname', 'lastname')
    .or('address', 'notes')

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

export async function checkUnique(obj: staffReqObj | Partial<lead>): Promise<boolean | {duplicated: string}>{
    const database = await db;
    const mailDup = database.find((element: staffObj | lead) => obj.email === element.email)
    if (obj.hasOwnProperty('username')) {
        const usernameDup = database.find((element: Exclude<staffObj | lead, lead>) => obj.username === element.username);
        if (usernameDup) {
            return {duplicated: 'Username has already been claimed. Please choose another'};
        }
    }
    if (mailDup) {
        return {duplicated: 'Email has already been taken. Please choose another'};
    }
    return true;
}

export async function createStaff(obj: staffReqObj): Promise<void> {
    const { username, firstname, lastname, email, gender, phone, password } = obj;


    const hash = bcrypt.hashSync(password, 8);
    // .then(async function updateDbAfterNewStaff(hash) {
    //     // Store hash in your password DB.
    // });
    const newStaff: staffObj = {
        username,
        fullname: `${firstname} ${lastname}`,
        email,
        gender,
        phone,
        password: hash,
    }
    const newId = await writeToFile(newStaff, null);
    return newId;
}

export async function createLead(obj: leadReqObj) {
    // Destructure value for storage in db
    const { firstname, lastname, email, gender, phone, notes, address } = obj;

    const lead: lead = {
        fullname: firstname + ' ' + lastname,
        email,
        gender,
        phone: '+' + phone,
        notes,
        address,
    }

    await writeToFile(lead, null)
    return;
}
