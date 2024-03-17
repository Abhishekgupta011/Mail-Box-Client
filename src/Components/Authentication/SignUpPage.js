import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../Redux/Slices/AuthSlice";
import { Form, Button, FloatingLabel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SignUpPage.css"; // Import your custom CSS file
import { useNavigate } from "react-router";

const SignUpPage = () => {
    const dispatch = useDispatch();
    //const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const isLogin = useSelector(state => state.auth.isLogin);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cPassword, setCpassword] = useState("");
    const [loading, setLoading] = useState(false);
    const storedToken = localStorage.getItem("idToken");
    const [token , setToken] = useState(storedToken)
    const navigate = useNavigate();
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
                    if(isLogin){
                        dispatch(authActions.login(responseData.idToken));
                        localStorage.setItem("email" , email);
                        localStorage.setItem("idToken" , responseData.idToken);
                        setToken(responseData.idToken);
                        dispatch(authActions.login());
                        navigate('/navbar')
                    }   
                } else {
                    alert(responseData.error.message || 'Authentication failed');
                }
            } catch (error) {
                console.error('An error occurred during authentication', error);
            } finally {
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
        <div className="container d-flex align-items-center justify-content-center vh-100 ">
            <div className="row justify-content-center ">
                <div className="col-8 border p-4">
                    <div className="form-group">
                        <h2>{isLogin ? 'Login' : 'SignUp'}</h2>
                    </div> <br/>
                    <Form onSubmit={formSubmitHandler}>
                        <Form.Group controlId="email">
                            <FloatingLabel
                            controlId="floatingInput"
                            label="Email address"
                            >
                            <Form.Control 
                                type="email" 
                                value={email} 
                                onChange={emailInputHandler} 
                                required 
                                placeholder="Email address"
                                
                            
                            />
                            </FloatingLabel>
                            <br/>
                        </Form.Group>
                        
                        <Form.Group controlId="password">
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Password"
                            >
                            <Form.Control 
                                type="password" 
                                placeholder="Password" 
                                onChange={passwordInputHandler}
                                
                            />
                            </FloatingLabel>
                            <br/>
                        </Form.Group>

                        {!isLogin && 
                            <Form.Group controlId="cpassword">
                            <FloatingLabel
                            controlId="floatingInput"
                            label="Confirm Password"
                            >
                                <Form.Control 
                                    type="password" 
                                    value={cPassword} 
                                    onChange={cPasswordInputHandler} 
                                    required 
                                    placeholder="Confirm Password" 
                                    
                                />
                                </FloatingLabel>
                            </Form.Group>
                        }
                        
                        {!isLogin && cPassword.length>5 && password !== cPassword && (
                            <div style={{ color: 'red' }}>Passwords do not match</div>
                            )}<br/>
                        <Button type="submit" disabled={loading} variant="primary" className="mb-3 col-12 rounded-5" >
                            {loading ? (
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : (
                                isLogin ? "Login" : "Sign-Up"
                            )}
                        </Button>
                        <br/>
                        {isLogin && <span className="forgot">Forgotten Password?</span>}
                    </Form>
                    </div>
                    
                    <div className="toggle mt-3 " >
                        <Button 
                            type="button"
                            onClick={() => dispatch(authActions.setIsLogin(!isLogin))}
                            className="border border-1 border-black rounded-0 " 
                        >
                            {isLogin ? "Create New Account? Sign Up" : "Have an account? Login"}
                        </Button>
                    </div>
                
            </div>
        </div>
    )
};

export default SignUpPage;
