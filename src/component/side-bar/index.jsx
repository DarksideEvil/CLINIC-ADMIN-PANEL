import './side-bar.css';
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import React from 'react';
import OperatePeopleIcon from '@rsuite/icons/OperatePeople';
import ListIcon from '@rsuite/icons/List';
import ExitIcon from '@rsuite/icons/Exit';
import { useNavigate } from 'react-router-dom';

const styles = {
    width: 240,
    display: 'inline-table',
    marginRight: 10
  };

const SideBar = () => {

    const [activeKey, setActiveKey] = React.useState('1');
    const [openKeys, setOpenKeys] = React.useState(['3', '4']);
    const [expanded, setExpand] = React.useState(true);
    const navigate = useNavigate();

    const exit = () => {
        localStorage.clear();
        navigate('/');
    }

    const CustomSidenav = ({ appearance, openKeys, expanded, onOpenChange, onExpand, ...navProps }) => {
      return (
        <div style={styles} className='chista'>
          <Sidenav
            appearance={appearance}
            expanded={expanded}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
          >
            <Sidenav.Body>
              <Nav {...navProps}>
                <Nav.Item onClick={() => navigate('/home')} eventKey="1" active icon={<DashboardIcon />}>
                  Dashboard
                </Nav.Item>
                <Nav.Menu eventKey="4" title="Lists" icon={<ListIcon />}>
                  <Nav.Item onClick={() => navigate('/patients')} eventKey="4-1">Patients</Nav.Item>
                  <Nav.Item onClick={() => navigate('/doctors')} eventKey="4-2">Doctors</Nav.Item>
                  <Nav.Item onClick={() => navigate('/jobs')} eventKey="4-3">Jobs</Nav.Item>
                  <Nav.Item onClick={() => navigate('/services')} eventKey="4-4">Services</Nav.Item>
                  <Nav.Item onClick={() => navigate('/transactions')} eventKey="4-5">Transactions</Nav.Item>
                  <Nav.Item onClick={() => navigate('/owners')} eventKey="4-6">Owners</Nav.Item>
                </Nav.Menu>
                  <Nav.Item onClick={() => navigate('/profile')} eventKey="5" icon={<OperatePeopleIcon/>}>
                    Profile
                  </Nav.Item>
                  <Nav.Item onClick={() => exit()} eventKey="6" icon={<ExitIcon />}>
                    Logout
                  </Nav.Item>
              </Nav>
            </Sidenav.Body>
            <Sidenav.Toggle onToggle={onExpand} />
          </Sidenav>
        </div>
      );
    };

    return (
        <>
            <CustomSidenav
                activeKey={activeKey}
                openKeys={openKeys}
                onOpenChange={setOpenKeys}
                onSelect={setActiveKey}
                expanded={expanded}
                onExpand={setExpand}
                appearance="subtle"
            />
        </>
    );
}
 
export default SideBar;