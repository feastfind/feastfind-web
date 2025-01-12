import type { Route } from './+types/explore';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function Route() {
  return <h1>Explore Maps</h1>;
}
