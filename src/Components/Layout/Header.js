import React from "react";
import { Container } from "react-bootstrap";

const MailHeader = () => {
  const title = "Mail Box"
  return (
    <div className="bg-primary text-white p-4">
      <Container>
        
          <h2 className="m-0">{title}</h2>
        
      </Container>
    </div>
  );
};

export default MailHeader;
