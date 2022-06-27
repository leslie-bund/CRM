"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const util_1 = require("../util");
const controllers_1 = require("../controller/controllers");
const debug = require('debug')('week5-009:server');
exports.usersRouter = express_1.default.Router();
exports.usersRouter.use(util_1.isValidUser);
/* GET users listing. */
exports.usersRouter.route('/')
    .get(controllers_1.getAllUsers);
/** GET a single user */
exports.usersRouter.route('/edit/:id')
    .get(controllers_1.viewSingleLead)
    .put(controllers_1.updateLead);
/* POST new user. */
exports.usersRouter.route('/add')
    .get(controllers_1.collectNewLeadInfo)
    .post(controllers_1.addNewLead);
/** DELETE a single user */
exports.usersRouter.route('/remove/:id')
    .delete(controllers_1.removeLead);
