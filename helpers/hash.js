'use strict';
const bcrypt = require('bcryptjs');

module.exports.hash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
module.exports.checkHash = async (password, hash) => {
    return await bcrypt.compare(password, hash); 
}