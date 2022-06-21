import express, { NextFunction, Request, Response } from "express";
import { db, isValidUser } from '../util'

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
    .get(function(req: Request, res: Response, next: NextFunction) {
      // Call controller function
      res.send('You\'re getting there')
    });

/** GET & DELETE a single user */
usersRouter.route('/:id')
    .get(function(req: Request, res: Response, next: NextFunction) {
      // Call controller function
    })
    .delete(function(req: Request, res: Response, next: NextFunction) {
      // Call controller function
    })

/** PUT edit a users details */
usersRouter.route('/edit_user')
    .put(function(req: Request, res: Response, next: NextFunction) {
      // Call controller function
    });
