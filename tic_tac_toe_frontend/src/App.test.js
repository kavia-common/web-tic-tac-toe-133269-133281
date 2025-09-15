import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders status and restart button', () => {
  render(<App />);
  expect(screen.getByTestId('status')).toBeInTheDocument();
  expect(screen.getByTestId('restart')).toBeInTheDocument();
});

test('allows playing a move and restarting', () => {
  render(<App />);
  const firstCell = screen.getByTestId('square-0');
  fireEvent.click(firstCell);
  expect(firstCell).toHaveTextContent(/X|O/);
  const restart = screen.getByTestId('restart');
  fireEvent.click(restart);
  expect(firstCell).toHaveTextContent('');
});
