"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const method_override_1 = __importDefault(require("method-override"));
const index_1 = require("./routes/index");
const signup_1 = require("./routes/signup");
const login_1 = require("./routes/login");
const users_1 = require("./routes/users");
exports.app = (0, express_1.default)();
// view engine setup
exports.app.set('views', path_1.default.join(__dirname, '../views'));
exports.app.set('view engine', 'jade');
exports.app.use((0, morgan_1.default)('dev'));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
exports.app.use('/', index_1.indexRouter);
exports.app.use('/signup', signup_1.signUpRouter);
exports.app.use('/login', login_1.loginRouter);
exports.app.use((0, method_override_1.default)('_method'));
exports.app.use('/users', users_1.usersRouter);
/** GET for logging user out */
exports.app.get('/logout', function (req, res) {
    res.clearCookie('authorization');
    res.redirect('/');
});
// catch 404 and forward to error handler
exports.app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
exports.app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
