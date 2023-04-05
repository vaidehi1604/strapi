const { createCoreController } = require("@strapi/strapi").factories;
const dotenv = require("dotenv");
dotenv.config();

const https = require("https");
const PaytmChecksum = require("PaytmChecksum");

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  // async exampleAction(ctx){
  //   try {
  //     ctx.body='ok';
  //   } catch (error) {
  //     ctx.body=error;
  //   }
  // }

  async pre(ctx) {
    let params = JSON.parse(ctx.request.body);
    try {
      console.log(params);
      let orderId = "ORDER" + Math.floor(10000 * Math.random());
      let otp = "OTP" + Math.floor(1000000 * Math.random());
     
      const entry = await strapi.entityService
        .create("api::order.order", {
          data: {
            name: params.name,
            email: params.email,
            orderId: orderId,
            paymentInfo: null,
            product: params.product,
            address: params.address,
            otp: otp,
            amount:params.amount,
            status: "pending",
          },
        })
        .then((res) => {
          return ctx.send(res);
        })
        .catch((err) => {
          console.log(err);
          return (ctx.status = 400);
        });
    } catch (error) {
      return (ctx.body = error);
    }
  },

  /*
   * import checksum generation utility
   * You can get this utility from https://developer.paytm.com/docs/checksum/
   */

  // var paytmParams = {};

  // paytmParams.body = {
  //   requestType: "Payment",
  //   mid: process.env.M_KEY,
  //   websiteName: "YOUR_WEBSITE_NAME",
  //   orderId: 12345,
  //   callbackUrl: "http://localhost:1337/api/orders/posttransaction",
  //   txnAmount: {
  //     value: 1,
  //     currency: "INR",
  //   },
  //   userInfo: {
  //     custId: "CUST_001",
  //   },
  // };

  // let params = JSON.parse(ctx.request.body);
  // /*
  //  * Generate checksum by parameters we have in body
  //  * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
  //  */
  // let checksum = await PaytmChecksum.generateSignature(
  //   JSON.stringify(paytmParams.body),
  //   process.env.M_KEY
  // );
  // const gettoken = async () => {
  //   return new Promise((resolve, reject) => {
  //     paytmParams.head = {
  //       signature: checksum,
  //     };

  //     var post_data = JSON.stringify(paytmParams);

  //     var options = {
  //       /* for Staging */
  //       // hostname: "securegw-stage.paytm.in"
  //       /* for Production */
  //       hostname: "securegw.paytm.in",

  //       port: 443,
  //       path: "/theia/api/v1/initiateTransaction?mid=process.env.M_KEY&orderId=params.orderId",
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Content-Length": post_data.length,
  //   },
  // };

  // var response = "";
  // var post_req = https.request(options, function (post_res) {
  //   post_res.on("data", function (chunk) {
  //     response += chunk;
  //   });

  //   post_res.on("end", function () {
  //     console.log("Response: ", response);
  //     resolve(response);
  //   });
  // });

  // post_req.write(post_data);
  // post_req.end();
  // });

  // let myr = await gettoken();
  // ctx.send(JSON.parse(myr));

  async post(ctx) {
    /*
     * import checksum generation utility
     * You can get this utility from https://developer.paytm.com/docs/checksum/
     */

    var paytmParams = {};

    paytmParams.body = {
      requestType: "Payment",
      mid: process.env.M_KEY,
      websiteName: "YOUR_WEBSITE_NAME",
      orderId: 12345,
      callbackUrl: "https://localhost:1337/api/orders/posttransaction",
      txnAmount: {
        value: 1,
        currency: "INR",
      },
      userInfo: {
        custId: "CUST_001",
      },
    };

    let params = JSON.parse(ctx.request.body);
    /*
     * Generate checksum by parameters we have in body
     * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
     */
    let checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      process.env.M_KEY
    );
    const gettoken = async () => {
      return new Promise((resolve, reject) => {
        paytmParams.head = {
          signature: checksum,
        };

        var post_data = JSON.stringify(paytmParams);

        var options = {
          /* for Staging */
          // hostname: "securegw-stage.paytm.in"
          /* for Production */
          hostname: "securegw.paytm.in",

          port: 443,
          path: "/theia/api/v1/initiateTransaction?mid=process.env.M_KEY&orderId=params.orderId",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": post_data.length,
          },
        };

        var response = "";
        var post_req = https.request(options, function (post_res) {
          post_res.on("data", function (chunk) {
            response += chunk;
          });

          post_res.on("end", function () {
            console.log("Response: ", response);
            resolve(response);
          });
        });

        post_req.write(post_data);
        post_req.end();
      });
    };

    let myr = await gettoken();
    ctx.send(JSON.parse(myr));
  },
}));
