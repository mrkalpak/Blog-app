import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import EditPost from './EditPost';

// Mock axios for API calls
jest.mock('axios');

describe('EditPost Component', () => {
  const renderComponent = () => {
    render(
      <MemoryRouter initialEntries={['/edit/1']}>
        <Routes>
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
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

  test('renders correctly with initial states', () => {
    renderComponent();
    expect(screen.getByText('Edit Post')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveValue('');
    expect(screen.getByLabelText('Content')).toBeInTheDocument();
    expect(screen.getByLabelText('Upload Image')).toBeInTheDocument();
  });

  test('redirects to login if token is missing', () => {
    localStorage.removeItem('token');
    renderComponent();
    expect(screen.getByText('Redirecting...')).toBeInTheDocument();
  });

  test('fetches and displays post data', async () => {
    axios.get.mockResolvedValue({
      data: {
        title: 'Test Post',
        content: 'Test Content',
        imageUrl: '/images/test.jpg',
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toHaveValue('Test Post');
      expect(screen.getByLabelText('Content')).toHaveTextContent('Test Content');
      expect(screen.getByAltText('Post')).toBeInTheDocument();
    });
  });

  test('handles form submission correctly', async () => {
    axios.put.mockResolvedValue({});

    renderComponent();

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Title' } });
    fireEvent.submit(screen.getByRole('button', { name: /update post/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/api/posts/1`,
        expect.any(FormData),
        expect.any(Object)
      );
    });
  });

  test('shows the image preview when imageUrl is available', async () => {
    axios.get.mockResolvedValue({
      data: {
        title: 'Test Post',
        content: 'Test Content',
        imageUrl: '/images/test.jpg',
      },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByAltText('Post')).toBeInTheDocument();
      expect(screen.getByAltText('Post')).toHaveAttribute('src', `${process.env.REACT_APP_API_URL}/images/test.jpg`);
    });
  });
});
