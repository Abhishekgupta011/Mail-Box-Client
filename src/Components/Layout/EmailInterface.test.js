import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import EmailInterface from './EmailInterface'; // Assuming EmailInterface is the component containing the inbox logic
import { Provider } from 'react-redux';
import store from '../Redux/Store/Store';
import { Router } from 'react-router';

describe('Reading Message Components', () => {
  test('Clicking on an Inbox Email Marks it as Read', async () => {
    const { getByText } = render(<EmailInterface />);
    // Assuming there's an email with text 'Test Email' in the inbox
    const email = getByText('Test Email');
    fireEvent.click(email);
    // Wait for the asynchronous update of the email status
    await waitFor(() => {
      expect(email).not.toHaveClass('unread');
    });
  });

  // Write similar tests for other scenarios
});

describe('Inbox Component', () => {
  test('Display Blue Dot for Unread Emails', () => {
    render(
    <Provider store={store}>
        <Router>
        <EmailInterface />
        </Router>
    </Provider>);
    const blueDot = getByTestId('blue-dot');
    expect(blueDot).toBeInTheDocument();
  });

  // Write similar tests for other scenarios
});
