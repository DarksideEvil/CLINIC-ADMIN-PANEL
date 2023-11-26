import SideBar from '../component/side-bar';
import React from 'react';
import {Button,
Modal, Input,
IconButton, 
Form, InputPicker} from 'rsuite';
import AddOutlineIcon from '@rsuite/icons/AddOutline';
import { useState, useEffect } from 'react';
import axios from 'axios';
import URL from '../config';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@rsuite/icons/Edit';
import TrashIcon from '@rsuite/icons/Trash';
import { jwtDecode } from 'jwt-decode';

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

const Job = () => {

    //for modal open/close
    const [open, setOpen] = useState(false);
    //opens modal
    const handleOpen = () => setOpen(true);
    //closes modal
    const handleClose = () => setOpen(false);
    //determines that for edit req. '1' for post req. '0'
    const [status, setStatus] = useState(1);
    //refreshes page when needed
    const [refreshKey, setRefreshKey] = useState(0);
    //gets jobs from database
    const [jobs, setJobs] = useState([]);
    //gets doctors from database
    const [doctors, setDoctors] = useState([]);
    //sends new data 'job' to database
    const [formValue, setFormValue] = useState({
        title: '',
        desc: '',
        doctor: '',
        price: '',
        workDay: [],
        workDays: ''
    });
    //saves needed user's id
    const [jobId, setJobId] = useState('');
    //user/token
    const token = JSON?.parse(localStorage?.getItem('user'));
    const user = jwtDecode(token);

    //sending new or edited job to the database..
    const submit = async (e) => {
        try {
            formValue.price = Number(formValue.price);
            formValue?.workDay?.push(formValue?.workDays);
            delete formValue?.workDays;
            if (formValue.doctor === null || formValue.doctor === '') {delete formValue.doctor}
            //post request
            if (status === 0) {
                await axios.post(`${URL}/jobs`, formValue,
                    {headers: {Authorization: token}}
                );
                setFormValue({
                    title: '',
                    desc: '',
                    doctor: '',
                    price: '',
                    workDay: [],
                    workDays: ''
                });
                setRefreshKey(refreshKey + 1);
            } else {
                //put request
                await axios.put(`${URL}/jobs/${jobId}`, formValue,
                    {headers: {Authorization: token}}
                );
                setFormValue({
                    title: '',
                    desc: '',
                    doctor: '',
                    price: '',
                    workDay: [],
                    workDays: ''
                });
                setRefreshKey(refreshKey + 1);
            }
        } catch (err) {alert(err?.response?.data?.message);}
    }

    //getting jobs from database..
    const fetchData = async () => {
        try {
            const jobs = await axios.get(`${URL}/jobs`);
            setJobs(jobs?.data);    
        } catch (err) {alert(err?.response?.data?.message);}
    }

    //getting doctors from database..
    const fetchData1 = async () => {
        try {
            const doctors = await axios.get(`${URL}/doctors`);
            setDoctors(doctors?.data);   
        } catch (err) {alert(err?.response?.data?.message);}
    }

    //works when clicked edit button..
    const editJob = (job) => {
        setStatus(1);
        setJobId(job?._id);
        setFormValue({
            title: job?.title,
            desc: job?.desc,
            doctor: job?.doctor?.fullname,
            price: job?.price,
            workDays: job?.workDay
        });
        handleOpen();
    }

    //works when clicked delete button..
    const deleteJob = async (job) => {
        try {
            if (window.confirm(`you gonna delete "${job?.title}" ?!`)) {
                const success = await axios.delete(`${URL}/jobs/${job?._id}`,
                    {headers: {Authorization: token}}
                );
                if (success.status === 200) {alert('successfully deleted !');}
                setRefreshKey(refreshKey + 1);
            }
        } catch (err) {alert(err?.response?.data?.message);}
    }

    const addition = () => {
        setStatus(0);
        handleOpen();
    }

    const cancellation = () => {
        handleClose();
        setFormValue({
            title: '',
            desc: '',
            doctor: '',
            price: '',
            workDay: [],
            workDays: ''
        });
    }

    //gets selected id of doctor..
    const handlerChange = (e) => {
        formValue.doctor = e
    }

    useEffect(() => {
        fetchData();
        fetchData1();
    }, [refreshKey]);

    const data = doctors?.map(doctor => ({label: doctor?.fullname, value: doctor?._id}));

    return (
        <div className='job_wrapper'>
            <div className="row">
                <div className="col-md-2">
                    <SideBar />
                </div>
                <div className="col-md-10 work_place">
                    <div className="header_txt_place">
                        <h2>Jobs</h2>
                    </div>
                    <TableContainer component={Paper} style={{ height: 500, width: '95%' }}>
                        <Table sx={{ minWidth: 500 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell width={50}>id</TableCell>
                                    <TableCell width={100}>title</TableCell>
                                    <TableCell width={150}>doctor</TableCell>
                                    <TableCell width={80}>price</TableCell>
                                    <TableCell width={150}>workDays</TableCell>
                                    <TableCell width={80}>totaLIncome</TableCell>
                                    {
                                        user?.role === 'admin' ? 
                                        <>
                                            <TableCell width={50} align="center">...</TableCell>
                                            <TableCell width={50} align="center">...</TableCell>
                                        </> : ''
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {jobs?.map((job, i) => {
                                    return (
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                            <TableCell width={70} align="left">{i}</TableCell>
                                            <TableCell width={100} component="th" scope="row">
                                                {job?.title}
                                            </TableCell>
                                            <TableCell width={150} align="left">{job?.doctor?.fullname}</TableCell>
                                            <TableCell width={100} align="left">{job?.price} $</TableCell>
                                            <TableCell width={150} align="left">{job?.workDay}</TableCell>
                                            <TableCell width={100} align="left">{job?.income} $</TableCell>

                                            {
                                                user?.role === 'admin' ?
                                                <>
                                                    <TableCell width={50} align="center">
                                                        <IconButton onClick={() => editJob(job)}
                                                        icon={<EditIcon />}>Edit</IconButton>
                                                    </TableCell>
                                                    <TableCell width={50} align="center">
                                                        <IconButton onClick={() => deleteJob(job)}
                                                        icon={<TrashIcon />}>Delete</IconButton>
                                                    </TableCell>
                                                </> : ''
                                            }
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {
                        user?.role === 'admin' ?
                        <div className="adder_place">
                            <IconButton onClick={() => addition()} icon={<AddOutlineIcon />}>Add</IconButton>
                        </div> : ''
                    }
                </div>
            </div>

            <Modal open={open} onClose={() => cancellation()} size="xs">
                <Modal.Header>
                <Modal.Title>
                    {
                        status === 0 ? 'NEW JOB' : 'EDIT JOB'
                    }
                </Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit={submit} fluid onChange={setFormValue} formValue={formValue}>
                        <Form.Group controlId="title-9">
                            <Form.ControlLabel>title</Form.ControlLabel>
                            <Form.Control name="title" />
                            <Form.HelpText>Required</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="doctor-9">
                            <Form.ControlLabel>doctor</Form.ControlLabel>
                            <InputPicker onChange={handlerChange} name='doctor' data={data} />
                            <Form.HelpText>Required</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="title-9">
                            <Form.ControlLabel>price</Form.ControlLabel>
                            <Form.Control type='number' name="price" />
                            <Form.HelpText>Required</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="textarea-9">
                            <Form.ControlLabel>description</Form.ControlLabel>
                            <Form.Control rows={5} name="desc" accepter={Textarea} />
                        </Form.Group>
                        <Form.Group controlId="title-9">
                            <Form.ControlLabel>workDays</Form.ControlLabel>
                            <Form.Control name="workDays" />
                            <Form.HelpText>Required</Form.HelpText>
                        </Form.Group>
                <Modal.Footer>
                    <Button type='submit' onClick={() => handleClose()} appearance="primary">
                        Confirm
                    </Button>
                    <Button onClick={() => cancellation()} appearance="subtle">
                        Cancel
                    </Button>
                </Modal.Footer>
                    </Form>
                    </Modal.Body>
            </Modal>
        </div>
    );
}
 
export default Job;