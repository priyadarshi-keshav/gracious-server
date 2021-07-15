module.exports = {

    routeNotFound: (req, res, next) => {
        const error = new Error('route not found');
        error.status = 404;
        next(error)
    },

    expressErrorHandler: (error, req, res, next) => {
        res.status(error.status || 500);
        res.send({
            status: error.status || 500,
            message: error.message
        })
    }
}