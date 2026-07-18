import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import Home from '../pages/public/Home';

vi.mock('../services', () => ({
  publicApi: {
    getAnnouncements: vi.fn().mockResolvedValue({ data: { announcements: [] } }),
  },
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>{component}</BrowserRouter>
    </HelmetProvider>
  );
};

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders hero section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/Learn English with 28 Years of Experience/i)).toBeInTheDocument();
  });

  it('renders features section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/Why Choose Us/i)).toBeInTheDocument();
  });

  it('renders why choose us section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/Why Choose Ahmed Fares Academy/i)).toBeInTheDocument();
  });

  it('renders testimonials section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/What Our Students Say/i)).toBeInTheDocument();
  });

  it('renders CTA section', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/Ready to Start Your Learning Journey/i)).toBeInTheDocument();
  });

  it('renders phone number', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText('01144258565')).toBeInTheDocument();
  });
});
