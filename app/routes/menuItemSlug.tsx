import type { paths } from '@/schema';
import type { Route } from './+types/menuItemSlug';

import { ENV } from '@/env';
import { Debug } from '@/components/ui/debug';

type MenuItemSlugResponse =
  paths['/menu-items/{slug}']['get']['responses'][200]['content']['application/json'];

export async function clientLoader({ params }: Route.LoaderArgs) {
  const response = await fetch(
    `${ENV.VITE_BACKEND_API_URL}/menu-items/${params.menuItemSlug}`
  );
  const menuItem: MenuItemSlugResponse = await response.json();

  return { menuItem };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { menuItem } = loaderData;

  return (
    <main className="flex flex-col gap-4 p-5 mb-20">
      {/* MENU ITEM DATA */}
      <Debug>{menuItem}</Debug>
    </main>
  );
}
