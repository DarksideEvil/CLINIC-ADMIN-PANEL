import React from 'react';
import SideBar from '../component/side-bar';
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

const Service = () => {

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
    //gets services from database
    const [services, setServices] = useState([]);
    //gets doctors from database
    const [doctors, setDoctors] = useState([]);
    //sends new data 'service' to database
    const [formValue, setFormValue] = useState({
        title: '',
        desc: '',
        doctor: '',
        price: '',
        workDay: [],
        workDays: ''
    });
    //saves needed user's id
    const [serviceId, setServiceId] = useState('');
    //gets signed up/in user
    const token = JSON?.parse(localStorage?.getItem('user'));
    const user = jwtDecode(token);

    //sending new or edited service to the database..
    const submit = async (e) => {
        try {
            formValue.price = Number(formValue.price);
            formValue?.workDay?.push(formValue?.workDays);
            delete formValue?.workDays;
            if (formValue.doctor === null || formValue.doctor === '') {delete formValue.doctor}
            //post request
            if (status === 0) {
                await axios.post(`${URL}/services`, formValue,
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
                await axios.put(`${URL}/services/${serviceId}`, formValue,
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

    //getting services from database..
    const fetchData = async () => {
        try {
            const services = await axios.get(`${URL}/services`,
                {headers: {Authorization: token}}
            );
            setServices(services?.data);    
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
    const editService = (service) => {
        setStatus(1);
        setServiceId(service?._id);
        setFormValue({
            title: service?.title,
            desc: service?.desc,
            doctor: service?.doctor?.fullname,
            price: service?.price,
            workDays: service?.workDay
        });
        handleOpen();
    }

    //works when clicked delete button..
    const deleteService = async (service) => {
        try {
            if (window.confirm(`you gonna delete "${service?.title}" ?!`)) {
                const success = await axios.delete(`${URL}/services/${service?._id}`,
                    {headers: {Authorization: token}}
                );
                if (success.status === 200) {alert('successfully deleted !');}
                setRefreshKey(refreshKey + 1);
            }
        } catch (err) {alert(err?.response?.data?.message);}
    }

    const addition = () => {
        setFormValue({
            title: '',
            desc: '',
            doctor: '',
            price: '',
            workDay: [],
            workDays: ''
        })
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

    const data = doctors.map(doctor => ({label: doctor?.fullname, value: doctor?._id}));
    return (
        <div className='service_wrapper'>
            <div className="row">
                <div className="col-md-2">
                    <SideBar />
                </div>
                <div className="col-md-10 work_place">
                    <div className="header_txt_place">
                        <h2>Services</h2>
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
                                {services?.map((service, i) => {
                                    return (
                                        <TableRow
                                            key={i}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                            <TableCell width={70} align="left">{i}</TableCell>
                                            <TableCell width={100} component="th" scope="row">
                                                {service?.title}
                                            </TableCell>
                                            <TableCell width={150} align="left">{service?.doctor?.fullname}</TableCell>
                                            <TableCell width={100} align="left">{service?.price} $</TableCell>
                                            <TableCell width={150} align="left">{service?.workDay}</TableCell>
                                            <TableCell width={100} align="left">{service?.income} $</TableCell>

                                            {
                                                user?.role === 'admin' ?
                                                <>
                                                    <TableCell width={50} align="center">
                                                        <IconButton onClick={() => editService(service)}
                                                        icon={<EditIcon />}>Edit</IconButton>
                                                    </TableCell>
                                                    <TableCell width={50} align="center">
                                                        <IconButton onClick={() => deleteService(service)}
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
                        status === 0 ? 'NEW SERVICE' : 'EDIT SERVICE'
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
                        <Form.Group controlId="price-9">
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
 
export default Service;