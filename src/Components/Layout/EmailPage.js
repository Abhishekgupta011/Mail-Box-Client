import React, { useState, useEffect } from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './EmailPage.css';
import { Button } from "react-bootstrap";
import ComposeModal from "./ComposeModal";
import ReplyIcon from '@mui/icons-material/Reply';
import ForwardIcon from '@mui/icons-material/Forward';

const EmailPage = ({ emailid }) => {
  const [emailSubject, setEmailSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [senderMail, setSenderMail] = useState("");
  const [receiverMails, setRecieverMails] = useState("");
  const [sentTime , setSentTime] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [showComposeModal, setShowComposeModal] = useState(false); // Add state for modal visibility

  useEffect(() => {
    const fetchEmailSubject = async () => {
      try {
        const response = await fetch(`https://mbc-project-fd64b-default-rtdb.firebaseio.com/mail/${emailid}.json`);
        if (response.ok) {
          const emailData = await response.json();
          setEmailSubject(emailData.subject);
          setRecieverMails(emailData.ReceiverMails);
          setSenderMail(emailData.SenderMail);
          setSentTime(emailData.currentTime);
          setMessageBody(emailData.textContent);
        } else {
          throw new Error("Failed to fetch email data");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmailSubject();
  }, [emailid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const replyHandler = () => {
    // Logic for reply action
  };

  const forwardHandler = () => {
    // Show the ComposeModal
    setShowComposeModal(true);
  };

  const handleCloseComposeModal = () => {
    // Close the ComposeModal
    setShowComposeModal(false);
  };

  return (
    <div className="email-container">
      <h1 className="email-subject">{emailSubject}</h1>
      <div className="email-info">
        <div className="icon-and-mails">
          <div className="icon" >
            <AccountCircleIcon style={{ fontSize: "3rem", color: "grey" }} />
          </div>
          <div>
            <span className="receiver-mail">{senderMail}</span>
          </div>
        </div>
        <div>
          {sentTime}
        </div>   
      </div>
      <div className="email-body-container">
        <span className="email-body">{messageBody}</span>
      </div>
      <div className="buttons-container">
        <Button variant="contained" onClick={replyHandler} className="mail-buttons"><span className="reply"><ReplyIcon /> Reply</span></Button>
        <Button variant="contained" onClick={forwardHandler} className="mail-buttons"><span className="forward"><ForwardIcon /> Forward</span></Button>
      </div>
      {/* Render the ComposeModal if showComposeModal is true */}
      {showComposeModal && <ComposeModal onClose={handleCloseComposeModal} />}
    </div>
  );
};

export default EmailPage;
