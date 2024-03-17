import React, { useState, useCallback } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Container, Form, Button } from "react-bootstrap";

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

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const sendEmail = useCallback(async () => {
    const emailContent = convertToRaw(editorState.getCurrentContent());
    const textContent = emailContent.blocks.map((block) => block.text).join("\n");
    console.log("Sending email to:", to);
    console.log("CC:", cc);
    console.log("BCC:", bcc);
    console.log("Subject:", subject);
    console.log("Email content:", textContent);
    console.log("Email content:", emailContent);
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      alert("Please enter a valid email address in 'To' field");
      return;
    }
    // Additional validation for CC and BCC fields if required

    try {
      const fetchData = await fetch("https://crudcrud.com/api/ec8eba03ed84445b9d6179905d3ab2a9/mail", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
            SenderMail : localStorage.getItem('email'),
            ReceiverMails : `${to}`,
            ...(cc.trim() !== "" && { cc }),
            ...(bcc.trim() !== "" && { bcc }),         
            subject,
            textContent,
        }),
      });

      if (fetchData.ok) {
        alert("Your mail has been sent successfully");
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again later.");
    }
   }, [to , cc , bcc , subject ,editorState]);

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
      <h1 className="mb-4">New Email</h1>
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

        <Button variant="primary" onClick={sendEmail}>
          Send
        </Button>
      </Form>
    </Container>
  );
};

export default Mailbox;
