import fs from 'fs/promises';
import { staffObj } from './models/model_interfaces';
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
// export function hashPassword(passwordString: string): string {
//     bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//         // Store hash in your password DB.
//     });
//     return ''
// }