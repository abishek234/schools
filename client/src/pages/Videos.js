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
import { VideosListHead, VideosListToolbar, VideosMoreMenu,VideosAddDialog,VideosDialog,VideosViewDialog } from '../sections/@dashboard/app';

// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'subject', label: 'Subject', alignRight: false },
    { id: 'chapter', label: 'Chapter', alignRight: false },
    { id: 'topic', label: 'Topic', alignRight: false },
    { id: 'videoId', label: 'Video ID', alignRight: false },
    { id: 'materialId', label: 'Material ID', alignRight: false },
    { id: 'class', label: 'Class', alignRight: false },
    { id: 'form', label: 'Form', alignRight: false },
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
        filteredArray = filteredArray.filter((video) =>
            video.subject.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
            video.chapter.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
            video.topic.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
            video.videoId.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
            video.materialId.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
            video.class.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
            video.form.toLowerCase().indexOf(query.toLowerCase()) !== -1
        );
    }

  

    return filteredArray;
}

export default function Videos() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('subject');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // State for videos
    const [videos, setVideos] = useState([]);
    const [subject, setSubject] = useState('');
    const [chapter, setChapter] = useState('');
    const [topic, setTopic] = useState('');
    const [videoId, setVideoId] = useState('');
    const [materialId, setMaterialId] = useState('');
    const [classid, setClassid] = useState('');
    const [form, setForm] = useState('');
    const [editingVideoId, setEditingVideoId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [openViewModal, setOpenViewModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);

    // Fetch students from the server on component mount
    useEffect(() => {
        fetchVideos();
    }, []);

    const teacherId = localStorage.getItem('userId');
    const fetchVideos = async () => {
        try {
            const response = await axios.get(`http://localhost:9000/api/videos/video/${teacherId}`);
            setVideos(response.data);
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = videos.map((n) => n.videoId); // Use videoId as unique identifier
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, videoId) => {
        const selectedIndex = selected.indexOf(videoId);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, videoId);
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

    const handleOpenModal = (videosId) => {
        setOpenModal(true);
        const video = videos.find((video) => video._id === videosId);
        setSubject(video.subject);
        setChapter(video.chapter);
        setTopic(video.topic);
        setVideoId(video.videoId);
        setMaterialId(video.materialId);
        setClassid(video.class);
        setForm(video.form);
        setEditingVideoId(video._id);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSubject('');
        setChapter('');
        setTopic('');
        setVideoId('');
        setMaterialId('');
        setClassid('');
        setForm('');
        setEditingVideoId(null);
    };

    const handleDeleteVideo = async (videoId) => {
        if (window.confirm("Are you sure you want to delete this video?")) {
            try {
                await axios.delete(`http://localhost:9000/api/videos/video/${videoId}`);
                fetchVideos();
            } catch (error) {
                console.error("Error deleting video:", error);
            }
        }
    };

    const handleViewVideo = (video) => {
        setSelectedVideo(video);
        setOpenViewModal(true);
        setEditingVideoId(video._id);
    };

    const handleCloseViewModal = () => {
        setOpenViewModal(false);
        setSelectedVideo(null);
    };

    const handleAddModal = () => {
        setOpenAddModal(true);
    };

const handleCloseAddModal = () => {
        setOpenAddModal(false);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - videos.length) : 0;

    const filteredVideos = applySortFilter(videos, getComparator(order, orderBy), filterName);

    const isVideoNotFound = filteredVideos.length === 0;

    return (
        <Page title="Videos">
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Videos
                </Typography>
                <Button variant="contained" onClick={() => setOpenAddModal(true)} startIcon={<Iconify icon="eva:plus-fill" />}>
                    New Video
                </Button>
            </Stack>

            <Card>
                <VideosListToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <VideosListHead
                                order={order}
                                orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={videos.length}
                                numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                                onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {filteredVideos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { _id, subject, chapter, topic, videoId, materialId, class: videoClass, form } = row;
                                    const isItemSelected = selected.indexOf(videoId) !== -1;

                                    return (
                                        <TableRow
                                            hover
                                            key={_id}
                                            tabIndex={-1}
                                            role="checkbox"
                                            selected={isItemSelected}
                                            aria-checked={isItemSelected}
                                        >
                                            <TableCell align='left'>  <IconButton onClick={() => handleViewVideo(row)} aria-label="view video">
                                                    <Iconify icon="eva:eye-fill" />
                                                </IconButton></TableCell>
                                            <TableCell align="left">{subject}</TableCell>
                                            <TableCell align="left">{chapter}</TableCell>
                                            <TableCell align="left">{topic}</TableCell>
                                            <TableCell align="left">{videoId}</TableCell>
                                            <TableCell align="left">{materialId}</TableCell>
                                            <TableCell align="left">{videoClass}</TableCell>
                                            <TableCell align="left">{form}</TableCell>
                                            <TableCell align="right">
                                               
                                                <VideosMoreMenu
                                                    onEdit={() => handleOpenModal(_id)}
                                                    onDelete={() => handleDeleteVideo(_id)}
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

                            {isVideoNotFound && (
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
                    count={videos.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <VideosDialog
                    open={openModal}
                    onClose={handleCloseModal}
                    videosId={editingVideoId}
                    fetchvideos={fetchVideos}
                />

                <VideosViewDialog
                    open={openViewModal}
                    onClose={handleCloseViewModal}
                    videosId={editingVideoId}
                />
                <VideosAddDialog
                    open={openAddModal}
                    onClose={handleCloseAddModal}
                />
            </Card>
        </Container>
    </Page>
    );
}


