const jwt = require('jsonwebtoken');

const privateKey = "4#%gce6$hUf^vleEL[e%(73"

exports.genAuthToken = (payload = {}) => {
    return jwt.sign(payload, privateKey, { expiresIn: '1h' })
}

exports.verifyAuthToken = (token) => {
    try {
        const result = jwt.verify(token, privateKey)

        return { success: true, payload: result }
    } catch (error) {
        let errorType = ""

        switch (error.name) {
            case "TokenExpiredError":
                errorType = "expired"
                break;
            case "JsonWebTokenError":
                errorType = "misc"
                break;
            case "NotBeforeError":
                errorType = "nbf"
                break;
            default:
                break;
        }

        return { errorType: errorType, message: error.message }
    }
}