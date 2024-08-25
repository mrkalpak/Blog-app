import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import PostDetail from './PostDetail';

// Mock axios for API calls
jest.mock('axios');

describe('PostDetail Component', () => {
  const mockPost = {
    _id: '1',
    title: 'Test Post',
    content: '<p>This is the post content</p>',
    publishDate: '2023-07-23T00:00:00Z',
    imageUrl: '/images/test.jpg',
  };

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <PostDetail />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockPost });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with post data', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
      expect(screen.getByText('This is the post content')).toBeInTheDocument();
    });

    expect(screen.getByAltText('Test Post')).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    renderComponent();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('formats time correctly', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Published:/)).toBeInTheDocument();
      expect(screen.getByText(/1 month ago/)).toBeInTheDocument(); // Adjust based on the current date
    });
  });
});
