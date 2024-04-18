import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, FormControl, InputGroup, Nav, Table } from 'react-bootstrap';
import './EmailInterface.css';
import { useNavigate } from 'react-router-dom';
import EmailPage from './EmailPage';
import ComposeModal from './ComposeModal';
import InboxIcon from '@mui/icons-material/Inbox';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { emailInterfaceActions } from '../Redux/Slices/EmailInterfaceSlice';

const EmailInterface = () => {
    const { sentEmails, inboxEmails, unreadMessages, displaySent, selectedEmailId } = useSelector((state) => state.emailInterface);
    const [selectedMailIdToDelete , setSelectedMailIdToDelete] = useState(null);
    const dispatch = useDispatch();
    const [activeLink, setActiveLink] = useState('inbox');
    const [showModal, setShowModal] = useState(false); 
    const navigate = useNavigate();
    const firebaseUrl = 'https://mbc-project-fd64b-default-rtdb.firebaseio.com';


    const fetchEmails = async () => {
        try {
            const response = await fetch(`${firebaseUrl}/mail.json`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                const data = await response.json();
                const emailIds = Object.keys(data);
                const emails = emailIds.map(id => ({ id, ...data[id] }));
                const userEmail = localStorage.getItem('email');
                const inbox = emails.filter((email) => email.ReceiverMails.includes(userEmail));
                const sent = emails.filter((email) => email.SenderMail === userEmail)
                const unread = inbox.filter((email) => !email.read); // Filter unread messages
                dispatch(emailInterfaceActions.setSentEmails(sent));
                dispatch(emailInterfaceActions.setInboxEmails(inbox));
                dispatch(emailInterfaceActions.setUnreadMessages(unread.length)); // Set the number of unread messages
            }
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        const handlePathnameChange = () => {
            const pathname = window.location.pathname;
            if (pathname === '/navbar/sent') {
                
                console.log(12)
                handleSentClick();
            } else if (pathname.startsWith(`/navbar/${!displaySent? "inbox" : "sent"}/`)) {
                
                const emailId = pathname.substring(`/navbar/${!displaySent? "inbox" : "sent"}/`.length);
                console.log(123)
                console.log(emailId);
                {!displaySent ? handleEmailClick(emailId): handleSentClick()}
                console.log(!displaySent ? true : false)
            } else if (pathname === '' || pathname === '/navbar/inbox') {
                
                console.log(1234)
                handleInboxClick();
            }
            if (pathname === '/navbar') {
                console.log(12345)
                setActiveLink('inbox');
            }
        };
        handlePathnameChange();
        window.addEventListener('popstate', handlePathnameChange);
        return () => window.removeEventListener('popstate', handlePathnameChange);
    }, []);

   

    const handleSentClick = () => {
        fetchEmails(); // Fetch sent emails
        dispatch(emailInterfaceActions.setDisplaySent(true)); // Set the flag to display sent emails
        setActiveLink('sent');
        dispatch(emailInterfaceActions.setSelectedEmailId(null));
        navigate('/navbar/sent') 
       
    };

    const handleInboxClick = () => {
        fetchEmails(); // Fetch inbox emails
        dispatch(emailInterfaceActions.setDisplaySent(false));  // Set the flag to display inbox emails
        setActiveLink('inbox'); // Remove focus from inbox tab
        dispatch(emailInterfaceActions.setSelectedEmailId(null));
        navigate('/navbar/inbox'); 
    };
    

    const handleEmailClick = async (emailId) => {
        dispatch(emailInterfaceActions.setSelectedEmailId(emailId));
        navigate(`/navbar/${!displaySent ? "inbox":"sent"}/${emailId}`); // Navigate to message page with selected email ID
        const emailToUpdate = inboxEmails.find((email) => email.id === emailId);
    
        if (!emailToUpdate) {
            console.error('Email not found');
            return;
        }
        
        let updatedEmail = { ...emailToUpdate, read: true };
        
        try {
            const response = await fetch(`${firebaseUrl}/mail/${emailId}.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEmail),
            });

            if (response.ok) {
                const updatedInbox = inboxEmails.map((email) =>
                    email.id === emailId ? { ...email, read: true } : email
                );
                dispatch(emailInterfaceActions.setInboxEmails(updatedInbox));
                const unread = updatedInbox.filter((email) => !email.read);
                dispatch(emailInterfaceActions.setUnreadMessages(unread.length));
                console.log('Marked as Read');
            } else {
                console.error('Failed to mark email as read');
                alert('Failed to mark email as read. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred while marking the email as read. Please try again.');
        }
    };

 

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    
    const handleDeleteMail = async (mailID) => {
        try {
            const response = await fetch(`${firebaseUrl}/mail/${mailID}.json`, { 
                method: 'DELETE' 
            });
            if (response.ok) {
                console.log('Deleted mail successfully!')
                const updatedInbox = inboxEmails.filter((email) => email.id !== mailID);
                const updatedSentBox = sentEmails.filter((email) => email.id !== mailID);
                dispatch(emailInterfaceActions.setInboxEmails(updatedInbox));
                dispatch(emailInterfaceActions.setSentEmails(updatedSentBox));
                dispatch(emailInterfaceActions.setSelectedMailIdToDelete(null));
            } else {
                throw new Error('Failed to delete mail');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to delete mail. Please try again.');
        }
    };
    
    const handleCheckboxClick = (mailID) => {
        setSelectedMailIdToDelete(prevState => prevState === mailID ? null : mailID);
        dispatch(emailInterfaceActions.setSelectedEmailId(null));
    };
   
   

    return (
        <div className='inbox '>
            <Container fluid className="h-100 ">
                <Row className="h-100">
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
                            <Nav.Link  className={`mb-1 px-2 d-flex justify-content-between ${activeLink === 'inbox' ? 'focused-inbox' : ''}`} onClick={handleInboxClick}>
                                <div className='d-flex align-items-center'>
                                    <InboxIcon className='nav-icons' style={{ marginRight: '9%' }} />
                                    Inbox
                                </div>
                                {unreadMessages > 0 && <span className="ml-1 text-black">{unreadMessages}</span>}
                            </Nav.Link>
                            <Nav.Link href="#starred" className="mb-1 px-2">
                                <div className='d-flex align-items-center'>
                                    <StarBorderIcon className='nav-icons' style={{ marginRight: '8%' }} />
                                    Starred
                                </div>
                            </Nav.Link>
                            <Nav.Link className={`b-1 px-2 ${activeLink === 'sent' ? 'focused-inbox' : ''}`} onClick={handleSentClick}>
                                <div className='d-flex align-items-center'>
                                    <SendOutlinedIcon className='nav-icons' style={{ marginRight: '9%' }} />
                                    Sent
                                </div>
                            </Nav.Link>
                            <Nav.Link href="#draft" className="mb-1 px-2">
                                <div className='d-flex align-items-center'>
                                    <FileOpenOutlinedIcon className='nav-icons' style={{ marginRight: '8%' }} />
                                    Drafts
                                </div>
                            </Nav.Link>
                        </Nav>
                    </Col>

                    <Col sm={8} md={9} lg={9} xl={10} className="mail-div  search mr-1">
                        <div className="bg-white p-4 ">
                            <div >
                                <Row className="pb-3">
                                    <Col>
                                        <InputGroup>
                                            <FormControl placeholder="Search emails" />
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <Form.Control
                                            as="select"
                                            className="pb-1 bg-white border-2 border-gray-100 rounded-md ml-3"
                                        >
                                            <option>Sort by</option>
                                            <option>Date</option>
                                            <option>Sender</option>
                                        </Form.Control>
                                    </Col>
                                </Row>
                                <div className="max-h-96 overflow-y-auto">
                                    {selectedEmailId ? (
                                        <EmailPage emailid={selectedEmailId} displaySenderMail={!displaySent}/>
                                    ) : (
                                        displaySent ? (
                                            sentEmails.map((email) => (
                                            <div className={`aligning `} key={email.id}>
                                                <Table  className={`checkbox-table m-0`}>
                                                    <tbody>
                                                        <tr>
                                                            <td className={`check-box p-0 read-background`}>
                                                                <input
                                                                    type='checkbox'
                                                                    onChange={(e) => handleCheckboxClick(email.id, e)}
                                                                    checked={selectedMailIdToDelete === email.id}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                                <Table className='m-0'>
                                                    <tbody>
                                                        <tr onClick={() => handleEmailClick(email.id)}>
                                                            <td className={`badge-email p-0 read-background`}>
                                                                <span >
                                                                    <span>&nbsp;&nbsp;</span>
                                                                    {`To: ${email.ReceiverMails}`}
                                                                </span>
                                                            </td>
                                                            <td className={`text-break read-background p-0`}>
                                                                <div className={`content  sub read-background`}>
                                                                    <span className={` sub`}>{email.subject}</span>
                                                                    <span>&nbsp;-</span>
                                                                    <span className={`textcontent`}>{email.textContent}</span>
                                                                </div>
                                                            </td>
                                                            <td className={` p-0 current-time read-background`}>
                                                                <span>{email.currentTime}</span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                                <Table className={`delete-table m-0`}>
                                                    <tbody>
                                                        <tr>
                                                            <td className={`p-0 read-background`}>
                                                                {selectedMailIdToDelete === email.id && (
                                                                    <Button className='delete-icon' onClick={() => handleDeleteMail(email.id)}>
                                                                        <DeleteIcon className='deleteIcon' style={{ fontSize: "18px" , marginBottom: "3px" }} />
                                                                    </Button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>
                                            ))
                                        ) : (
                                            inboxEmails.map((email) => (
                                            <div className={`aligning `} key={email.id}>
                                                <Table  className={`checkbox-table m-0`}>
                                                    <tbody>
                                                        <tr>
                                                            <td className={`check-box p-0 ${email.read ? 'read-background' : ''}`}>
                                                                <input
                                                                    type='checkbox'
                                                                    onChange={(e) => handleCheckboxClick(email.id, e)}
                                                                    checked={selectedMailIdToDelete === email.id}
                                                                />
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                                <Table className='m-0'>
                                                    <tbody>
                                                        <tr onClick={() => handleEmailClick(email.id)}>
                                                            <td className={`badge-email p-0 ${email.read ? 'read-background' : ''}`}>
                                                                <span className={` ${!email.read ? 'bold' : ''} dot-badge`}>
                                                                    {email.read ? null : (
                                                                        <span variant="primary" className=" badge mr-2" data-testid='blue-dot'> </span>
                                                                    )}
                                                                    <span>&nbsp;&nbsp;</span>
                                                                    {email.SenderMail}
                                                                </span>
                                                            </td>
                                                            <td className={`text-break ${email.read ? 'read-background' : ''} p-0`}>
                                                                <div className={`content  ${!email.read ? 'bold' : ''} sub ${email.read ? 'read-background' : ''}`}>
                                                                    <span className={`${!email.read ? 'bold' : ''} sub`}>{email.subject}</span>
                                                                    <span>&nbsp;-</span>
                                                                    <span className={`textcontent`}>{email.textContent}</span>
                                                                </div>
                                                            </td>
                                                            <td className={` p-0 current-time ${!email.read ? 'bold' : ''} ${email.read ? 'read-background' : ''}`}>
                                                                <span>{email.currentTime}</span>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                                <Table className={`delete-table m-0`}>
                                                    <tbody>
                                                        <tr>
                                                            <td className={`p-0 ${email.read ? 'read-background' : ''}`}>
                                                                {selectedMailIdToDelete === email.id && (
                                                                    <Button className='delete-icon' onClick={() => handleDeleteMail(email.id)}>
                                                                        <DeleteIcon className='deleteIcon' style={{ fontSize: "18px" , marginBottom: "5px" }} />
                                                                    </Button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>
                                        ))
                                            ))}
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
