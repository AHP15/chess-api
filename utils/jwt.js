const sendToken = (user, statusCode, res) => {

    const token = user.getJwtToken();

    const options = {
        expires: new Date(
            Date.now() + parseFloat(process.env.COOKIE_EXPIRE * 1000)
        ),
        httpOnly: true
    };

    res.status(statusCode).cookie("token",token, options).send({
        seccuss: true,
        user,
    });
};

export default sendToken;