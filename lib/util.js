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
exports.updateLead = exports.isValidUser = exports.writeToFile = exports.db = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import bcrypt from 'bcrypt'; 
// import Joi from 'joi';
const debug = require('debug')('week5-009:server');
// import path from 'path';
exports.db = (function readDatabaseFile() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            try {
                const dbString = yield promises_1.default.readFile('database.json', 'utf-8');
                return JSON.parse(dbString);
            }
            catch (error) {
                debug(error);
                yield promises_1.default.writeFile('database.json', JSON.stringify([]), 'utf8');
            }
        }
    });
})();
function writeToFile(obj, newDb) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (obj === null) {
            yield promises_1.default.writeFile('database.json', JSON.stringify(newDb), 'utf8');
            return;
        }
        const database = yield exports.db;
        let nextId = (((_a = database[database.length - 1]) === null || _a === void 0 ? void 0 : _a.id) + 1) || 1;
        database.push(Object.assign(Object.assign({}, obj), { id: nextId }));
        yield promises_1.default.writeFile('database.json', JSON.stringify(database), 'utf8');
        return;
    });
}
exports.writeToFile = writeToFile;
function isValidUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.authorization;
        let payload;
        try {
            payload = jsonwebtoken_1.default.verify(token, `Leslie_Will_Know_How_To_Code_Someday`);
            // Confirm that payload exists
            const database = yield exports.db;
            const exists = database.some((element) => element.id === payload.id);
            if (exists) {
                next();
            }
            else {
                res.status(400);
                return res.render('error', { message: 'Not authorized to access this page', error: { status: '', stack: '' } });
            }
        }
        catch (e) {
            // Plan for errors
            let message = [];
            if (e.name === 'JsonWebTokenError')
                message.push('Kindly login with your correct credentials');
            if (e.name === 'TokenExpiredError')
                message.push('Your session has timed out, Login again');
            return res.render('login', { error: message.pop() });
        }
    });
}
exports.isValidUser = isValidUser;
function updateLead() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.updateLead = updateLead;
