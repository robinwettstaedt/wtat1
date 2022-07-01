import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="notebooks">Notebooks</Link>
        </li>
        <li>
          <Link to="notebook">Create New Notebook</Link>
        </li>
        <li>
          <Link to="signin">Login</Link>
        </li>
        <li>
          <Link to="signup">Register</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
