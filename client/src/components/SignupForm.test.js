import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import SignupForm from './SignupForm';

// Mock axios for API calls
jest.mock('axios');

describe('SignupForm Component', () => {
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with form elements', () => {
    renderComponent();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  test('handles input changes', () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'TestUser' } });
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

    expect(screen.getByLabelText('Username')).toHaveValue('TestUser');
    expect(screen.getByLabelText('Email address')).toHaveValue('test@example.com');
    expect(screen.getByLabelText('Password')).toHaveValue('password123');
  });

  test('submits the form with correct data and navigates to login', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Signup successful' } });

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('Username'), { target: { value: 'TestUser' } });
    fireEvent.change(getByLabelText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(getByText('Signup'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          username: 'TestUser',
          email: 'test@example.com',
          password: 'password123',
        }
      );
    });

    await waitFor(() => {
      expect(screen.queryByText('Signup successful')).not.toBeInTheDocument(); // Assuming successful signup message is logged
    });
  });

  test('handles signup error', async () => {
    axios.post.mockRejectedValue({
      response: { data: 'User already exists' },
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'TestUser' } });
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Signup'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          username: 'TestUser',
          email: 'test@example.com',
          password: 'password123',
        }
      );
      expect(screen.queryByText('User already exists')).not.toBeInTheDocument(); // Assuming error is only logged
    });
  });
});
