import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, FormControl, InputGroup, Nav } from 'react-bootstrap';
import './EmailInterface.css';
import { useNavigate } from 'react-router';

const EmailInterface = () => {
    const [sentEmails, setSentEmails] = useState([]);
    const [inboxEmails, setInboxEmails] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState(0); // Track the number of unread messages
    const [displaySent, setDisplaySent] = useState(false); // Track whether to display sent emails or inbox emails
    const navigate = useNavigate();
    const crudurl = 'https://crudcrud.com/api/11eb61c2593d46058b53db60cfb6d9c5'

    const redirectMailbox = () => {
        navigate('/mailbox');
    };

    const fetchEmails = async () => {
        try {
            const response = await fetch(`${crudurl}/mail`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                alert('Your emails have been fetched successfully!');
                const data = await response.json();
                const userEmail = localStorage.getItem('email');
                const inbox = data.filter((email) => email.ReceiverMails.includes(userEmail));
                const sent = data.filter((email) => email.SenderMail === userEmail)
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
    };

    const handleInboxClick = () => {
        fetchEmails(); // Fetch inbox emails
        setDisplaySent(false); // Set the flag to display inbox emails
    };

    const handleEmailClick = async (emailId) => {
        try {
            // Find the email to update
            const emailToUpdate = inboxEmails.find((email) => email._id === emailId);

            if (!emailToUpdate) {
                throw new Error('Email not found');
            }

            // Mark the email as read
            const updatedInbox = inboxEmails.map((email) =>
                email._id === emailId ? { ...email, read: true } : email
            );
            setInboxEmails(updatedInbox);

            // Update unread messages count
            const unread = updatedInbox.filter((email) => !email.read);
            setUnreadMessages(unread.length);
            const response = await fetch(`${crudurl}/mail`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...emailToUpdate , read: true }),
            });
            if(response.ok) {
                alert('Marked as Read');
            } else {
                throw new Error('Failed to mark email as read');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEmails(); // Fetch emails on component mount
    }, []);

    return (
        <div>
            <Container fluid className="h-100">
                <Row className="h-100">
                    {/* Sidebar */}
                    <Col sm={4} md={3} lg={2} className="bg-grey p-4">
                        <Button
                            variant="primary"
                            className="px-5 py-1 text-white rounded-0 mb-3"
                            style={{ width: '100%' }}
                            onClick={redirectMailbox}
                        >
                            Compose
                        </Button>

                        <Nav className="flex-column">
                            <Nav.Item className="mb-1 px-2" style={{ height: '10vwh' }} onClick={handleInboxClick}>
                                Inbox
                                {unreadMessages > 0 && <span className="ml-1 badge badge-primary">{unreadMessages}</span>}
                            </Nav.Item>
                            <Nav.Item className="mb-1 px-2">Unread</Nav.Item>
                            <Nav.Item className="mb-1 px-2">Starred</Nav.Item>
                            <Nav.Item className="mb-1 px-2" onClick={handleSentClick}>
                                Sent
                            </Nav.Item>
                            <Nav.Item className="mb-1 px-2">Drafts</Nav.Item>
                        </Nav>
                    </Col>

                    {/* Email List */}
                    <Col sm={8} md={9} lg={10} className="p-4">
                        <div className="bg-white">
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
                                            className="p-2 bg-white border-2 border-gray-200 rounded-md ml-3"
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
                                    {displaySent ? (
                                        sentEmails.map((email) => (
                                            <div
                                                key={email._id}
                                                className="email-entry p-3 cursor-pointer border-bottom"
                                                onClick={() => handleEmailClick(email._id)}
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
                                                key={email._id}
                                                className="email-entry p-3 cursor-pointer border-bottom"
                                                onClick={() => handleEmailClick(email._id , email.read)}
                                            >
                                                <span className="font-bold">From: {email.SenderMail}</span> -{' '}
                                                <span>{email.subject}</span>
                                                {email.read ? null : (
                                                    <span className="ml-2 badge badge-primary text-black">New</span>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default EmailInterface;
