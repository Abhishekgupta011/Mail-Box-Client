import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Redux/Slices/AuthSlice";
const SignUpPage = () => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const isLogin = useSelector(state=>state.auth.isLogin);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCpassword] = useState("");
    const [loading, setLoading] = useState(false);
    const storedToken = localStorage.getItem("idToken");
    const [token , setToken] = useState(storedToken)

    const emailInputHandler = (event) => {
        setEmail(event.target.value);
    }

    const passwordInputHandler = (event) => {
        setPassword(event.target.value);
    }

    const cPasswordInputHandler = (event) => {
        setCpassword(event.target.value);
    }

    let formSubmitHandler = async (event) => {
        event.preventDefault();
        if (!isLogin && password !== cPassword) {
            alert("Passwords do not match");
            return;
        } else {
            try {
                setLoading(true);
                const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${isLogin ? 'signInWithPassword' : 'signUp'}?key=AIzaSyCdWb-Hhul7dXAXB_TLPvzYurC29mEmV6Y`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        returnSecureToken: true,
                    }),
                })
                const responseData = await response.json()
                if (response.ok) {
                    console.log(`${isLogin ? 'Login' : 'Sign-Up'} successful`, 'success');
                    //console.log(responseData);
                    if(isLogin){
                    dispatch(authActions.login(responseData.idToken));
                    localStorage.setItem("email" , email);
                    localStorage.setItem("idToken" , responseData.idToken);
                    setToken(responseData.idToken);
                    dispatch(authActions.login());
                    
                    }   
                } else {
                    alert(responseData.error.message || 'Authentication failed');
                }
            } catch (error) {
                console.error('An error occurred during authentication', error);
            }finally {
                setLoading(false); // Set loading to false after the API call is completed
            }
        }
    }
    useEffect(() => {
        
        if (token) {
          localStorage.setItem("idToken", token);
        } else {
          localStorage.removeItem("idToken");
        }
      }, [token]);
    return (
        <>
            <div className="form-div">
            <div className="main">
            <span className="l1">SignUp</span><br/>
            </div>
            <form onSubmit={formSubmitHandler} className="form-container">
                <div >
                    <label htmlFor="email">Email</label>
                    <input 
                    type="email" 
                    id="email" 
                    value={email} 
                    onChange={emailInputHandler} 
                    required 
                    placeholder="User Email" />
                    <label htmlFor="password">Password</label>
                    <input 
                    type="password"
                    id="password" 
                    className="password"
                    placeholder="Password" 
                    onChange={passwordInputHandler}/>    
                    {!isLogin && <label htmlFor="cpassword">Confirm Password</label>}
                    {!isLogin && <input 
                    type="password" 
                    id="cpassword" 
                    value={cPassword} 
                    onChange={cPasswordInputHandler} 
                    required 
                    placeholder="Confirm Password" />}
                    <button type="submit" disabled={loading}>
                            {loading ? (
                                <div className="loader-container">
                                    <div className="loader"></div>
                                </div>
                            ) : (
                                isLogin ? "Login" : "Sign-Up"
                            )}
                        </button>
                    {isLogin && <span className="forgot">Forgotten Password?</span>}
                </div>
                <div className="toggle">
                    <button type="button"
                        onClick={() => dispatch(authActions.setIsLogin(!isLogin))}
                        className="toggle-button"
                    >{isLogin ? "Create New Account? Sign Up" : "Have an account? Login"}</button>
                </div>
            </form></div>
           
            
        </>
    )
};

export default SignUpPage;