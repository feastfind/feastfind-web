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
    route('/account/place', 'routes/userPlace.tsx'),
    route('/account/place/add', 'routes/userPlaceAdd.tsx'),
    route('/account/place/edit/:placeSlug', 'routes/userPlaceEdit.tsx'),
    route('/account/place/:placeSlug/menu/add', 'routes/userMenuItemAdd.tsx'),
    route(
      '/account/place/:placeSlug/menu/edit/:menuItemSlug',
      'routes/userMenuItemEdit.tsx'
    ),

    route('/city/:citySlug', 'routes/citySlug.tsx'),
    route('/explore', 'routes/explore.tsx'),
    route('/reviews', 'routes/reviews.tsx'),
    route('/account', 'routes/account.tsx'),
    route('/search', 'routes/search.tsx'),
    route('/login', 'routes/login.tsx'),
    route('/register', 'routes/register.tsx'),
    route('/about', 'routes/about.tsx'),
  ]),
] satisfies RouteConfig;
