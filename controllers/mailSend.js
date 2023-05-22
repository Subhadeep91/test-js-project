const nodemailer = require("nodemailer");
const store = require('store');
const _ = require('lodash');
const sendMail = async() => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'stacey.sipes32@ethereal.email',
        pass: 'RWnBfMwr13bDtdatHH'
    }
  });
  let mergedArray = store.get('mergedUserArray');
  store.each((key) => {
    if (key.length === 36) {
      mergedArray = _.reject(mergedArray, (obj) => obj.uid === key);
    }
  });
  mergedArray = _.map(mergedArray, (obj) => _.omit(_.omit(_.omit(obj, 'birthdate'), 'userUid'), 'uid'));
  const htmlTable = `
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Address</th>
      </tr>
    </thead>
    <tbody>
      ${mergedArray.map((obj) => `<tr><td>${obj.username}</td><td>${obj.address}</td></tr>`).join('')}
    </tbody>
  </table>`;

const htmlTemplate = `
  <html>
    <body>
      <h1>User Details</h1>
      ${htmlTable}
    </body>
  </html>`;

  let info = await transporter.sendMail({
    from: '"Admin" <do_not_reply@northpole.com>',
    to: "santa@northpole.com",
    subject: "List of pending users",
    text: JSON.stringify(mergedArray),
    html: htmlTemplate
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = {sendMail};