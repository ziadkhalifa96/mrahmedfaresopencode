import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import Login from '../pages/auth/Login';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    loading: false,
  }),
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>{component}</BrowserRouter>
    </HelmetProvider>
  );
};

describe('Login Page', () => {
  it('renders login form heading', () => {
    renderWithProviders(<Login />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    renderWithProviders(<Login />);
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
  });

  it('renders email input by placeholder', () => {
    renderWithProviders(<Login />);
    expect(screen.getByPlaceholderText('email@example.com')).toBeInTheDocument();
  });

  it('renders password input by placeholder', () => {
    renderWithProviders(<Login />);
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    renderWithProviders(<Login />);
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('renders register link', () => {
    renderWithProviders(<Login />);
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it('allows typing in email field', () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByPlaceholderText('email@example.com');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('allows typing in password field', () => {
    renderWithProviders(<Login />);
    const passwordInput = screen.getByPlaceholderText('••••••••');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput).toHaveValue('password123');
  });
});
