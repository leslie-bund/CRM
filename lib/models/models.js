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
exports.createStaff = exports.checkUnique = exports.loginSchema = exports.staffSchema = void 0;
// import fs from 'fs/promises';
// import path from 'path';
const util_1 = require("../util");
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
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
        const usernameDup = database.find((element) => obj.username === element.username);
        if (mailDup) {
            return { duplicated: 'Email has already been taken. Please choose another' };
        }
        if (usernameDup) {
            return { duplicated: 'Username has already been claimed. Please choose another' };
        }
        return true;
    });
}
exports.checkUnique = checkUnique;
function createStaff(obj) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { username, firstname, lastname, email, gender, phone, password } = obj;
        // Get last index in db
        const database = yield util_1.db;
        let nextId = (((_a = database[database.length - 1]) === null || _a === void 0 ? void 0 : _a.id) + 1) || 1;
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
                    id: nextId
                };
                yield (0, util_1.writeToFile)(newStaff);
            });
        });
        return nextId;
    });
}
exports.createStaff = createStaff;
