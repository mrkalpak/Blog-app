import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import PostList from './PostList';

// Mock axios for API calls
jest.mock('axios');

describe('PostList Component', () => {
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

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <PostList />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { posts: mockPosts, totalPages: 2 },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with fetched posts', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });

    expect(screen.getAllByText(/Read More/i)).toHaveLength(2);
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });

  test('handles pagination correctly', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /right/i }));

    expect(axios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_API_URL}/api/posts?page=2&limit=10`);

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument(); // Simulate same page load (change mock if testing different page load)
    });
  });

  test('disables pagination buttons appropriately', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('First Post')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /left/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /right/i })).not.toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: /right/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /right/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /left/i })).not.toBeDisabled();
    });
  });

  test('handles no posts gracefully', async () => {
    axios.get.mockResolvedValue({ data: { posts: [], totalPages: 1 } });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('All Blogs')).toBeInTheDocument();
      expect(screen.queryByText('First Post')).not.toBeInTheDocument();
      expect(screen.queryByText('Second Post')).not.toBeInTheDocument();
      expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    });
  });
});
