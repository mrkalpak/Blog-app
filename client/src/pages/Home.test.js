import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
const axios = require('axios');
import Home from './Home';

// Mock axios for API calls
jest.mock('axios');

describe('Home Component', () => {
  const mockPosts = [
    {
      _id: '1',
      title: 'First Post',
      content: '<p>Content of the first post</p>',
      imageUrl: '/images/first.jpg',
      userId: { username: 'User1' },
    },
    {
      _id: '2',
      title: 'Second Post',
      content: '<p>Content of the second post</p>',
      imageUrl: '/images/second.jpg',
      userId: { username: 'User2' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with search bar and no posts initially', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Search for topics...')).toBeInTheDocument();
    expect(screen.getByText('Welcome to Our Blog')).toBeInTheDocument();
    expect(screen.queryByText('No posts found')).not.toBeInTheDocument();
  });

  test('fetches and displays posts based on search query', async () => {
    axios.get.mockResolvedValue({ data: mockPosts });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Search for topics...'), {
      target: { value: 'Post' },
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/posts/search?query=Post');
    });

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });
  });

  test('displays "No posts found" when search returns no results', async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Search for topics...'), {
      target: { value: 'NonExistingPost' },
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/posts/search?query=NonExistingPost');
    });

    await waitFor(() => {
      expect(screen.getByText('No posts found')).toBeInTheDocument();
    });
  });

  test('displays loading state while fetching posts', async () => {
    axios.get.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({ data: mockPosts }), 500)));

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Search for topics...'), {
      target: { value: 'Post' },
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
    });
  });

  test('displays error message when API call fails', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch posts'));

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('Search for topics...'), {
      target: { value: 'ErrorPost' },
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch posts. Please try again later.')).toBeInTheDocument();
    });
  });
});
