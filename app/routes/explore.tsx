import type { Route } from './+types/explore';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Explore - FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function Route() {
  return (
    <>
      <div className="flex flex-col gap-4 p-5">
        <div className="text-2xl font-medium">Explore Places</div>
      </div>
    </>
  );
}
