import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import EmailInterface from './EmailInterface'; // Assuming EmailInterface is the component containing the inbox logic
import { Provider } from 'react-redux';
import store from '../Redux/Store/Store';
import { Router } from 'react-router';
import configureStore from 'redux-mock-store';

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
    const { getByTestId } = render( // Corrected here
      <Provider store={store}>
        <Router>
          <EmailInterface />
        </Router>
      </Provider>
    );
    const blueDot = getByTestId('blue-dot');
    expect(blueDot).toBeInTheDocument();
  });

  // Mock the Redux store
  const mockStore = configureStore([]);

  describe('EmailInterface component', () => {
    let store;

    beforeEach(() => {
      store = mockStore({
        emailInterface: {
          sentEmails: [],
          inboxEmails: [],
          unreadMessages: 0,
          displaySent: false,
          selectedEmailId: null,
          selectedMailIdToDelete: null,
        },
      });
    });

    test('deletes an email when delete button is clicked', async () => {
      const { getByTestId } = render( // Corrected here
        <Provider store={store}>
          <Router>
            <EmailInterface />
          </Router>
        </Provider>
      );

      // Simulate clicking on the delete button
      fireEvent.click(getByTestId('delete-mail-button'));

      // You might want to wait for the deletion process to finish
      await waitFor(() => {
        expect(store.getActions()).toEqual([
          {
            type: 'emailInterface/setSelectedMailIdToDelete',
            payload: 'mailId', // Provide the id of the mail you want to delete
          },
          // Add more expected actions if necessary
        ]);
      });
    });
  });
});
