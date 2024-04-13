import { Navigate, Route, Routes } from 'react-router';
import './App.css'
import SignUpPage from './Components/Authentication/SignUpPage';
import { useSelector } from 'react-redux';
// import Layout from './Components/Layout/Layout';
//import MailNavbar from './Components/Navbar/Navbar';
import Mailbox from './Components/Layout/Mailbox';
import MailHeader from './Components/Layout/Header';
import EmailInterface from './Components/Layout/EmailInterface';
import EmailPage from './Components/Layout/EmailPage';



function App() {
  return (
    
      <div className="App">
        <Routes>
          <Route path="/" element={<SignUpPage />} />
          <Route path="/navbar/*" element={<>
            <MailHeader />
            <EmailInterface />

          </>} />
          
        </Routes>
      </div>
    
  );
}

export default App;
