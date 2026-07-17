import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
  it('renders the welcome heading', () => {
    render(<Home />);
    
    const heading = screen.getByRole('heading', {
      name: /welcome to portfolio cms/i,
    });
    
    expect(heading).toBeInTheDocument();
  });
});
