import { render, screen } from '@testing-library/react';

function TestComponent() {
  return <h1>Test environment works</h1>;
}

describe('T01 frontend test environment', () => {
  it('renders a React component successfully', () => {
    render(<TestComponent />);

    expect(
      screen.getByRole('heading', {
        name: 'Test environment works',
      })
    ).toBeInTheDocument();
  });
});