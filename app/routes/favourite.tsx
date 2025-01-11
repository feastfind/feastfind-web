import type { Route } from './+types/favourite';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function FavouriteRoutes() {
  return <h1>Favourite page Under construction.</h1>;
}
