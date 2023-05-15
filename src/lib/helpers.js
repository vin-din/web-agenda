const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, salt);
    return pass;
};

helpers.matchPass = async (password, savedPassword) => {
    try {
       return await bcrypt.compare(password, savedPassword);
    } catch (error) {
        console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAA');
    }
};

module.exports = helpers;