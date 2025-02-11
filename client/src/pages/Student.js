import { filter, set } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
    Card,
    Table,
    Stack,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import { StudentDialog, StudentListHead, StudentListToolbar, StudentViewDialog, StudentMoreMenu ,StudentAddDialog} from '../sections/@dashboard/app';

// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'firstname', label: 'First Name', alignRight: false },
    { id: 'lastname', label: 'Last Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'rollno', label: 'Roll No', alignRight: false },
    { id: 'classid', label: 'Class ID', alignRight: false },
    { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
    { id: 'dateofbirth', label: 'Date of Birth', alignRight: false },
    { id: 'gender', label: 'Gender', alignRight: false },
    { id: 'schoolname', label: 'School Name', alignRight: false },
    { id: 'address', label: 'Address', alignRight: false },
    { id: 'city', label: 'City', alignRight: false },
    { id: 'state', label: 'State', alignRight: false },
    { id: 'pincode', label: 'Pincode', alignRight: false },
    { id: 'action', label: 'Action', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query,genderFilter) {
    
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    let filteredArray = stabilizedThis.map((el) => el[0]);

    // Apply text query filter
    if (query) {
        filteredArray = filteredArray.filter((student) =>
            student.firstname.toLowerCase().includes(query.toLowerCase()) ||
            student.lastname.toLowerCase().includes(query.toLowerCase()) ||
            student.rollno.toString().includes(query.toLowerCase()) ||
            student.classid.toString().includes(query.toLowerCase()) ||
            student.email.toLowerCase().includes(query.toLowerCase()) ||
            student.phoneNumber.toString().includes(query.toLowerCase()) ||
            student.gender?.toLowerCase().includes(query.toLowerCase()) ||
            student.schoolname?.toLowerCase().includes(query.toLowerCase()) ||
            student.Address?.toLowerCase().includes(query.toLowerCase()) ||
            student.State?.toLowerCase().includes(query.toLowerCase()) ||
            student.City?.toLowerCase().includes(query.toLowerCase()) ||
            student.Pincode?.toString().includes(query.toLowerCase())
        );
    }

    if (genderFilter) {
        filteredArray = filteredArray.filter((student) => student.gender === genderFilter);
    }
  

    return filteredArray;
}

export default function Student() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('firstname');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // State for students
    const [students, setStudents] = useState([]);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [rollno, setRollno] = useState('');
    const [classid, setClassid] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [dateofbirth, setDateOfBirth] = useState('');
    const [schoolname, setSchoolname] = useState('');
    const [address, setAddress] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [genderFilter, setGenderFilter] = useState('');
    const [openAddModal, setOpenAddModal] = useState(false);

    // Fetch students from the server on component mount
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:9000/api/students/students'); // Adjust endpoint as necessary
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = students.map((n) => n.email); // Use email as unique identifier
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, email) => {
        const selectedIndex = selected.indexOf(email);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, email);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const handleOpenModal = (studentId) => {
        if (studentId) {
            const studentToEdit = students.find((student) => student._id === studentId);
            if (studentToEdit) {
                setFirstname(studentToEdit.firstname);
                setLastname(studentToEdit.lastname);
                setEmail(studentToEdit.email);
                setRollno(studentToEdit.rollno);
                setClassid(studentToEdit.classid);
                setPhoneNumber(studentToEdit.phoneNumber);
                setDateOfBirth(studentToEdit.dateofbirth);
                setGender(studentToEdit.gender);
                setSchoolname(studentToEdit.schoolname);
                setAddress(studentToEdit.Address);
                setState(studentToEdit.State);
                setCity(studentToEdit.City);
                setPincode(studentToEdit.Pincode);
                setEditingStudentId(studentId);
            }
        } else {
            setFirstname('');
            setLastname('');
            setEmail('');
            setRollno('');
            setClassid('');
            setPhoneNumber('');
            setDateOfBirth('');
            setGender('');
            setSchoolname('');
            setAddress('');
            setState('');
            setCity('');
            setPincode('');
           

        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setFirstname('');
        setLastname('');
        setEmail('');
        setRollno('');
        setClassid('');
        setPhoneNumber('');
        setDateOfBirth('');
        setGender('');
        setSchoolname('');
        setAddress('');
        setState('');
        setCity('');
        setPincode('');
        setEditingStudentId(null);
    };

    const handleDeleteStudent = async (studentId) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await axios.delete(`http://localhost:9000/api/students/student/${studentId}`);
                fetchStudents();
            } catch (error) {
                console.error("Error deleting student:", error);
            }
        }
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setOpenViewModal(true);
        setEditingStudentId(user._id);
    };

    const handleCloseViewModal = () => {
        setOpenViewModal(false);
        setSelectedUser(null);
    };

    const handleAddModal = () => {
        setOpenAddModal(true);
    };

const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - students.length) : 0;

    const filteredStudents = applySortFilter(students, getComparator(order, orderBy), filterName,genderFilter);

    const isStudentNotFound = filteredStudents.length === 0;

    return (
        <Page title="Student">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Student
                    </Typography>
                    <Button variant="contained" onClick={handleAddModal} startIcon={<Iconify icon="eva:plus-fill" />}>
                        New Student
                    </Button>
                </Stack>

                <Card>
                    <StudentListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        genderFilter={genderFilter}
                        onGenderFilterChange={(event) => setGenderFilter(event.target.value)}
                    />
                    

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <StudentListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={students.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { _id, firstname, lastname, email,rollno,classid, phoneNumber, dateofbirth, gender, designation, handlingclass, schoolname, Address, State, City, Pincode } = row;
                                        const isItemSelected = selected.indexOf(email) !== -1;

                                        return (
                                            <TableRow
                                                hover
                                                key={_id}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={isItemSelected}
                                                aria-checked={isItemSelected}
                                            >
                                                <TableCell align="left">
                                                    <IconButton onClick={() => handleViewUser(row)} aria-label="view user">
                                                        <Iconify icon="eva:eye-fill" />
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell align='left'>{firstname}</TableCell>
                                                <TableCell align="left">{lastname}</TableCell>
                                                <TableCell align="left">{email}</TableCell>
                                                <TableCell align="left">{rollno}</TableCell>
                                                <TableCell align="left">{classid}</TableCell>
                                                <TableCell align="left">{phoneNumber}</TableCell>
                                                <TableCell align="left">{new Date(dateofbirth).toLocaleDateString()}</TableCell>
                                                <TableCell align="left">{gender}</TableCell>
                                                <TableCell align="left">{schoolname}</TableCell>
                                                <TableCell align="left">{Address}</TableCell>
                                                <TableCell align="left">{City}</TableCell>
                                                <TableCell align="left">{State}</TableCell>
                                                <TableCell align="left">{Pincode}</TableCell>
                                                <TableCell align="right">
                                                    <StudentMoreMenu
                                                        onEdit={() => handleOpenModal(_id)}
                                                        onDelete={() => handleDeleteStudent(_id)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isStudentNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <SearchNotFound searchQuery={filterName} />
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={students.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>

                <StudentDialog
                    open={openModal}
                    onClose={handleCloseModal}
                    studentId={editingStudentId}
                    fetchstudents={fetchStudents}
                />

                <StudentViewDialog
                    open={openViewModal}
                    onClose={handleCloseViewModal}
                    studentId={editingStudentId}
                />

                <StudentAddDialog
                    open={openAddModal}
                    onClose={handleCloseAddModal}
                />
            </Container>
        </Page>
    );
}


