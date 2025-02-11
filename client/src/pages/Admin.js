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
import { AdminDialog, AdminListHead, AdminListToolbar, AdminViewDialog, AdminMoreMenu ,AdminAddDialog} from '../sections/@dashboard/app';

// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'phoneNumber', label: 'Phone Number', alignRight: false },
    { id: 'gender', label: 'Gender', alignRight: false },
    { id: 'designation', label: 'Designation', alignRight: false },
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
        filteredArray = filteredArray.filter((admin) =>
            admin.name.toLowerCase().includes(query.toLowerCase()) ||
            admin.email.toLowerCase().includes(query.toLowerCase()) ||
            admin.phoneNumber.toString().includes(query.toLowerCase()) ||
            admin.gender?.toLowerCase().includes(query.toLowerCase()) ||
            admin.designation?.toLowerCase().includes(query.toLowerCase()) ||
            admin.schoolname?.toLowerCase().includes(query.toLowerCase()) ||
            admin.Address?.toLowerCase().includes(query.toLowerCase()) ||
            admin.State?.toLowerCase().includes(query.toLowerCase()) ||
            admin.City?.toLowerCase().includes(query.toLowerCase()) ||
            admin.Pincode?.toString().includes(query.toLowerCase())
        );
    }

    if (genderFilter) {
        filteredArray = filteredArray.filter((admin) => admin.gender === genderFilter);
    }
  

    return filteredArray;
}

export default function Admin() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('firstname');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // State for admins
    const [admins, setadmins] = useState([]);
    const [editingadminId, setEditingAdminId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('');
    const [designation, setDesignation] = useState('');
    const [schoolname, setSchoolname] = useState('');
    const [address, setAddress] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [genderFilter, setGenderFilter] = useState('');
    const [openAddModal, setOpenAddModal] = useState(false);

    // Fetch admins from the server on component mount
    useEffect(() => {
        fetchadmins();
    }, []);

    const fetchadmins = async () => {
        try {
            const response = await axios.get('http://localhost:9000/api/admins/admin'); // Adjust endpoint as necessary
            setadmins(response.data);
        } catch (error) {
            console.error("Error fetching admins:", error);
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = admins.map((n) => n.email); // Use email as unique identifier
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

    const handleOpenModal = (adminId) => {
        if (adminId) {
            const adminToEdit = admins.find((admin) => admin._id === adminId);
            if (adminToEdit) {
                setName(adminToEdit.name);
                setEmail(adminToEdit.email);
                setPhoneNumber(adminToEdit.phoneNumber);
                setGender(adminToEdit.gender);
                setDesignation(adminToEdit.designation);
                setSchoolname(adminToEdit.schoolname);
                setAddress(adminToEdit.Address);
                setState(adminToEdit.State);
                setCity(adminToEdit.City);
                setPincode(adminToEdit.Pincode);
                setEditingAdminId(adminId);
            }
        } else {
            setName('');
            setEmail('');
            setPhoneNumber('');
            setGender('');
            setDesignation('');
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
        setName('');
        setEmail('');
        setPhoneNumber('');
        setGender('');
        setDesignation('');
        setSchoolname('');
        setAddress('');
        setState('');
        setCity('');
        setPincode('');
        setEditingAdminId(null);
    };

    const handleDeleteAdmin = async (adminId) => {
        if (window.confirm("Are you sure you want to delete this admin?")) {
            try {
                await axios.delete(`http://localhost:9000/api/admins/admin/${adminId}`);
                fetchadmins();
            } catch (error) {
                console.error("Error deleting admin:", error);
            }
        }
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setOpenViewModal(true);
        setEditingAdminId(user._id);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - admins.length) : 0;

    const filteredadmins = applySortFilter(admins, getComparator(order, orderBy), filterName,genderFilter);

    const isadminNotFound = filteredadmins.length === 0;

    return (
        <Page title="Admin">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Admin
                    </Typography>
                    <Button variant="contained" onClick={handleAddModal} startIcon={<Iconify icon="eva:plus-fill" />}>
                        New Admin
                    </Button>
                </Stack>

                <Card>
                    <AdminListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                        genderFilter={genderFilter}
                        onGenderFilterChange={(event) => setGenderFilter(event.target.value)}
                    />
                    

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <AdminListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={admins.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredadmins.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { _id, name, email, phoneNumber, gender, designation, schoolname, Address, State, City, Pincode } = row;
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
                                                <TableCell align='left'>{name}</TableCell>
                                                <TableCell align="left">{email}</TableCell>
                                                <TableCell align="left">{phoneNumber}</TableCell>                                                
                                                <TableCell align="left">{gender}</TableCell>
                                                <TableCell align="left">{designation}</TableCell>
                                                <TableCell align="left">{schoolname}</TableCell>
                                                <TableCell align="left">{Address}</TableCell>
                                                <TableCell align="left">{State}</TableCell>
                                                <TableCell align="left">{City}</TableCell>
                                                <TableCell align="left">{Pincode}</TableCell>
                                                <TableCell align="right">
                                                    <AdminMoreMenu
                                                        onEdit={() => handleOpenModal(_id)}
                                                        onDelete={() => handleDeleteAdmin(_id)}
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

                                {isadminNotFound && (
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
                        count={admins.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>

                <AdminDialog
                    open={openModal}
                    onClose={handleCloseModal}
                    adminId={editingadminId}
                    fetchadmins={fetchadmins}
                />

                <AdminViewDialog
                    open={openViewModal}
                    onClose={handleCloseViewModal}
                    adminId={editingadminId}
                />

                <AdminAddDialog
                    open={openAddModal}
                    onClose={handleCloseAddModal}
                />
            </Container>
        </Page>
    );
}


