require('dotenv').config();

import createError from 'http-errors'
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import response from './utils/response'
import v1Router from './routes/v1'

// jwt 토큰 middleware
import jwtMiddleware from './middlewares/jwt.middleware'

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 컨트롤러를 타기 전에 jwt 로부터 user 를 조회
app.use(jwtMiddleware)

app.use('/v1', v1Router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  let apiError = err
  
  if(!err.status) {
    apiError = createError(err)
  }

    // set locals, only providing error in development
    res.locals.message = apiError.message
    res.locals.error = process.env.NODE_ENV === 'development' ? apiError : {}
    
    // render the error page
    return response(res, {
      message: apiError.message
    }, apiError.status)
  
})

module.exports = app;
