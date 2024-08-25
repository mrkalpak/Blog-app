import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MyBlogs from './MyBlogs';

// Mock axios for API calls
jest.mock('axios');

describe('MyBlogs Component', () => {
  const mockPosts = [
    {
      _id: '1',
      title: 'First Post',
      content: '<p>First post content</p>',
      imageUrl: '/images/first.jpg',
    },
    {
      _id: '2',
      title: 'Second Post',
      content: '<p>Second post content</p>',
      imageUrl: '/images/second.jpg',
    },
  ];

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <MyBlogs />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    localStorage.setItem('token', 'fake-token');
    axios.get.mockResolvedValue({ data: mockPosts });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders correctly with fetched posts', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Read More/i)).toHaveLength(2);
  });

  test('redirects to login if token is missing', () => {
    localStorage.removeItem('token');
    renderComponent();

    expect(screen.getByText('Redirecting...')).toBeInTheDocument();
  });

  test('handles no blogs found error', async () => {
    axios.get.mockRejectedValue({
      response: { status: 404 },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('No blogs found, please write one.')).toBeInTheDocument();
    });
  });

  test('handles delete post', async () => {
    axios.delete.mockResolvedValue({});
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/api/posts/1`,
        expect.any(Object)
      );
    });

    expect(screen.queryByText('First Post')).not.toBeInTheDocument();
  });

  test('renders message when no blogs are uploaded', async () => {
    axios.get.mockResolvedValue({ data: [] });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('You have not uploaded any blogs yet.')).toBeInTheDocument();
    });
  });
});
