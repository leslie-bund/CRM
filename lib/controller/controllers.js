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
exports.updateClient = exports.getClientById = exports.removeClient = exports.getAllUsers = exports.loginPostHandler = exports.loginGetHandler = exports.signupPostHandler = exports.addNewLead = exports.signupGetHandler = void 0;
const models_1 = require("../models/models");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const util_1 = require("../util");
const debug = require('debug')('week5-009:server');
function signupGetHandler(req, res, next) {
    return res.render('signup');
}
exports.signupGetHandler = signupGetHandler;
function addNewLead(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate form inputs
        const { value, error } = models_1.leadSchema.validate(req.body);
        // Send Validation error back to client
        if (error) {
            res.header('Refresh', '4');
            return res.render('add', { errorMsg: `${error.message}` });
        }
        // Ensure no duplicate email
        const duplicateResult = yield (0, models_1.checkUnique)(value);
        if (typeof duplicateResult !== 'boolean') {
            res.header('Refresh', '4');
            return res.render('add', { errorMsg: `${duplicateResult.duplicated}` });
        }
        yield (0, models_1.createLead)(value);
        return res.render('add', { errorMsg: `Successfully added ${value.firstname} ${value.lastname}`, flag: `success` });
    });
}
exports.addNewLead = addNewLead;
function signupPostHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate form inputs
        const { value, error } = models_1.staffSchema.validate(req.body, { presence: 'required' });
        // Send Validation error back to client
        if (error) {
            res.header('Refresh', '5');
            return res.render('signup', { errorMsg: `${error.message}` });
        }
        // Ensure no duplicate email
        const duplicateResult = yield (0, models_1.checkUnique)(value);
        if (typeof duplicateResult !== 'boolean') {
            res.header('Refresh', '5');
            return res.render('signup', { errorMsg: `${duplicateResult.duplicated}` });
        }
        // create the user, join fullname and hash password before registering to db then return boolean 
        const id = yield (0, models_1.createStaff)(value);
        let data = {
            time: Date(),
            id: id,
        };
        // Sign token to expire in 2mins
        const token = jsonwebtoken_1.default.sign(data, `Leslie_Will_Know_How_To_Code_Someday`, { expiresIn: 600 });
        res.cookie('authorization', token);
        res.redirect(301, '../users');
    });
}
exports.signupPostHandler = signupPostHandler;
function loginGetHandler(req, res, next) {
    return res.render('login');
}
exports.loginGetHandler = loginGetHandler;
function loginPostHandler(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate form inputs
        const { value, error } = models_1.loginSchema.validate(req.body, { presence: 'required' });
        // Send Validation error back to client
        if (error) {
            res.header('Refresh', '5');
            return res.render('login', { error: `${error.message}` });
        }
        // Ensure username exists
        const database = yield util_1.db;
        const staff = database
            .filter((element) => element.password !== undefined)
            .find((element) => element.username === value.username);
        // Send db username validation error back to client
        if (!staff) {
            res.header('Refresh', '5');
            return res.render('login', { error: `Username ${value.username} does not exist` });
        }
        // Validate password
        bcrypt_1.default.compare(value.password, staff.password).then(function (result) {
            if (result) {
                // Sign new authorization token and send to header
                const data = {
                    time: Date(),
                    id: staff.id,
                };
                const token = jsonwebtoken_1.default.sign(data, `Leslie_Will_Know_How_To_Code_Someday`, { expiresIn: 180 });
                res.cookie('authorization', token);
                return res.redirect(301, '../users');
            }
            else {
                res.header('Refresh', '5');
                return res.render('login', { error: `Wrong Password` });
            }
        });
    });
}
exports.loginPostHandler = loginPostHandler;
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Read all users from db and filter only customers
        const database = yield util_1.db;
        const customers = database.filter((lead) => !lead.hasOwnProperty('password'));
        return res.render('users', { data: customers });
    });
}
exports.getAllUsers = getAllUsers;
function removeClient(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield util_1.db;
        const client = database.find((record) => record.id === id);
        database.splice(database.indexOf(client), 1);
        yield (0, util_1.writeToFile)(null, database);
        return;
    });
}
exports.removeClient = removeClient;
function getClientById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield util_1.db;
        const client = database.find((record) => record.id === id);
        return client;
    });
}
exports.getClientById = getClientById;
function updateClient(id, obj) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield util_1.db;
        database.forEach((element, index) => {
            if (element.id === id) {
                database[index].fullname = obj.firstname + ' ' + obj.lastname;
                database[index].phone = obj.phone;
                database[index].address = obj.address;
                database[index].notes = obj.notes;
            }
        });
        yield (0, util_1.writeToFile)(null, database);
        return;
    });
}
exports.updateClient = updateClient;
