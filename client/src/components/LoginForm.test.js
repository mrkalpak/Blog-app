import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import LoginForm from './LoginForm';

// Mock axios for API calls
jest.mock('axios');

describe('LoginForm Component', () => {
  const setToken = jest.fn();
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <LoginForm setToken={setToken} />
      </MemoryRouter>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with initial states', () => {
    renderComponent();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('handles input changes', () => {
    renderComponent();
    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('submits the form and sets token on success', async () => {
    axios.post.mockResolvedValue({
      data: { token: 'fake-token' },
    });

    renderComponent();
    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { email: 'test@example.com', password: 'password123' }
      );
      expect(setToken).toHaveBeenCalledWith('fake-token');
    });
  });

  test('handles login error', async () => {
    axios.post.mockRejectedValue({
      response: { data: 'Invalid credentials' },
    });

    renderComponent();
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { email: 'wrong@example.com', password: 'wrongpassword' }
      );
      expect(setToken).not.toHaveBeenCalled();
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument(); // Since the error is only logged, not displayed
    });
  });
});
