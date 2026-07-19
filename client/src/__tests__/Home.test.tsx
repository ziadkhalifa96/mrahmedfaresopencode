import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import Home from '../pages/public/Home';

vi.mock('../services', () => ({
  publicApi: {
    getAnnouncements: vi.fn().mockResolvedValue({ data: { announcements: [] } }),
  },
}));

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn().mockImplementation((url: string) => {
      if (url === '/public/site-settings') {
        return Promise.resolve({ data: { settings: { phone: '01144258565' } } });
      }
      return Promise.resolve({ data: { content: [] } });
    }),
  },
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/en']}>
        {component}
      </MemoryRouter>
    </HelmetProvider>
  );
};

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading spinner initially', () => {
    renderWithProviders(<Home />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders after loading completes', async () => {
    renderWithProviders(<Home />);
    await waitFor(() => {
      expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
