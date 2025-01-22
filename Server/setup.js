// insertData.js
import { addInitialLogin } from './controllers/login.js';
import { createRecord2 } from './controllers/billAndHelper.js';

const insertData = async () => {
  try {
    await addInitialLogin();
    await createRecord2();
    console.log('Records added successfully:');
  } catch (error) {
    console.error('Error adding records:', error);
  }
};

export default insertData;  // Export the insertData function



// //==========================Twilio===============================================
// const twilio = require('twilio');
// const accountSid = 'AC68eaa778b2a20e63ece41712af3584ed';
// const authToken = 'ff960610dd1d9e9ab52915683345f96b';
// const client = new twilio(accountSid, authToken);
// client.messages
//     .create({
//         body: '\nMEDISOFT-HMS\n'+'[name]'+' registered Successfully\nUsername:'+'P000091.'+'\nPassword:'+' _xyzwer_.',
//         from: '+16204079430',
//         to: '+919510836469'
//     })
//     .then(message => console.log(message.sid))
//     .done();

