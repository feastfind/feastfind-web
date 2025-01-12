import type { paths } from '@/schema';
import type { Route } from './+types/placeSlug';

import { ENV } from '@/env';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Banknote, Star } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { auth } from '@/lib/auth';
import { Link } from 'react-router';

type PlaceBySlugResponse =
  paths['/places/{slug}']['get']['responses'][200]['content']['application/json'];

export async function clientLoader({ params }: Route.LoaderArgs) {
  const response = await fetch(
    `${ENV.VITE_BACKEND_API_URL}/places/${params.placeSlug}`
  );
  const placeData: PlaceBySlugResponse = await response.json();

  return { placeData };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { placeData } = loaderData;
  return (
    <main className="flex flex-col gap-4 p-5 mb-20">
      <div className="w-full relative h-52 bg-gray-200 rounded-2xl overflow-hidden">
        <img
          alt="place"
          src={placeData.menuItems[0].images[0]}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 flex items-center justify-center gap-2 p-2 rounded bg-white text-yellow-500">
          <Star size={18} />
          <Label>4.9</Label>
        </div>
      </div>
      <div className="text-xl font-medium">{placeData.name}</div>

      <div className="flex items-center gap-2 font-light">
        <Banknote />
        <Label>{`${formatRupiah(parseInt(placeData.priceMin))} - ${formatRupiah(
          parseInt(placeData.priceMax)
        )}`}</Label>
      </div>

      <p>{placeData.description}</p>

      {auth?.isAuthenticated && (
        <>
          <Textarea placeholder="What do you think about this food ?" />
          <Button className="max-w-40 self-center">Write Review</Button>
        </>
      )}

      <section className="grid gap-4">
        <ul>
          {placeData.menuItems.map((item) => (
            <li key={item.id}>
              <Link to={`${item.slug}`} className="block">
                <div className="flex border rounded-2xl overflow-hidden h-32">
                  <div className="w-32 h-full bg-gray-50">
                    <img
                      alt="menu item"
                      src={item.images[0]}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 p-4">
                    <Label className="text-lg">{item.name}</Label>
                    <p>{item.slug}</p>
                    <div className="flex items-center gap-2 font-light">
                      <Banknote />
                      <Label>{`${formatRupiah(parseInt(item.price))}`}</Label>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}