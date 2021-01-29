export const catchErrors = fn => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/*
    Not Found Error Handler
    Handles 404 Errors
*/

export const notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  res.status(err.status || 404).json('Route Not Found');
};

/*
    MongoDB Validation Error Handler
    Detect if there are mongodb validation errors and show via flash
*/

export const logValidationErrors = (err, req, res, next) => {
  if (!err.errors) return next(err);
  const errorKeys = Object.keys(err.errors);
  errorKeys.forEach(key => console.error(err.errors[key].message));
};

/*
    Development Error Hanlder
    In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
export const developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      '<mark>$&</mark>'
    ),
  };
  res.status(err.status || 500).json('Internal Server Error');
  console.error('🚫 🚫 🚫 🚫');
  console.error('error', errorDetails);
};

/*
    Production Error Hanlder
    No stacktraces are leaked to user
*/
export const productionErrors = (err, req, res, next) => {
  res.status(err.status || 500).json('Internal Server Error');
  console.error(err.message);
};
