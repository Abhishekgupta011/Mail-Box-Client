import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SignUpPage from './SignUpPage';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter and use it as Router
import userEvent from '@testing-library/user-event';
const mockStore = configureStore([]);

describe('SignUpPage component', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      auth: {
        isLoggedIn: false,
        isLogin: false,
      },
    });
  });

  test('renders correctly', () => {
    render(
      <Provider store={store}>
        <Router> {/* Wrap SignUpPage with Router */}
          <SignUpPage />
        </Router>
      </Provider>
    );

    expect(screen.getByText(/SignUp/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^Confirm Password$/i)).toBeInTheDocument();
  });

  test('displays error message when passwords do not match', async () => {
    render(
      <Provider store={store}>
        <Router> {/* Wrap SignUpPage with Router */}
          <SignUpPage />
        </Router>
      </Provider>
    )
    
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const cPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /sign-up/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(cPasswordInput, { target: { value: 'password456' } });
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  test('submits form successfully with valid inputs', async () => {
    render(
      <Provider store={store}>
        <Router> {/* Wrap SignUpPage with Router */}
          <SignUpPage />
        </Router>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const cPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByRole('button', { name: /sign-up/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(cPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);
    });
  });

  test('renders login form', () => {
    render(
      <Provider store={store}>
        <Router> {/* Wrap SignUpPage with Router */}
          <SignUpPage />
        </Router>
      </Provider>
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });
  test('login with valid credentials', async () => {
     render(
      <Provider store={store}>
      <Router>
        <SignUpPage />
      </Router>
      </Provider>
    );
  
    const emailInput = screen.getByLabelText(/Email address/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByText(/Login/i);
  
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
  
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(store.getActions()).toContainEqual({
        type: 'auth/setIsLogin',
        payload: true, // Assuming login action returns a token
      });
    });
  });
   
});
