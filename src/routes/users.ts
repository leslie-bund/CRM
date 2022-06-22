import express, { NextFunction, Request, Response } from "express";
import { isValidUser } from '../util';
import { getAllUsers, addNewLead, removeClient, getClientById, updateClient } from "../controller/controllers";
const debug = require('debug')('week5-009:server');

export const usersRouter = express.Router();

usersRouter.use(isValidUser);


/* GET users listing. */
usersRouter.route('/')
    .get(getAllUsers);

/** GET a single user */
usersRouter.route('/edit/:id')
    .get(async function(req: Request, res: Response, next: NextFunction) {
      const lead = await getClientById(Number(req.params.id));
      res.render('user', { item: {...lead} })
    })
    .post(async function(req: Request, res: Response, next: NextFunction) {
      const lead = await getClientById(Number(req.params.id));
      await updateClient(Number(req.params.id), req.body)
      return res.render('user', {errorMsg: `Client ${req.body.firstname + ' ' + req.body.lastname} successfully updated`, flag: 'success', item: {...lead}});
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
      await removeClient(Number(req.params.id));
      res.redirect('/users')
    });


