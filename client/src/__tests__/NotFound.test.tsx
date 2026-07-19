import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import NotFound from '../pages/public/NotFound';

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/en/some-unknown-page']}>
        {component}
      </MemoryRouter>
    </HelmetProvider>
  );
};

describe('NotFound Page', () => {
  it('renders 404 message', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders page not found text', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
  });

  it('renders home link', () => {
    renderWithProviders(<NotFound />);
    const link = screen.getByRole('link', { name: /Home/i });
    expect(link).toHaveAttribute('href', '/en');
  });
});
