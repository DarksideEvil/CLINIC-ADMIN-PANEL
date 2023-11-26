import './register.css';
import AccountBox from '../component/accountBox';

const Register = () => {
    return (
        <>
            <div className="register_wrapper">
                <div className="row register_wropper">
                    <div className="col-md-6">
                        <AccountBox />
                    </div>
                </div>
            </div>   
        </>
    );
}
 
export default Register;