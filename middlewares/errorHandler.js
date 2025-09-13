const errorHandler = (err, req, res, next) => {
console.error(err);
const status = err.statusCode || 500;

res.status(status).json({
    message: "Due to an server issue, you can not do this activity. Please try later and back to the previous page",
});
};


module.exports = errorHandler;