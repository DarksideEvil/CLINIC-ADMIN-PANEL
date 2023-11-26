import { Route, Routes } from "react-router-dom";
import Home from "../home";
import Register from "../registration";
import Service from "../service";
import Doctor from "../doctor";
import Job from "../job";
import Owner from "../owner";
import Patient from "../patient";
import Transaction from "../transaction";
import Profile from "../profile";

const AllRouters = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/services" element={<Service />} />
                <Route path="/doctors" element={<Doctor />} />
                <Route path="/jobs" element={<Job />} />
                <Route path="/owners" element={<Owner />} />
                <Route path="/patients" element={<Patient />} />
                <Route path="/transactions" element={<Transaction />} />
                <Route path="/profile" element={<Profile />} />
            </Routes>
        </>
    );
}
 
export default AllRouters;