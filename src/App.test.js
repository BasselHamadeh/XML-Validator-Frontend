import { render, screen } from '@testing-library/react';
import XMLValidatorView from './XMLValidatorView';

test('renders learn react link', () => {
  render(<XMLValidatorView />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});