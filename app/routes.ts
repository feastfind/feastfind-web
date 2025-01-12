import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  layout('layouts/app.tsx', [
    index('routes/home.tsx'),
    route('/users', 'routes/users.tsx'),
    route('/:placeSlug', 'routes/placeSlug.tsx'),
    route('/:placeSlug/:menuItemSlug', 'routes/menuItemSlug.tsx'),

    route('/explore', 'routes/explore.tsx'),
    route('/reviews', 'routes/reviews.tsx'),
    route('/account', 'routes/account.tsx'),
  ]),
  route('/login', 'routes/login.tsx'),
  route('/register', 'routes/register.tsx'),
] satisfies RouteConfig;
