const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    res.status(statusCode).send({
        success: true,
        user,
        token,
    });
};

export default sendToken;