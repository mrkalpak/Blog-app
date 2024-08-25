import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import PostForm from './PostForm';

// Mock axios for API calls
jest.mock('axios');

describe('PostForm Component', () => {
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <PostForm />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders correctly with form elements', () => {
    renderComponent();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Content')).toBeInTheDocument();
    expect(screen.getByLabelText('Image')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('handles input changes', () => {
    renderComponent();
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText('Content'), { target: { value: 'Test Content' } });

    expect(screen.getByLabelText('Title')).toHaveValue('Test Title');
    expect(screen.getByLabelText('Content')).toHaveValue('Test Content');
  });

  test('submits the form with correct data', async () => {
    const formDataMock = new FormData();
    formDataMock.append('title', 'Test Title');
    formDataMock.append('content', 'Test Content');

    axios.post.mockResolvedValue({});

    renderComponent();

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText('Content'), { target: { value: 'Test Content' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/api/posts/`,
        expect.any(FormData),
        { headers: { Authorization: `Bearer fake-token` } }
      );
    });
  });

  test('redirects to login if token is missing', () => {
    localStorage.removeItem('token');
    renderComponent();

    expect(screen.getByText('Redirecting...')).toBeInTheDocument();
  });

  test('handles submission error', async () => {
    axios.post.mockRejectedValue(new Error('Submission failed'));

    renderComponent();

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText('Content'), { target: { value: 'Test Content' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Submit')).toBeInTheDocument();
      expect(axios.post).toHaveBeenCalled();
    });
  });
});
