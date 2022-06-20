import express, { NextFunction, Request, Response } from "express";
export const indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Leslie\'s CRM' });
});
