import SideBar from '../component/side-bar';
import {Button,
Modal,
IconButton, InputGroup, 
Form,} from 'rsuite';
import AddOutlineIcon from '@rsuite/icons/AddOutline';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
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

const Patient = () => {

    //for modal open/close
    const [open, setOpen] = useState(false);
    //opens modal
    const handleOpen = () => setOpen(true);
    //closes modal
    const handleClose = () => setOpen(false);
    //for password input's icon visible or not handles
    const [visible, setVisible] = useState(false);
    //determines that for edit req. 1 post req. 0
    const [status, setStatus] = useState(1);
    //refreshes page when needed
    const [refreshKey, setRefreshKey] = useState(0);
    //gets patients from database
    const [patients, setPatients] = useState([]);
    //saves needed user's id
    const [patientId, setPatientId] = useState('');
    //sends new data 'patient' to database
    const [formValue, setFormValue] = useState({
        fullname: '',
        phone: '',
        address: '',
        age: '',
        email: '',
        password: '',
        balance: ''
    });
    //gets signed up/in user
    const token = JSON?.parse(localStorage?.getItem('user'));
    const user = jwtDecode(token);

    //for password input
    const handleChange = () => {
        setVisible(!visible);
    };

    //getting patients from database..
    const fetchData = async () => {
        try {
            const patients = await axios.get(`${URL}/patients`,
                {headers: {Authorization: token}}
            );
            setPatients(patients?.data); 
        } catch (err) {alert(err?.response?.data?.message);}
    }
    
    //sending new or edited doctor to the database..
    const submit = async (e) => {
        formValue.age = Number(formValue.age);
        formValue.phone = Number(formValue.phone);
        formValue.balance = Number(formValue.balance);
        try {
            //post request
            if (status === 0) {
                await axios.post(`${URL}/patients`, formValue,
                {headers: {Authorization: token}}
                );
                setFormValue({
                    fullname: '',
                    phone: '',
                    address: '',
                    age: '',
                    email: '',
                    password: '',
                    balance: ''
                });
                setRefreshKey(refreshKey + 1);
            } else {
                delete formValue.balance
                //put request
                await axios.put(`${URL}/patients/${patientId}`, formValue,
                {headers: {Authorization: token}}
                );
                setFormValue({
                    fullname: '',
                    phone: '',
                    address: '',
                    age: '',
                    email: ''
                });
                setRefreshKey(refreshKey + 1);
            }
        } catch (err) {alert(err?.response?.data?.message);}
    }

    //works when clicked edit button..
    const editPatient = (patient) => {
        setStatus(1);
        setPatientId(patient?._id);
        setFormValue({
            fullname: patient?.fullname,
            phone: patient?.phone,
            address: patient?.address,
            age: patient?.age,
            email: patient?.email
        });
        handleOpen();
    }

    //works when clicked delete button..
    const deletePatient = async (patient) => {
        try {
            if (window.confirm(`you gonna delete "${patient?.fullname}" ?!`)) {
                const success = await axios.delete(`${URL}/patients/${patient?._id}`,
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
            fullname: '',
            phone: '',
            address: '',
            age: '',
            email: '',
            password: '',
            balance: ''
        });
    }

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    return (
        <div className='patient_wrapper'>
            <div className="row">
                <div className="col-md-2">
                    <SideBar />
                </div>
                <div className="col-md-10 work_place">
                    <div className="header_txt_place">
                        <h2>Patients</h2>
                    </div>
                    <TableContainer component={Paper} style={{ height: 350, width: '90%' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell width={20}>id</TableCell>
                                <TableCell width={70}>fullname</TableCell>
                                <TableCell width={100}>phone</TableCell>
                                <TableCell width={100}>address</TableCell>
                                <TableCell width={50}>age</TableCell>
                                <TableCell width={100}>email</TableCell>
                                <TableCell width={50}>role</TableCell>
                                <TableCell width={50}>balance</TableCell>
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
                                {patients?.map((patient, i) => (
                                    <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell width={20} align="left">{i}</TableCell>
                                        <TableCell width={70} component="th" scope="row">
                                            {patient?.fullname}
                                        </TableCell>
                                        <TableCell width={100} align="left">{patient?.phone}</TableCell>
                                        <TableCell width={100} align="left">{patient?.address}</TableCell>
                                        <TableCell width={50} align="left">{patient?.age}</TableCell>
                                        <TableCell width={100} align="left">{patient?.email}</TableCell>
                                        <TableCell width={50} align="left">{patient?.role}</TableCell>
                                        <TableCell width={50} align="left">{patient?.balance} $</TableCell>

                                        {
                                            user?.role === 'admin' ?
                                            <>
                                                <TableCell width={50} align="center">
                                                    <IconButton onClick={() => editPatient(patient)}
                                                    icon={<EditIcon />}>Edit</IconButton>
                                                </TableCell>
                                                <TableCell width={50} align="center">
                                                    <IconButton onClick={() => deletePatient(patient)}
                                                    icon={<TrashIcon />}>Delete</IconButton>
                                                </TableCell>
                                            </> : ''
                                        }
                                    </TableRow>
                                ))}
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
                        status === 0 ? 'NEW PATIENT' : 'EDIT PATIENT'
                    }
                </Modal.Title>
                </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit={submit} fluid onChange={setFormValue} formValue={formValue}>
                        <Form.Group controlId="name-9">
                            <Form.ControlLabel>fullName</Form.ControlLabel>
                            <Form.Control name="fullname" />
                            <Form.HelpText>Required</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="name-9">
                            <Form.ControlLabel>phone</Form.ControlLabel>
                            <Form.Control type='number' name="phone" placeholder='ex: 99891..' />
                            <Form.HelpText>Required</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="name-9">
                            <Form.ControlLabel>address</Form.ControlLabel>
                            <Form.Control name="address" />
                            <Form.HelpText>Required</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="name-9">
                            <Form.ControlLabel>age</Form.ControlLabel>
                            <Form.Control type='number' name="age" />
                            <Form.HelpText>Required</Form.HelpText>
                        </Form.Group>
                        <Form.Group controlId="email-9">
                            <Form.ControlLabel>email</Form.ControlLabel>
                            <Form.Control name="email" type="email" />
                            <Form.HelpText>Required</Form.HelpText>
                        </Form.Group>
                        {
                            status === 0 ?
                            <>
                                <Form.Group controlId="password-9">
                                <Form.ControlLabel>password</Form.ControlLabel>
                                    <InputGroup inside>
                                        <Form.Control name="password" type={visible ? 'text' : 'password'} />
                                        <InputGroup.Button onClick={handleChange}>
                                            {visible ? <EyeIcon /> : <EyeSlashIcon />}
                                        </InputGroup.Button>
                                    </InputGroup>
                                    <Form.HelpText>Required</Form.HelpText>
                                </Form.Group>

                                <Form.Group controlId="name-9">
                                    <Form.ControlLabel>balance</Form.ControlLabel>
                                    <Form.Control type='number' name="balance" />
                                    <Form.HelpText>Required</Form.HelpText>
                                </Form.Group>
                            </> : ''
                        }
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
 
export default Patient;