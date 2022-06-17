import { render, screen } from '@testing-library/react';
import App from './App';

describe("Initial page render", () => {
  test('Renders menu', async () => {
    render(<App />);
    const linkElement = screen.getByText(/^Current$/i);
    expect(linkElement).toBeInTheDocument();
  });
})
