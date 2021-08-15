import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn app title', () => {
  render(<App />);
  const linkElement = screen.getByText(/training plan/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders learn login link', () => {
  render(<App />);
  const linkElement = screen.getByText(/login/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders learn registry link', () => {
  render(<App />);
  const linkElement = screen.getByText(/registrierung/i);
  expect(linkElement).toBeInTheDocument();
});
