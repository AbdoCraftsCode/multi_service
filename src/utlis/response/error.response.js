


export const asyncHandelr = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((error) => {
            next({ message: error.message, cause: error.status || 500 });
        });
    };
};





export const globalerror = (error, req, res, next) => {
    console.error("🔥 Error: ", error);

    const statusCode = error.cause && !isNaN(error.cause) ? error.cause : 500;

    if (process.env.MOOD === "DEV") {
        return res.status(statusCode).json({
            message: error.message,
            stack: error.stack
        });
    }

    res.status(statusCode).json({
        message: error.message || "Internal Server Error"
    });
};


