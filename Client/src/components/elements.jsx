// //===================Auto Complete=============================
// const [searchValue, setSearchValue] = useState('');
// const handleSearch = (event, newValue) =>
//     {
//         setSearchValue(newValue ? newValue : '');
//     };
    
// <Autocomplete
//             freeSolo
//                                 options={medicines.map((option) => option.name)}
//                                 onChange={handleSearch}
//                                 renderInput={(params) => (
//                                     <TextField
//                                         {...params}
//                                         label='Search by Medicine'
//                                         margin='normal'
//                                         variant='outlined'
//                                     />
//                                 )}
//                             />


// //======================Modal===============================================

// const [selectedMedicine, setSelectedMedicine] = useState(null);
// const [openEditModal, setOpenEditModal] = useState(false);
// const [colname, setColname] = useState('');
// const handleEdit = (id, updatedMedicine, column) =>
//     {
//         console.log(id);
//         setMedicines((prevMedicines) => prevMedicines.map((m) =>
//         {
//             if (m._id === id) {
//                 return { ...m, [column]: updatedMedicine };
//             }
//             return m;
//         }));
//     };

//     const handleOpenEditModal = (medicine, column) =>
//     {
//         setSelectedMedicine(medicine);
//         console.log("MName", medicine, "Column:", column);
//         setColname(column);
//         setOpenEditModal(true);
//     };

//     const handleCloseEditModal = () =>
//     {
//         setOpenEditModal(false);
//     };

//     {selectedMedicine && (
//         <EditModal
//             open={openEditModal}
//             column={colname}
//             handleClose={handleCloseEditModal}
//             handleEdit={handleEdit}
//             medicine={selectedMedicine}
//         />
//     )}

// //============================Dropdown==============================================
// <FormControl required variant="outlined" fullWidth>
//               <InputLabel htmlFor="filled-age-native-simple">{Rar2[index]}</InputLabel>
//                 <Select
//                   native
//                   key={fieldName}
//                   name={fieldName}
//                   label={Rar2[index]}
//                   id={fieldName}
//                   onChange={handleRChange}
//                   value={roomValues[fieldName]}
//                   inputProps={{
//                     name: fieldName,
//                     id: 'filled-age-native-simple',
//                   }}
//                 >
//                   <option aria-label="None" value="" />
//                   {(index===1)?categories.map((option) => (
//                     <option  value={option.type}>{option.type}</option>
//                   )):depS.length > 0&&depS[0].content.map((option) => (
//                     <option  value={option}>{option}</option>
//                   ))}
                    
                  
//                 </Select>
//                 </FormControl>

// //=====================Radio Button=========================================

// // ==================Table with sort===================================================
// import { Table,TableBody,TableCell,TableContainer,TableHead,TableRow,IconButton,} from '@material-ui/core';
// const [order, setOrder] = useState('asc');
//   const [orderBy, setOrderBy] = useState('');

//   const handleSortRequest = (property) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//     setMedicines((prev) => prev.sort((a, b) => {
//       if (isAsc) {
//         return a[property] > b[property] ? 1 : -1;
//       } else {
//         return b[property] > a[property] ? 1 : -1;
//       }
//     }));
//   };

//   const rowsPerPageOptions = [1, 2, 3];
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   <TableContainer >
//                                 <Table size="small">
//                                     <TableHead  style={{ backgroundColor: '#1F3F49' }}>
//                                         <TableRow>
//                                             <TableCell>
//                                               <TableSortLabel
//                                                 active={orderBy === 'name'}
//                                                 direction={orderBy === 'name' ? order : 'asc'}
//                                                 onClick={() => handleSortRequest('name')}
//                                               >
//                                                 Name
//                                               </TableSortLabel>
//                                             </TableCell>
//                                             <TableCell>
//                                               <TableSortLabel
//                                                 active={orderBy === 'pid'}
//                                                 direction={orderBy === 'pid' ? order : 'asc'}
//                                                 onClick={() => handleSortRequest('pid')}
//                                               >
//                                                PatientId
//                                               </TableSortLabel>
//                                             </TableCell>
//                                             <TableCell>AppointmentId</TableCell>
//                                             <TableCell>DoctorId</TableCell>
//                                             <TableCell>Units Required</TableCell>
//                                             <TableCell>Unit</TableCell>
//                                             <TableCell>Price</TableCell>
//                                             <TableCell>Action</TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {medicines.filter((m) => m.pid.toLowerCase().includes(searchValue.toLowerCase())||m.name.toLowerCase().includes(searchValue.toLowerCase())).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((m) => (
//                                             <TableRow key={m.id}>
//                                                 <TableCell>{m.name}</TableCell>
//                                                 <TableCell>{m.pid}<IconButton
                                                        
//                                                     >
//                                                         <Delete />
//                                                     </IconButton>
// </TableCell>
//                                                 <TableCell>{m.aid}</TableCell>
//                                                 <TableCell>{m.did}</TableCell>
//                                                 <TableCell>{m.quantity}</TableCell>
//                                                 <TableCell>{m.unit}</TableCell>
//                                                 <TableCell>{m.price}</TableCell>
//                                                 <TableCell>
//                                                     <Button
//                                                         type="submit"
//                                                         variant="contained"
//                                                         color="primary"
//                                                     >
//                                                         Bill
//                                                     </Button>
//                                                 </TableCell>

//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                                 <TablePagination
//           rowsPerPageOptions={rowsPerPageOptions}
//           component="div"
//           count={medicines.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//                             </TableContainer>