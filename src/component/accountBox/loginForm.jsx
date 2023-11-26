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
import { useState } from "react";
import URL from '../../config';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function LoginForm(props) {

  const { switchToSignup } = useContext(AccountContext);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('admin');
  const [user, setUser] = useState({
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
      const success = await axios.post(`${URL}/login/${selectedOption}`, user);
      if (success.status === 200) {
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
            <input className="form-check-input" value='admin'
            onChange={handleOptionChange} checked={selectedOption === 'admin'}
            type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
            <label className="form-check-label" htmlFor="flexRadioDefault1">admin</label>
          </div>
          <div className="form-check">
            <input className="form-check-input" value='boss'
            onChange={handleOptionChange} checked={selectedOption === 'boss'}
            type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
            <label className="form-check-label" htmlFor="flexRadioDefault1">boss</label>
          </div>
        </div>
        <Input onChange={changeHandler} value={user.email}
        type="email" placeholder="Email" name="email" />
        <Input onChange={changeHandler} value={user.password}
        type="password" placeholder="Password" name="password" />
        <Marginer direction="vertical" margin="1.6em" />
        <SubmitButton type="submit">Signin</SubmitButton>
      </FormContainer>
      <Marginer direction="vertical" margin="5px" />
      <LineText>
        Don't have an account?{" "}
        <BoldLink onClick={switchToSignup} href="#">
          Signup
        </BoldLink>
      </LineText>
    </BoxContainer>
  );
}