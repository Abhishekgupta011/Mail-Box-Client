import { Route, Routes } from 'react-router';
import './App.css'
import SignUpPage from './Components/Authentication/SignUpPage';
import { useSelector } from 'react-redux';
import Layout from './Components/Layout/Layout';

function App() {
  const isLoggedIn = useSelector(state=>state.auth)
  return (
    <div className="App">
    <Routes>
      <Route path='/' element={<SignUpPage/>}/>
      {isLoggedIn && <Route path='/layout' element={<Layout/>}/>}
    </Routes>
      
    </div>
  );
}

export default App;
