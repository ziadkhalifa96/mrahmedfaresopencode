import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  animate?: boolean;
}

export function Section({ children, className = '', id, animate = true }: SectionProps) {
  const Wrapper = animate ? motion.section : 'section';
  const props = animate
    ? {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
      }
    : {};

  return (
    <Wrapper id={id} className={`py-16 md:py-20 ${className}`} {...props}>
      {children}
    </Wrapper>
  );
}

export function SectionHeader({ title, subtitle, className = '' }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
