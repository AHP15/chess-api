
export const handleError = (err, res) => {
    let status = 500;
    let message = err?.message;
    
    if (err.message.includes("User validation failed")) {
        status = 400;
    };
    if (err.message.includes("E11000 duplicate key error collection")) {
        status = 400;
        message = "Email aleardy exist!"
    }
    if (err.message.includes("does not exist")) {
        status = 404;
    }
    if(err.message === "Incorrect password") {
        status = 401;
    }

    res.status(status).send({
        seccuss: false,
        error: message
    });
};
