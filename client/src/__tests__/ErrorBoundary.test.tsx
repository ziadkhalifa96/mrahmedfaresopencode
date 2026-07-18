import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from '../components/ui/ErrorBoundary';

const ThrowingComponent = () => {
  throw new Error('Test error');
};

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>{component}</BrowserRouter>
    </HelmetProvider>
  );
};

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    renderWithProviders(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders error UI when child throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });

  it('renders try again button', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderWithProviders(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});
