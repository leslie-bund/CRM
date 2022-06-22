import express, { NextFunction, Request, Response } from "express";
import { isValidUser } from '../util';
import { getAllUsers, addNewLead, removeClient } from "../controller/controllers";
const debug = require('debug')('week5-009:server');

export const usersRouter = express.Router();

/** Pending routes
 * /add_new_user GET&POST - Add new customer to db
 * /?id= GET - Get a single user
 * /edit_user  PUT - modify an existing user
 * /?id=  DELETE - remove an existing user from db
 * /logout - remove authorization header from response object and redirect to home page
  */

usersRouter.use(isValidUser);


/* GET users listing. */
usersRouter.route('/')
    .get(getAllUsers);

/** GET a single user */
usersRouter.route('/edit/:id')
    .get(function(req: Request, res: Response, next: NextFunction) {
      debug('---->GET', req.params)
      res.send('users')
      /*
      1. Render single user page with form for update
      2. Use id in params to get client details
      3. Add user's id to updateForm's action
      */ 
    })
    .post(function(req: Request, res: Response, next: NextFunction) {
      /**
       * 
       */
    });


/* POST new user. */
usersRouter.route('/add')
    .get(function(req: Request, res: Response, next: NextFunction) {
      res.render('add')
    })
    .post(addNewLead)

/** DELETE a single user */
usersRouter.route('/remove/:id')
    .get(async function(req: Request, res: Response, next: NextFunction) {
      // debug('--->POST',req.params)
      await removeClient(Number(req.params.id));
      res.redirect('/users')
    });


