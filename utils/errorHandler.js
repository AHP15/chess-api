
export const handleError = (err, status, res) => {
    console.error(err);
    res.status(status).send({
        seccuss: false,
        error: err?.message
    });
};
