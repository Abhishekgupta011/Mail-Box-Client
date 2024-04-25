import React from "react";
import { Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Redux/Slices/AuthSlice";
import { useNavigate } from "react-router";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import './Header.css'
const MailHeader = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = () => {
    dispatch(authActions.logout());
    
    navigate("/");
  };
  const title = "Mail Box";
  return (
    <div className="header text-black pt-1 pb-3">
      <Container className=" header-container d-flex justify-content-between align-items-center ">
      <div className="email-outline d-flex justify-content-between align-items-center ">
        <EmailOutlinedIcon style={{ fontSize:"68px"}}/>
        <h2 style={{marginLeft: '10px'}}>{title}</h2>
      </div>
        
        {isLoggedIn && <Button onClick={logoutHandler} variant="secondary">Logout</Button>}
      </Container>
    </div>
  );
};

export default MailHeader;
