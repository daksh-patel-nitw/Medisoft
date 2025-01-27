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




