const jwt = require('jsonwebtoken');

const privateKey = "4#%gce6$hUf^vleEL[e%(73"

exports.getAuthToken = async (payload = {}) => {
    //todo fix
    const t = jwt.sign(payload, privateKey, (err, token) => {
        return token
    });

    console.log(t)
    return t
}