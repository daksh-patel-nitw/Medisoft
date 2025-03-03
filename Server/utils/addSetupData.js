import pid from '../models/helper.js';
import login from '../models/login.js';

const records1 = [
  { mId: 'admin', uname: 'admin', password: 'admin', type: 'admin', dep: 'admin' },
  { mId: 'opd2', uname: 'opd2', password: 'opd2', type: 'opd2', dep: 'orthopedic' },
];

const records2 = [
  { name: 'roles', content: ['doctor', 'laboratorist', 'nurse', 'pharmacist'] },
  { name: 'pid', content: [1] },
  { name: 'eid', content: [1] },
  { name: 'dep', content: ['orthopedic', 'neurologist', 'cardiologist', 'endocrinologist', 'gynecologist'] },
  { name: 'medicineType', content: ['tablet', 'capsule', 'injection', 'ointment', 'drop', 'inhaler', 'cream', 'gel', 'lotion', 'shampoo', 'spray', 'powder', 'mouthwash', 'paste', 'emulsion', 'bar', 'soap'] }
];

export const insertData = async () => {
  try {
    
    for (const record of records1) {
      const exists = await login.findOne({ mId: record.mId });
      if (!exists) {
        await login.create(record);
        console.log(`Inserted login record: ${record.mId}`);
      } else {
        console.log(`Login record already exists: ${record.mId}`);
      }
    }

    for (const record of records2) {
      const exists = await pid.findOne({ name: record.name });
      if (!exists) {
        await pid.create(record);
        console.log(`Inserted helper record: ${record.name}`);
      } else {
        console.log(`Helper record already exists: ${record.name}`);
      }
    }

    console.log('Setup data insertion completed!');
  } catch (error) {
    console.error('Error inserting setup data:', error);
  }
};
