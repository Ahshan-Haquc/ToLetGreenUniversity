const errorHandler = (err, req, res, next) => {
    console.error(err);

    // Handle MongoDB timeout / server selection error
    if (err.name === "MongooseServerSelectionError" || err.message?.includes("buffering timed out")) {
        return res.status(500).json({
            success: false,
            message: "Database connection error. Please try again later.",
            issue: "MongoDB connection could not be established within the time limit."
        });
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        issue: "Due to a server issue, you cannot perform this activity right now. Please try again later."
    });
};

module.exports = errorHandler;
