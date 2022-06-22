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
    .get(controllers_1.getAllUsers);
/** GET a single user */
// usersRouter.route('/:id')
//     .get(function(req: Request, res: Response, next: NextFunction) {
//       debug('---->GET', req.params)
//       res.send('users')
//       /*
//       1. Render single user page with form for update
//       2. Use id in params to get client details
//       3. Add user's id to updateForm's action
//       */ 
//     })
//     .post(function(req: Request, res: Response, next: NextFunction) {
//       /**
//        * 
//        */
//     });
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
        // debug('--->POST',req.params)
        yield (0, controllers_1.removeClient)(Number(req.params.id));
        res.redirect('/users');
    });
});
