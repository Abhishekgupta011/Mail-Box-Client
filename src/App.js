import { Route, Routes } from 'react-router';
import './App.css'
import SignUpPage from './Components/Authentication/SignUpPage';
import { useSelector } from 'react-redux';
// import Layout from './Components/Layout/Layout';
import MailNavbar from './Components/Navbar/Navbar';
import Mailbox from './Components/Layout/Mailbox';
import MailHeader from './Components/Layout/Header';
import EmailInterface from './Components/Layout/EmailInterface';


function App() {
  const isLoggedIn = useSelector(state=>state.auth)
  return (
    <div className="App">
    <Routes>
      <Route path='/' element={<SignUpPage/>}/>
      {isLoggedIn && <Route path='/navbar' element={<>
      <MailHeader/>
      
        {/* <MailNavbar/> */}
        <EmailInterface />
        {/* <Routes>
          <Route path='/navbar' element={<EmailInterface/>}/>
        </Routes> */}
      
      </>}/>}
       <Route path='/mailbox' element={<Mailbox/>}/>
    </Routes>
      
    </div>
  );
}

export default App;
