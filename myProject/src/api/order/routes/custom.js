// const dotenv = require('dotenv');
// dotenv.config();
module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/order/pretransaction',
        handler: 'custom.pre',
      },
    ],
  };