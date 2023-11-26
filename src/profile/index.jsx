import './profile.css';
import SideBar from '../component/side-bar';
import {
MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText,
MDBCardBody, MDBCardImage, MDBTypography, MDBIcon
} from 'mdb-react-ui-kit';
import { Button } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {

    const token = JSON?.parse(localStorage?.getItem('user'));
    const user = jwtDecode(token);
    const navigate = useNavigate();

    const exit = () => {
        localStorage.clear();
        navigate('/');
    }

    return (
        <div className='profile_wrapper'>
            <div className="row">
                <div className="col-md-2">
                    <SideBar />
                </div>
                <div className="col-md-10">
                    <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
                        <MDBContainer className="py-5 h-100">
                            <MDBRow className="justify-content-center align-items-center h-100">
                            {
                                user ?
                                <MDBCol lg="6" className="mb-4 mb-lg-0">
                                    <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                                        <MDBRow className="g-0">
                                            <MDBCol md="4" className="gradient-custom text-center text-white"
                                            style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                                            <MDBCardImage 
                                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                                alt="Avatar" className="my-5" style={{ width: '80px' }} fluid />
                                            <MDBTypography tag="h5">{user?.fullname}</MDBTypography>
                                            <MDBCardText>{user?.role}</MDBCardText>
                                            <MDBIcon far icon="edit mb-5" />
                                            </MDBCol>
                                            <MDBCol md="8">
                                            <MDBCardBody className="p-4">
                                                <MDBTypography tag="h6">Information</MDBTypography>
                                                <hr className="mt-0 mb-4" />
                                                <MDBRow className="pt-1">
                                                <MDBCol size="6" className="mb-3">
                                                    <MDBTypography tag="h6">Email</MDBTypography>
                                                    <MDBCardText className="text-muted">{user?.email}</MDBCardText>
                                                </MDBCol>
                                                <MDBCol size="6" className="mb-3">
                                                    <MDBTypography tag="h6">id</MDBTypography>
                                                    <MDBCardText className="text-muted">({user?._id})</MDBCardText>
                                                </MDBCol>
                                                </MDBRow>

                                                <Button onClick={() => exit()} size='lg' appearance="subtle">Logout</Button>
                                            </MDBCardBody>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBCard>
                                </MDBCol> : 'first sign up/in'
                            }
                            </MDBRow>
                        </MDBContainer>
                    </section>
                </div>
            </div>
        </div>
    );
}
 
export default Profile;