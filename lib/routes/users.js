"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const util_1 = require("../util");
exports.usersRouter = express_1.default.Router();
/** Pending routes
 * /add_new_user GET&POST - Add new customer to db
 * /?id= GET - Get a single user
 * /edit_user  PUT - modify an existing user
 * /?id=  DELETE - remove an existing user from db
 * /logout - remove authorization header from response object and redirect to home page
  */
exports.usersRouter.use(util_1.isValidUser);
/* GET users listing. */
exports.usersRouter.route('/')
    .get(function (req, res, next) {
    // Call controller function
    res.send('You\'re getting there');
});
/** GET & DELETE a single user */
exports.usersRouter.route('/:id')
    .get(function (req, res, next) {
    // Call controller function
})
    .delete(function (req, res, next) {
    // Call controller function
});
/** PUT edit a users details */
exports.usersRouter.route('/edit_user')
    .put(function (req, res, next) {
    // Call controller function
});
/** GET for logging user out */
exports.usersRouter.route('/logout')
    .get(function (req, res) {
    res.clearCookie('authorization');
    res.redirect('../../');
});
