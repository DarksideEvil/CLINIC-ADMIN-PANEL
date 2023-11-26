import SideBar from '../component/side-bar';
import {Button,
Modal,
IconButton, InputGroup, 
Form, Radio, RadioGroup} from 'rsuite';
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

const Owner = () => {
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
    //gets owner from database
    const [owners, setOwners] = useState([]);
    //for radio
    const [selectedOption, setSelectedOption] = useState('');
    //sends new data 'owner' to database
    const [formValue, setFormValue] = useState({
        fullname: '',
        email: '',
        password: '',
        role: ''
    });
    //saves needed user's id
    const [ownerId, setOwnerId] = useState('');
    //gets signed up/in owner
    const token = JSON?.parse(localStorage?.getItem('user'));
    const user = jwtDecode(token);

    //for password input
    const handleChange = () => {
        setVisible(!visible);
    };

    //for radio selection
    const changeHandle = (e) => {
        setSelectedOption(e);
    }

    //getting owners from database..
    const fetchData = async () => {
        try {
            const owners = await axios.get(`${URL}/owners`,
                {headers: {Authorization: token}}
            );
            setOwners(owners?.data);    
        } catch (err) {alert(err?.response?.data?.message);}
    }
    
    //sending new or edited owner to the database..
    const submit = async (e) => {
        try {
            formValue.role = selectedOption;
            //post request
            if (status === 0) {
                await axios.post(`${URL}/owners`, formValue,
                    {headers: {Authorization: token}}
                );
                setFormValue({
                    fullname: '',
                    email: '',
                    role: '',
                    password: ''
                });
                setRefreshKey(refreshKey + 1);
            } else {
                //put request
                await axios.put(`${URL}/owners/${ownerId}`, formValue,
                    {headers: {Authorization: token}}
                );
                setFormValue({
                    fullname: '',
                    email: '',
                    role: ''
                });
                setRefreshKey(refreshKey + 1);
            }
        } catch (err) {alert(err?.response?.data?.message);}
    }

    //works when clicked edit button..
    const editOwner = (person) => {
        setStatus(1);
        setOwnerId(person?._id);
        setFormValue({
            fullname: person?.fullname,
            email: person?.email,
            role: person?.role
        });
        handleOpen();
    }

    //works when clicked delete button..
    const deleteOwner = async (person) => {
        try {
            if (window.confirm(`you gonna delete mr. "${person?.fullname}" ?!`)) {
                const success = await axios.delete(`${URL}/owners/${person?._id}`,
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
            email: '',
            role: ''
        });
    }

    useEffect(() => {
        fetchData();
    }, [refreshKey]);
    
    return (
        <div className='owner_wrapper'>
            <div className="row">
                <div className="col-md-2">
                    <SideBar />
                </div>
                <div className="col-md-10 work_place">
                    <div className="header_txt_place">
                        <h2>Owners</h2>
                    </div>
                    <TableContainer component={Paper} style={{ height: 350, width: '80%' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell width={20}>id</TableCell>
                                <TableCell width={70}>fullname</TableCell>
                                <TableCell width={70}>email</TableCell>
                                <TableCell width={50}>role</TableCell>
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
                                {owners?.map((owner, i) => (
                                    <TableRow
                                    key={i}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell width={20} align="left">{i}</TableCell>
                                        <TableCell width={70} component="th" scope="row">
                                            {owner?.fullname}
                                        </TableCell>
                                        <TableCell width={70} align="left">{owner?.email}</TableCell>
                                        <TableCell width={50} align="left">{owner?.role}</TableCell>

                                        {
                                            user?.role === 'admin' ?
                                            <>
                                                <TableCell width={50} align="center">
                                                    <IconButton onClick={() => editOwner(owner)}
                                                    icon={<EditIcon />}>Edit</IconButton>
                                                </TableCell>
                                                <TableCell width={50} align="center">
                                                    <IconButton onClick={() => deleteOwner(owner)}
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
                        status === 0 ? 'NEW ADMIN/BOSS' : 'EDIT ADMIN/BOSS'
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
                        <Form.Group controlId="email-9">
                            <Form.ControlLabel>email</Form.ControlLabel>
                            <Form.Control name="email" type="email" />
                            <Form.HelpText>Required</Form.HelpText>
                        </Form.Group>
                        {
                            status === 0 ?
                            <Form.Group controlId="password-9">
                                <Form.ControlLabel>password</Form.ControlLabel>
                                    <InputGroup inside>
                                        <Form.Control name="password" type={visible ? 'text' : 'password'} />
                                        <InputGroup.Button onClick={handleChange}>
                                            {visible ? <EyeIcon /> : <EyeSlashIcon />}
                                        </InputGroup.Button>
                                    </InputGroup>
                                    <Form.HelpText>Required</Form.HelpText>
                            </Form.Group> : ''
                        }
                        <Form.Group controlId="radioList">
                            <RadioGroup name="radioList">
                                <Form.ControlLabel>role</Form.ControlLabel>
                                <div className="radios_place">
                                    <Radio onChange={changeHandle} 
                                    value='admin' checked={selectedOption === 'admin'}>Admin</Radio>
                                    <Radio onChange={changeHandle} 
                                    value='boss' checked={selectedOption === 'boss'}>Boss</Radio>
                                </div>
                            </RadioGroup>
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
 
export default Owner;