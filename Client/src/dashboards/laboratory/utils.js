export const side_bar=[
  {label:'New Test',path:'/newtest',icon:'AddBox'},
  {label:'Test List',path:'/tests',icon: 'TableChart'},
  {label:'Patients',path:'/labpatients',icon:'AccountBox'},
];

export const arr1 = [ 'name',  'price',  'pat_details',  'normal','timing'];
export const arr2 = ["Test Name", "Test Price", "Required Details", "Normal Range", "Timings (Availability)"];

export const initialTestState=arr1.reduce(
  (obj, key) => ({ ...obj, [key]: key==='timing'?[]:'' }),
  {}
);