import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton, CardSkeleton, CourseCardSkeleton, TableSkeleton, DashboardSkeleton } from '../components/ui/Skeleton';

describe('Skeleton Components', () => {
  it('renders base Skeleton with default class', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('renders Skeleton with custom class', () => {
    const { container } = render(<Skeleton className="w-10 h-10" />);
    expect(container.firstChild).toHaveClass('w-10', 'h-10');
  });

  it('renders CardSkeleton', () => {
    const { container } = render(<CardSkeleton />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders CourseCardSkeleton', () => {
    const { container } = render(<CourseCardSkeleton />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders TableSkeleton with default rows', () => {
    const { container } = render(<TableSkeleton />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders DashboardSkeleton', () => {
    const { container } = render(<DashboardSkeleton />);
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
  });
});
