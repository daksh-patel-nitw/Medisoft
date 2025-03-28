export const  arr=[
  {label:'Patients',path:'/confirmpatient',icon:'AddBox'},
]

export const arr1 = ['pid', 'pname', 'mobile', 'dname', 'time', 'weight', "height", 'doctor_qs',];
export const arr2 = ["Patient ID", "Patient Name", "Mobile", "Doctor Name", "Time", "Weight", "Height", "Doctor questions"];

export const initialValues = arr1.reduce(
  (obj, key) => ({ ...obj, [key]: '' }),
  {}
);
