import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route>
        <Route path="places" element={<h1>Estabilishment Page</h1>} />
        <Route path="places/:id" element={<h1>Estabilishment Page By ID</h1>} />
      </Route>

      <Route>
        <Route path="login" element={<h1>Login Page</h1>} />
        <Route path="register" element={<h1>Register Page</h1>} />
      </Route>

      <Route path="*" element={<h1>404 Page not found</h1>} />
    </Routes>
  );
};

export default App;
