// Middleware function to parse allowed attributes in requests
const parseFields = (req, res, next) => {
    if (req.body.allowedAttributes) {
        req.body.allowedAttributes = JSON.parse(req.body.allowedAttributes);
    }

    next();
};

module.exports = parseFields;