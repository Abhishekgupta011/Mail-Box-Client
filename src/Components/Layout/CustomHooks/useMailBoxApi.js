import { useState, useEffect } from 'react';

const useMailboxApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendEmail = async (emailData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://mbc-project-fd64b-default-rtdb.firebaseio.com/mail.json", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(emailData),
      });
      if (response.ok) {
        alert("Your mail has been sent successfully");
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, sendEmail };
};

export default useMailboxApi;
