import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, FormControl, InputGroup, Nav, Badge } from 'react-bootstrap';
import './EmailInterface.css';
import {  useNavigate } from 'react-router-dom';
import EmailPage from './EmailPage';
import ComposeModal from './ComposeModal';
import InboxIcon from '@mui/icons-material/Inbox';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
const EmailInterface = () => {
    const [sentEmails, setSentEmails] = useState([]);
    const [inboxEmails, setInboxEmails] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState(0); // Track the number of unread messages
    const [displaySent, setDisplaySent] = useState(false); // Track whether to display sent emails or inbox emails
    const [activeLink, setActiveLink] = useState('inbox');
    const [showModal, setShowModal] = useState(false);
      const [selectedEmailId, setSelectedEmailId] = useState(null);
    // const navigate = useNavigate();
    const firebaseUrl = 'https://mbc-project-fd64b-default-rtdb.firebaseio.com';

    // const redirectMailbox = () => {
    //     navigate('/mailbox');
    // };

    useEffect(() => {
        const hash = window.location.hash;
        if (hash === '#sent') {
            handleSentClick();
        } else {
            handleInboxClick();
        }
    }, []);

    const fetchEmails = async () => {
        try {
            const response = await fetch(`${firebaseUrl}/mail.json`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
               // alert('Your emails have been fetched successfully!');
                const data = await response.json();
                const emailIds = Object.keys(data);
                const emails = emailIds.map(id => ({ id, ...data[id] }));
                const userEmail = localStorage.getItem('email');
                const inbox = emails.filter((email) => email.ReceiverMails.includes(userEmail));
                const sent = emails.filter((email) => email.SenderMail === userEmail)
                const unread = inbox.filter((email) => !email.read); // Filter unread messages
                setSentEmails(sent);
                setInboxEmails(inbox);
                setUnreadMessages(unread.length); // Set the number of unread messages
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSentClick = () => {
        fetchEmails(); // Fetch sent emails
        setDisplaySent(true); // Set the flag to display sent emails
        setActiveLink(activeLink);
        setSelectedEmailId(null)
    };

    const handleInboxClick = () => {
        fetchEmails(); // Fetch inbox emails
        setDisplaySent(false); // Set the flag to display inbox emails
        setActiveLink(activeLink); // Remove focus from inbox tab
        setSelectedEmailId(null)
    };

    const handleEmailClick = async (emailId) => {
        setSelectedEmailId(emailId);
       navigate(`#inbox/${emailId}`);
        // Code to mark email as read...
        const emailToUpdate = inboxEmails.find((email) => email.id === emailId);
    
        if (!emailToUpdate) {
            console.error('Email not found'); // Log error instead of throwing
            return; // Exit function early
        }
        console.log(emailToUpdate)
        // Mark the email as read
        let updatedEmail = { ...emailToUpdate, read: true };
        console.log(updatedEmail);
    try {
        // Find the email to update
        
        // Send a PUT request with the updated email data
        const response = await fetch(`${firebaseUrl}/mail/${emailId}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEmail),
        });

        if (response.ok) {
            // Update the inbox emails state with the updated email
            const updatedInbox = inboxEmails.map((email) =>
                email.id === emailId ? { ...email, read: true } : email
            );
            setInboxEmails(updatedInbox);
            // Update unread messages count
            const unread = updatedInbox.filter((email) => !email.read);
            setUnreadMessages(unread.length);
            console.log('Marked as Read');
        } else {
            console.error('Failed to mark email as read'); // Log error
            alert('Failed to mark email as read. Please try again.'); // Notify user
        }
    } catch (error) {
        console.error(error); // Log any caught errors
        alert('An error occurred while marking the email as read. Please try again.'); // Notify user
    }
    };

    useEffect(() => {
        handleInboxClick(); // Fetch emails on component mount
    }, []);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
return (
<div className='inbox '>
<Container fluid className="h-100 ">
    <Row className="h-100">
        {/* Sidebar */}
        <Col sm={4} md={3} lg={2} className="bg-grey p-4">
            <Button
                variant="primary"
                className="compose-button text-black rounded-0 mb-3"
                style={{ width: '100%' }}
                onClick={openModal}
            >
                Compose
            </Button>

            <Nav className="flex-column">
                <Nav.Link href="#inbox" 
                className={`mb-1 px-2 d-flex justify-content-between ${activeLink === 'inbox' ? 'focused' : ''}`} 
                onClick={handleInboxClick}>
                    <div className='d-flex align-items-center'>
                    <InboxIcon className='nav-icons' style={{marginRight: '9%'}}/>
                    Inbox
                    </div>
                    
                    {unreadMessages > 0 && <span className="ml-1 text-black">{unreadMessages}</span>}
                </Nav.Link>
                <Nav.Link href="#starred" className="mb-1 px-2"> 
                <div className='d-flex align-items-center'>
                    <StarBorderIcon className='nav-icons' style={{marginRight: '8%'}}/>
                    Starred
                    </div></Nav.Link>
                <Nav.Link href="#sent" className={`b-1 px-2 ${activeLink === 'inbox' ? 'focused' : ''}`} onClick={handleSentClick}>
                <div className='d-flex align-items-center'>
                    <SendOutlinedIcon className='nav-icons' style={{marginRight: '9%'}}/>
                    Sent
                    </div>
                </Nav.Link>
                <Nav.Link href="#draft" className="mb-1 px-2"> 
                <div className='d-flex align-items-center'>
                    <FileOpenOutlinedIcon className='nav-icons' style={{marginRight: '8%'}}/>
                    Drafts
                    </div></Nav.Link>
            </Nav>
        </Col>

        {/* Email List */}
        <Col sm={8} md={9} lg={9} xl={10} className=" bg-grey p-4 search mr-1">
            <div className="bg-white ">
                <div className="border-bottom">
                    {/* Search and sort row */}
                    <Row className="pb-3">
                        <Col>
                            <InputGroup>
                                <FormControl placeholder="Search emails" />
                            </InputGroup>
                        </Col>
                        <Col>
                            <Form.Control
                                as="select"
                                className="pb-1 bg-white border-2 border-gray-200 rounded-md ml-3"
                            >
                                <option>Sort by</option>
                                <option>Date</option>
                                <option>Sender</option>
                            </Form.Control>
                        </Col>
                    </Row>

                    {/* Email items */}
                    <div className="max-h-96 overflow-y-auto">
                        {/* Render sent or inbox emails based on the flag */}
                        {selectedEmailId ? (<EmailPage emailid={selectedEmailId}/>):
                        (displaySent ? (
                            sentEmails.map((email) => (
                                <div
                                    key={email.id}
                                    className="email-entry p-2 cursor-pointer border-bottom"
                                    onClick={() => handleEmailClick(email.id)}
                                >
                                    <span className="font-bold">To: {email.ReceiverMails}</span> -{' '}
                                    <span>{email.subject}</span>
                                    {email.read ? null : (
                                        <span className="ml-2 badge badge-primary text-black">New</span>
                                    )}
                                </div>
                            ))
                        ) : (
                            inboxEmails.map((email) => (
                                <div
                                    key={email.id}
                                    className={`p-2 cursor-pointer border-bottom
                                        d-flex justify-content-between inbox-email 
                                        ${email.read ? 'email-entry' : 'email-border'}`}
                                    onClick={() => handleEmailClick(email.id )}
                                    >
                                    
                                        <span className={` email ${!email.read ? 'bold' : ''}`}>
                                        {email.read ? null : (
                                            <span variant="primary" className=" badge mr-2" data-testid='blue-dot'> </span>
                                        )}{" "}
                                        {email.SenderMail}
                                        </span>  
                                        <div className={`${!email.read ? 'bold' : ''} sub`}>
                                            <span className={`${!email.read ? 'bold' : ''} sub`}>{email.subject}</span>
                                            {" - "} 
                                            <span className="textcontent">{email.textContent}</span>
                                        </div>                                            
                                        <span className={`${!email.read ? 'bold' : ''}`}>{email.currentTime}</span>
                                    </div>
                                    
                            )))
                        )}
                    </div>
                </div>
            </div>
        </Col>
    </Row>
</Container>
{showModal && (
        <ComposeModal onClose={closeModal} />
      )}
</div>
);
};

export default EmailInterface;
