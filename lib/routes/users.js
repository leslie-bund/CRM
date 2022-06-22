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
    .get(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const lead = yield (0, controllers_1.getClientById)(Number(req.params.id));
        res.render('user', { item: Object.assign({}, lead) });
    });
})
    .post(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const lead = yield (0, controllers_1.getClientById)(Number(req.params.id));
        yield (0, controllers_1.updateClient)(Number(req.params.id), req.body);
        return res.render('user', { errorMsg: `Client ${req.body.firstname + ' ' + req.body.lastname} successfully updated`, flag: 'success', item: Object.assign({}, lead) });
    });
});
/* POST new user. */
exports.usersRouter.route('/add')
    .get(function (req, res, next) {
    res.render('add');
})
    .post(controllers_1.addNewLead);
/** DELETE a single user */
exports.usersRouter.route('/remove/:id')
    .get(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, controllers_1.removeClient)(Number(req.params.id));
        res.redirect('/users');
    });
});
