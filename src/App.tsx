import { Routes, Route } from 'react-router';
import { HomeRoute } from './routes/home';
import { UsersRoute } from './routes/users';

const App = () => {
  return (
    <Routes>
      <Route>
        <Route index element={<HomeRoute />} />
        <Route path="/users" element={<UsersRoute />} />
        <Route path="/places" element={<h1>Estabilishment Page</h1>} />
        <Route
          path="/places/:id"
          element={<h1>Estabilishment Page By ID</h1>}
        />
        <Route path="/login" element={<h1>Login Page</h1>} />
        <Route path="/register" element={<h1>Register Page</h1>} />
        <Route path="*" element={<h1>404 Page not found</h1>} />
      </Route>
    </Routes>
  );
};

export default App;
