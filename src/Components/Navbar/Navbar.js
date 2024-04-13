import React from "react";
import { Navbar , Nav, NavLink, NavbarBrand, NavbarCollapse, NavbarToggle, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

const MailNavbar = () =>{
   
    return (
        <Navbar bg="light" expand="lg " className="flex-column">
        <NavbarBrand href="/">My Email App</NavbarBrand>
        <NavbarToggle aria-controls="basic-navbar-nav" />
        <NavbarCollapse id="basic-navbar-nav">
          <Nav className="mr-auto flex-column">
          <Button variant="primary" onClick={handler}>Compose</Button>
            <NavLink to="/navbar/#inbox">Inbox</NavLink>  
          </Nav>
        </NavbarCollapse>
      </Navbar>
    )
}
export default MailNavbar;