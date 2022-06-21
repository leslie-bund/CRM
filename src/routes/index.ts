import express, { NextFunction, Request, Response } from 'express';
export const indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/', async function(req: Request, res: Response, next: NextFunction) {
  // console.log(await db);
  res.render('index', { title: 'Leslie\'s CRM' });
});
