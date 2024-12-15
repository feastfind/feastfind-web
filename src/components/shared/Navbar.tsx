import { NavLink } from 'react-router';

export function Navbar() {
  return (
    <div className="flex gap-8">
      <div>Feast Find</div>
      <div className="flex gap-4">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/places">Places</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </div>
    </div>
  );
}
