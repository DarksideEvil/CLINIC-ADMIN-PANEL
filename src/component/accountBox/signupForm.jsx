import { useContext } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  LineText,
  SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from './accountContext';
import URL from '../../config';
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SignupForm(props) {

  const { switchToSignin } = useContext(AccountContext);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('admin');
  const [user, setUser] = useState({
    fullname: '',
    email: '',
    password: '',
    role: ''
  });

  const changeHandler = (e) => {
    setUser({...user, [e.target.name] : e.target.value});
  }

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      user.role = selectedOption;
      const success = await axios.post(`${URL}/owners`, user);
      if (success.status === 201) {
        localStorage.setItem('user', JSON.stringify(success?.data?.token));
        navigate('/home');
      }
    } catch (err) {alert(err?.response?.data?.message);}
  }

  return (
    <BoxContainer>
      <FormContainer onSubmit={submit}>
        <div className="radios_place">
            <div className="form-check">
              <input className="form-check-input" type="radio" name="flexRadioDefault" 
              id="flexRadioDefault1" value='admin'
              onChange={handleOptionChange} checked={selectedOption === 'admin'} />
              <label className="form-check-label" htmlFor="flexRadioDefault1">admin</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" value='boss'
              onChange={handleOptionChange} checked={selectedOption === 'boss'}
              type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
              <label className="form-check-label" htmlFor="flexRadioDefault1">boss</label>
            </div>
        </div>
        <Input type="text" name="fullname" value={user.fullname}
        placeholder="FullName" onChange={changeHandler} />
        <Input type="email" name="email" value={user.email}
        placeholder="Email" onChange={changeHandler} />
        <Input type="password" name="password" value={user.password}
        placeholder="Password" onChange={changeHandler} />
        <Marginer direction="vertical" margin={10} />
        <SubmitButton type="submit">Signup</SubmitButton>
      </FormContainer>
      <Marginer direction="vertical" margin="5px" />
      <LineText>
        Already have an account?{" "}
        <BoldLink onClick={switchToSignin} href="#">
          Signin
        </BoldLink>
      </LineText>
    </BoxContainer>
  );
}