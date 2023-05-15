const { format } = require('timeago.js');
const moment = require('moment');

const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp);
};

helpers.formatDate = (date, format) => {
    return moment(date).format(format);
  };
  

module.exports = helpers;