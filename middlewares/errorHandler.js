const errorHandler = (err, req, res, next) => {
console.error(err);

res.send(
    "Due to an server issue, you can not do this activity. Please try later and back to the previous page",
);
};


module.exports = errorHandler;