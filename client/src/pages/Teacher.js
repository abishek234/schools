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
import { TeacherDialog, TeacherListHead, TeacherListToolbar, TeacherViewDialog, TeacherMoreMenu ,TeacherAddDialog} from '../sections/@dashboard/app';

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
    { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
    { id: 'dateofbirth', label: 'Date of Birth', alignRight: false },
    { id: 'gender', label: 'Gender', alignRight: false },
    { id: 'designation', label: 'Designation', alignRight: false },
    { id: 'handlingclass', label: 'Handling Class', alignRight: false },
    { id: 'schoolname', label: 'School Name', alignRight: false },
    { id: 'address', label: 'Address', alignRight: false },
    { id: 'state', label: 'State', alignRight: false },
    { id: 'city', label: 'City', alignRight: false },
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
        filteredArray = filteredArray.filter((teacher) =>
            teacher.firstname.toLowerCase().includes(query.toLowerCase()) ||
            teacher.lastname.toLowerCase().includes(query.toLowerCase()) ||
            teacher.email.toLowerCase().includes(query.toLowerCase()) ||
            teacher.phoneNumber.toString().includes(query.toLowerCase()) ||
            teacher.gender?.toLowerCase().includes(query.toLowerCase()) ||
            teacher.designation?.toLowerCase().includes(query.toLowerCase()) ||
            teacher.handlingclass?.toLowerCase().includes(query.toLowerCase()) ||
            teacher.schoolname?.toLowerCase().includes(query.toLowerCase()) ||
            teacher.Address?.toLowerCase().includes(query.toLowerCase()) ||
            teacher.State?.toLowerCase().includes(query.toLowerCase()) ||
            teacher.City?.toLowerCase().includes(query.toLowerCase()) ||
            teacher.Pincode?.toString().includes(query.toLowerCase())
        );
    }

    if (genderFilter) {
        filteredArray = filteredArray.filter((teacher) => teacher.gender === genderFilter);
    }
  

    return filteredArray;
}

export default function Teacher() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('firstname');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // State for teachers
    const [teachers, setTeachers] = useState([]);
    const [editingTeacherId, setEditingTeacherId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [dateofbirth, setDateOfBirth] = useState('');
    const [designation, setDesignation] = useState('');
    const [handlingclass, setHandlingclass] = useState('');
    const [schoolname, setSchoolname] = useState('');
    const [address, setAddress] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [genderFilter, setGenderFilter] = useState('');
    const [openAddModal, setOpenAddModal] = useState(false);

    // Fetch teachers from the server on component mount
    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:9000/api/teachers/teachers'); // Adjust endpoint as necessary
            setTeachers(response.data);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = teachers.map((n) => n.email); // Use email as unique identifier
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

    const handleOpenModal = (teacherId) => {
        if (teacherId) {
            const teacherToEdit = teachers.find((teacher) => teacher._id === teacherId);
            if (teacherToEdit) {
                setFirstname(teacherToEdit.firstname);
                setLastname(teacherToEdit.lastname);
                setEmail(teacherToEdit.email);
                setPhoneNumber(teacherToEdit.phoneNumber);
                setDateOfBirth(teacherToEdit.dateofbirth);
                setGender(teacherToEdit.gender);
                setDesignation(teacherToEdit.designation);
                setHandlingclass(teacherToEdit.handlingclass);
                setSchoolname(teacherToEdit.schoolname);
                setAddress(teacherToEdit.Address);
                setState(teacherToEdit.State);
                setCity(teacherToEdit.City);
                setPincode(teacherToEdit.Pincode);
                setEditingTeacherId(teacherId);
            }
        } else {
            setFirstname('');
            setLastname('');
            setEmail('');
            setPhoneNumber('');
            setDateOfBirth('');
            setGender('');
            setDesignation('');
            setHandlingclass('');
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
        setPhoneNumber('');
        setDateOfBirth('');
        setGender('');
        setDesignation('');
        setHandlingclass('');
        setSchoolname('');
        setAddress('');
        setState('');
        setCity('');
        setPincode('');
        setEditingTeacherId(null);
    };

    const handleDeleteTeacher = async (teacherId) => {
        if (window.confirm("Are you sure you want to delete this teacher?")) {
            try {
                await axios.delete(`http://localhost:9000/api/teachers/teacher/${teacherId}`);
                fetchTeachers();
            } catch (error) {
                console.error("Error deleting teacher:", error);
            }
        }
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setOpenViewModal(true);
        setEditingTeacherId(user._id);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - teachers.length) : 0;

    const filteredTeachers = applySortFilter(teachers, getComparator(order, orderBy), filterName,genderFilter);

    const isTeacherNotFound = filteredTeachers.length === 0;

    return (
        <Page title="Teacher">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Teacher
                    </Typography>
                    <Button variant="contained" onClick={handleAddModal} startIcon={<Iconify icon="eva:plus-fill" />}>
                        New Teacher
                    </Button>
                </Stack>

                <Card>
                    <TeacherListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        genderFilter={genderFilter}
                        onGenderFilterChange={(event) => setGenderFilter(event.target.value)}
                    />
                    

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <TeacherListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={teachers.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredTeachers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { _id, firstname, lastname, email, phoneNumber, dateofbirth, gender, designation, handlingclass, schoolname, Address, State, City, Pincode } = row;
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
                                                <TableCell align="left">{phoneNumber}</TableCell>
                                                <TableCell align="left">{new Date(dateofbirth).toLocaleDateString()}</TableCell>
                                                <TableCell align="left">{gender}</TableCell>
                                                <TableCell align="left">{designation}</TableCell>
                                                <TableCell align="left">{handlingclass}</TableCell>
                                                <TableCell align="left">{schoolname}</TableCell>
                                                <TableCell align="left">{Address}</TableCell>
                                                <TableCell align="left">{State}</TableCell>
                                                <TableCell align="left">{City}</TableCell>
                                                <TableCell align="left">{Pincode}</TableCell>
                                                <TableCell align="right">
                                                    <TeacherMoreMenu
                                                        onEdit={() => handleOpenModal(_id)}
                                                        onDelete={() => handleDeleteTeacher(_id)}
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

                                {isTeacherNotFound && (
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
                        count={teachers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>

                <TeacherDialog
                    open={openModal}
                    onClose={handleCloseModal}
                    teacherId={editingTeacherId}
                    fetchTeachers={fetchTeachers}
                />

                <TeacherViewDialog
                    open={openViewModal}
                    onClose={handleCloseViewModal}
                    teacherId={editingTeacherId}
                />

                <TeacherAddDialog
                    open={openAddModal}
                    onClose={handleCloseAddModal}
                />
            </Container>
        </Page>
    );
}


