import httpStatus from 'http-status';

// 404 handler
export function notFound(req, res, next) {
    res.status(httpStatus.NOT_FOUND).json({ message: 'Not found' });
}

// Central error handler
export function errorHandler(err, req, res, next) {
    const status = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const payload = { message: err.message || 'Internal Server Error' };
    if (process.env.NODE_ENV !== 'production') payload.stack = err.stack;
    res.status(status).json(payload);
}
