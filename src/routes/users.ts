import express from "express";
import { isValidUser } from '../util';
import { getAllUsers, addNewLead, collectNewLeadInfo, removeLead, viewSingleLead, updateLead } from "../controller/controllers";
const debug = require('debug')('week5-009:server');

export const usersRouter = express.Router();

usersRouter.use(isValidUser);


/* GET users listing. */
usersRouter.route('/')
    .get(getAllUsers);

/** GET a single user */
usersRouter.route('/edit/:id')
    .get(viewSingleLead)
    .put(updateLead);


/* POST new user. */
usersRouter.route('/add')
    .get(collectNewLeadInfo)
    .post(addNewLead)

/** DELETE a single user */
usersRouter.route('/remove/:id')
    .delete(removeLead);


