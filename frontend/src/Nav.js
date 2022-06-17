import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="notes">Notes</Link>
        </li>
        <li>
          <Link to="note">Create New Note</Link>
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
