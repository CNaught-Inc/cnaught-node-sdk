require('dotenv').config();

module.exports = {
    getApiKey: () => {
        return process.env.API_KEY;
    },
    getApiHostname: () => {
        return process.env.API_HOSTNAME;
    }
}