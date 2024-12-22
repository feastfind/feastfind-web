import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/users', 'routes/users.tsx'),
  route('/places/:placeId', 'routes/placesById.tsx'),
  route('/login', 'routes/login.tsx'),
  route('/register', 'routes/register.tsx'),
] satisfies RouteConfig;
