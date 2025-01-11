import type { Route } from './+types/explore';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function ExploreRoutes() {
  return <h1>Explore page Under construction.</h1>;
}
