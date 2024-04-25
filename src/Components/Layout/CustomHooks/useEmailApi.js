import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { emailInterfaceActions } from '../../Redux/Slices/EmailInterfaceSlice';

const useEmailApi = (firebaseUrl) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true);
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
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmails();

    // Cleanup function
    return () => {
      // Perform any cleanup if needed
    };
  }, [firebaseUrl, dispatch]);

  return { isLoading, error };
};

export default useEmailApi;
