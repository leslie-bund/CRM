"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLead = exports.createStaff = exports.checkUnique = exports.loginSchema = exports.staffSchema = exports.leadSchema = void 0;
// import fs from 'fs/promises';
// import path from 'path';
const util_1 = require("../util");
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
exports.leadSchema = joi_1.default.object({
    firstname: joi_1.default.string()
        .max(50),
    lastname: joi_1.default.string()
        .max(50),
    gender: joi_1.default.string()
        .min(1)
        .max(1)
        .pattern(new RegExp('(m|f)')),
    email: joi_1.default.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'edu'] } }),
    phone: joi_1.default.number(),
    address: joi_1.default.string().max(250),
    notes: joi_1.default.string().max(500)
}).with('firstname', 'lastname')
    .or('address', 'notes');
exports.staffSchema = joi_1.default.object({
    username: joi_1.default.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    firstname: joi_1.default.string()
        .max(50),
    lastname: joi_1.default.string()
        .max(50),
    gender: joi_1.default.string()
        .min(1)
        .max(1)
        .pattern(new RegExp('(m|f)')),
    email: joi_1.default.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'edu'] } }),
    phone: joi_1.default.number(),
    password: joi_1.default.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,}$')),
    confirmPassword: joi_1.default.ref('password')
}).with('firstname', 'lastname')
    .with('pass', 'conpass');
exports.loginSchema = joi_1.default.object({
    username: joi_1.default.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: joi_1.default.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,}$'))
});
function checkUnique(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield util_1.db;
        const mailDup = database.find((element) => obj.email === element.email);
        if (obj.hasOwnProperty('username')) {
            const usernameDup = database.find((element) => obj.username === element.username);
            if (usernameDup) {
                return { duplicated: 'Username has already been claimed. Please choose another' };
            }
        }
        if (mailDup) {
            return { duplicated: 'Email has already been taken. Please choose another' };
        }
        return true;
    });
}
exports.checkUnique = checkUnique;
function createStaff(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, firstname, lastname, email, gender, phone, password } = obj;
        bcrypt_1.default.hash(password, 8).then(function updateDbAfterNewStaff(hash) {
            return __awaiter(this, void 0, void 0, function* () {
                // Store hash in your password DB.
                const newStaff = {
                    username,
                    fullname: `${firstname} ${lastname}`,
                    email,
                    gender,
                    phone,
                    password: hash,
                };
                yield (0, util_1.writeToFile)(newStaff, null);
            });
        });
        return;
    });
}
exports.createStaff = createStaff;
function createLead(obj) {
    return __awaiter(this, void 0, void 0, function* () {
        // Destructure value for storage in db
        const { firstname, lastname, email, gender, phone, notes, address } = obj;
        const lead = {
            fullname: firstname + ' ' + lastname,
            email,
            gender,
            phone: '+' + phone,
            notes,
            address,
        };
        yield (0, util_1.writeToFile)(lead, null);
        return;
    });
}
exports.createLead = createLead;
// export async 
