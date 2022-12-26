import { toggleToken } from './token.js';

const sendToken = (user, statusCode, res) => {
    const token = user.getJwtToken();
    const incorrectToken = toggleToken(token);

    res.status(statusCode).send({
        success: true,
        user,
        token: incorrectToken,
    });
};

export default sendToken;