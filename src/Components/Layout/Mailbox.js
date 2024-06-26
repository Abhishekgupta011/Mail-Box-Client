import React, { useState, useCallback } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import useMailboxApi from "./CustomHooks/useMailBoxApi";

const Mailbox = () => {
  const [to, setTo] = useState("");
  const [cc, setCC] = useState("");
  const [bcc, setBCC] = useState("");
  const [subject, setSubject] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [showNewInput, setShowNewInput] = useState(false);
  const [showCcBtn, setShowCcBtn] = useState(false);
  const [showBccBtn, setShowBccBtn] = useState(false);
  const [disappearCc, setDisappearCc] = useState(true);
  const [disappearBcc, setDisappearBcc] = useState(true);
  const { isLoading, error, sendEmail } = useMailboxApi();
  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleSendMail = useCallback(async () => {
    try {
      if (isLoading) {
        return;
      }
      const emailContent = convertToRaw(editorState.getCurrentContent());
      const textContent = emailContent.blocks.map((block) => block.text).join("\n");
      console.log("Sending email to:", to);
      console.log("CC:", cc);
      console.log("BCC:", bcc);
      console.log("Subject:", subject);
      console.log("Email content:", textContent);
      console.log("Email content:", emailContent);
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true , hour: '2-digit', minute: '2-digit' });
      console.log("Sent Time:", currentTime);
      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(to)) {
        alert("Please enter a valid email address in 'To' field");
        return;
      }
      // Additional validation for CC and BCC fields if required

      const emailData = {
        SenderMail: localStorage.getItem('email'),
        ReceiverMails: `${to}`,
        ...(cc.trim() !== "" && { cc }),
        ...(bcc.trim() !== "" && { bcc }),         
        subject,
        textContent,
        read: false,
        currentTime: new Date().toLocaleTimeString('en-US', { hour12: true , hour: '2-digit', minute: '2-digit' })
      };

      // Call sendEmail function from custom hook
      await sendEmail(emailData);
    } catch (error) {
      // Set error state if there's an error
      console.error("Error sending email:", error);
    }
  }, [to , cc , bcc , subject ,editorState, sendEmail ]);


  const convertValueCc = () => {
    setShowCcBtn(true);
    setDisappearCc(false);
  };

  const convertValueBcc = () => {
    setShowBccBtn(true);
    setDisappearBcc(false);
  };

  const handleRecipientClick = () => {
    setShowNewInput(true);
    // setDisappearCc(false);
    // setDisappearBcc(false);

  };
  const notShowRecipients =()=>{
    setShowNewInput(false)
    // setDisappearCc(false);
    // setDisappearBcc(false);
  }
  return (
    <Container>
      <Form>
        {showNewInput && (
            <Form.Group controlId="new" className="d-flex align-items-center">
            <Form.Label className="mb-0 mr-2">From</Form.Label>
            <Form.Control
                type="email"
                placeholder="Enter your email"
                value={localStorage.getItem("email")}
                onChange={(e) => setTo(e.target.value)}
                className="border-0"
            />
            </Form.Group>
        )}
        <Form.Group controlId="to" className="d-flex align-items-center">
        {showNewInput && <Form.Label className="mb-0 mr-2">To</Form.Label>}
          <Form.Control
            type="email"
            placeholder={showNewInput ? " " : "Recipients"}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            onClick={handleRecipientClick}
            className="border-0 border-bottom rounded-0 "
          />
          {showNewInput && disappearCc && (
            <Button 
            variant="primary" 
            onClick={convertValueCc}
            className="bg-transparent text-dark border-0 ">
              Cc
            </Button>
          )}
          {showNewInput && disappearBcc && (
            <Button 
            variant="primary" 
            onClick={convertValueBcc}
            className="bg-transparent text-dark border-0 ">
              Bcc
            </Button>
          )}
        </Form.Group>
            <br/>
        <Form.Group controlId="cc" className="d-flex align-items-center">
          {showNewInput && showCcBtn && (
            <>
            <Form.Label className="mb-0 mr-2">Cc</Form.Label>
            <Form.Control
              type="text"
              value={cc}
              onChange={(e) => setCC(e.target.value)}
              className="border-0 rounded-0"
            />
            </>
          )}
        </Form.Group>

        <Form.Group controlId="bcc" className="d-flex align-items-center">
          {showNewInput && showBccBtn && (
            <>
            <Form.Label className="mb-0 mr-2">Bcc</Form.Label>
            <Form.Control
            type="text"
            value={bcc}
            onChange={(e) => setBCC(e.target.value)}
            className="border-0 rounded-0"
            />
        </>
            
          )}
        </Form.Group>

        <Form.Group controlId="subject">
          <Form.Control
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            onClick={notShowRecipients}
            className="border-0 border-bottom rounded-0"
          />
        </Form.Group>
        <br/>
        <Form.Group controlId="emailContent">
          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChange}
          />
        </Form.Group>

        {isLoading ? (
          <Button variant="primary" disabled>
            <Spinner animation="border" size="sm" />
            Sending...
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSendMail}>
            Send
          </Button>
        )}
      </Form>
    </Container>
  );
};

export default Mailbox;