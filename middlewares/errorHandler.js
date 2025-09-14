const errorHandler = (err, req, res, next) => {
console.error(err);
const statusCode = err.statusCode || 500;
res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    issue: "Due to an server issue, you can not do this activity. Please try later and back to the previous page"
});
};


module.exports = errorHandler;