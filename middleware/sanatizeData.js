import xssFilters from "xss-filters";

export const sanatizeReqBody = (req, res, next) => {
    const sanatizedData = {};
    Object.entries((k, v) => {
        // visit https://github.com/YahooArchive/xss-filters for more info
        sanatizedData[k] = xssFilters.inHTMLData(v);
    });
    req.sanatizedData = sanatizedData;
    next();
};