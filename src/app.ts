import createError, { HttpError } from "http-errors";
import express, { NextFunction, Request, Response } from "express";
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import methodOverride from 'method-override';
import {indexRouter} from './routes/index';
import {signUpRouter} from './routes/signup';
import {loginRouter} from './routes/login';
import {usersRouter} from './routes/users';

export const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter);
app.use('/signup', signUpRouter);
app.use('/login', loginRouter);
app.use(methodOverride('_method'));

app.use('/users', usersRouter);

/** GET for logging user out */
app.get('/logout', function(req: Request, res: Response) {
  res.clearCookie('authorization')
  res.redirect('/')
})

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: HttpError, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
