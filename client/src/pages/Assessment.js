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
import { AssessmentsListHead, AssessmentsListToolbar, AssessmentsMoreMenu,AssessmentsAddDialog,AssessmentsDialog,AssessmentsViewDialog } from '../sections/@dashboard/app';

// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'rollNo', label: 'Roll No', alignRight: false },
    { id: 'email',label: 'Email',alignRight:false},
    { id: 'class',label: 'Class',alignRight:false},
    { id: 'subject', label: 'Subject', alignRight: false },
    { id: 'chapter', label: 'Chapter', alignRight: false },
    { id: 'topic', label: 'Topic', alignRight: false },
    { id: 'score', label: 'Score', alignRight: false },
    { id: 'action', label: 'Action', alignRight: true }, // For actions like View, Edit, Delete
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

function applySortFilter(array, comparator, query) {
    
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    let filteredArray = stabilizedThis.map((el) => el[0]);

    // Apply text query filter
    if (query) {
        filteredArray = filteredArray.filter((assessment) =>
            
            assessment.rollNo.toString().toLowerCase().includes(query.toLowerCase()) || 
            assessment.email.toLowerCase().includes(query.toLowerCase()) ||
            assessment.class.toLowerCase().includes(query.toLowerCase()) ||
            assessment.subject.toLowerCase().includes(query.toLowerCase()) ||
            assessment.chapter.toLowerCase().includes(query.toLowerCase()) ||
            assessment.topic.toLowerCase().includes(query.toLowerCase()) ||
            assessment.score.toString().toLowerCase().includes(query.toLowerCase())
            
        );
    }

    return filteredArray;
}

export default function Assessment() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('subject');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // State for assessments
    const [assessments, setAssessments] = useState([]);
    const [rollNo, setRollNo] = useState('');
    const [email, setEmail] = useState('');
    const [classid, setClassid] = useState('');
    const [subject, setSubject] = useState('');
    const [chapter, setChapter] = useState('');
    const [topic, setTopic] = useState('');
    const [score, setScore] = useState('');
    const [assessmentId, setAssessmentId] = useState('');
    const [editingAssessmentId, setEditingAssessmentId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedAssessment, setSelectedAssessment] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [existingData, setExistingData] = useState([]);

    const classId = localStorage.getItem('userhandlingclass'); 
    const subjects = localStorage.getItem('userdesignation'); 

    // Fetch students from the server on component mount
    useEffect(() => {
        fetchExistingData();
    }, [classId, subjects]);

  

  const fetchExistingData = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/api/assessments/assessment/${classId}/${subjects}`);
                if (Array.isArray(response.data)) {
                    setExistingData(response.data); 
                    setAssessments(response.data); 
                } else {
                    console.error("Unexpected response format:", response.data);
                    alert("Failed to fetch existing assessment data.");
                }
            } catch (error) {
                console.error("Error fetching existing data:", error);
                alert("Failed to fetch existing assessment data.");
            }
        };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = assessments.map((n) => n.assessmentId); 
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, assessmentId) => {
        const selectedIndex = selected.indexOf(assessmentId);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, assessmentId);
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

    const handleOpenModal = (assessmentsId) => {
        setOpenModal(true);
        const selectedAssessment = assessments.find((assessment) => assessment._id === assessmentsId);
        setSelectedAssessment(selectedAssessment);
        setRollNo(selectedAssessment.rollNo);
        setEmail(selectedAssessment.email);
        setClassid(selectedAssessment.class);
        setSubject(selectedAssessment.subject);
        setChapter(selectedAssessment.chapter);
        setTopic(selectedAssessment.topic);
        setScore(selectedAssessment.score);
        setAssessmentId(selectedAssessment._id);
        setEditingAssessmentId(assessmentsId);
    
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedAssessment(null);
        setRollNo('');
        setEmail('');
        setClassid('');
        setSubject('');
        setChapter('');
        setTopic('');
        setScore('');
        setAssessmentId('');
        setEditingAssessmentId(null);
    };

    const handleDeleteassessment = async (assessmentId) => {
        if (window.confirm("Are you sure you want to delete this assessment?")) {
            try {
                await axios.delete(`http://localhost:9000/api/assessments/assessment/${assessmentId}`);
                fetchExistingData();
            } catch (error) {
                console.error("Error deleting assessment:", error);
            }
        }
    };

    const handleViewassessment = (assessment) => {
        setSelectedAssessment(assessment);
        setOpenViewModal(true);
        setEditingAssessmentId(assessment._id);
    };

    const handleCloseViewModal = () => {
        setOpenViewModal(false);
        setSelectedAssessment(null);
    };

    const handleAddModal = () => {
        setOpenAddModal(true);
    };

const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - assessments.length) : 0;

    const filteredassessments = applySortFilter(assessments, getComparator(order, orderBy), filterName);

    const isassessmentNotFound = filteredassessments.length === 0;

    return (
        <Page title="assessments">
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Assessments
                </Typography>
                <Button variant="contained" onClick={() => handleAddModal()} startIcon={<Iconify icon="eva:plus-fill" />}>
                    New Assessment
                </Button>
            </Stack>

            <Card>
                <AssessmentsListToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <AssessmentsListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={assessments.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredassessments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { _id, rollNo,email,class:classid,subject,chapter,topic,score} = row;
                                    const isItemSelected = selected.indexOf(assessmentId) !== -1;

                                    return (
                                        <TableRow
                                            hover
                                            key={_id}
                                            tabIndex={-1}
                                            role="checkbox"
                                            selected={isItemSelected}
                                            aria-checked={isItemSelected}
                                        >
                                            <TableCell align='left'>  <IconButton onClick={() => handleViewassessment(row)} aria-label="view assessment">
                                                    <Iconify icon="eva:eye-fill" />
                                                </IconButton></TableCell>
                                            <TableCell align="left">{rollNo}</TableCell>
                                            <TableCell align="left">{email}</TableCell>
                                            <TableCell align="left">{classid}</TableCell>
                                            <TableCell align="left">{subject}</TableCell>
                                            <TableCell align="left">{chapter}</TableCell>
                                            <TableCell align="left">{topic}</TableCell>
                                            <TableCell align="left">{score}</TableCell>
                                            <TableCell align="right">
                                               
                                                <AssessmentsMoreMenu
                                                    onEdit={() => handleOpenModal(_id)}
                                                    onDelete={() => handleDeleteassessment(_id)}
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

                            {isassessmentNotFound && (
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
                    count={assessments.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <AssessmentsDialog
                    open={openModal}
                    onClose={handleCloseModal}
                    assessmentsId={editingAssessmentId}
                    fetchassessments={fetchExistingData}
                />

                <AssessmentsViewDialog
                    open={openViewModal}
                    onClose={handleCloseViewModal}
                    assessmentsId={editingAssessmentId}
                />
                <AssessmentsAddDialog
                    open={openAddModal}
                    onClose={handleCloseAddModal}
                    fetchassessments={fetchExistingData}
                />
            </Card>
        </Container>
    </Page>
    );
}


