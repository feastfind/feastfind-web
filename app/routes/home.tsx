import type { paths } from '@/schema';
import type { Route } from './+types/home';

import { Input } from '@/components/ui/input';
import { Banknote } from 'lucide-react';
import { Link } from 'react-router';
import { ENV } from '@/env';
import { formatRupiah } from '@/lib/utils';

type PlacesResponse =
  paths['/places']['get']['responses'][200]['content']['application/json'];

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export async function clientLoader() {
  const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/places`);
  const placesJSON: PlacesResponse = await response.json();

  return { placesJSON: placesJSON };
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { placesJSON } = loaderData;
  return (
    <>
      <div className="flex flex-col gap-4 p-5">
        <div className="text-2xl font-medium">What would you like today ?</div>
        <div className="text-sm">{`${placesJSON.length} restaurant available`}</div>
        <Input
          type="text"
          placeholder="Search restaurant, menu, food etc."
          className="rounded-full placeholder:text-xs"
        />
      </div>

      {/* TODO Category
      <div className="flex flex-col gap-4 p-5">
        <h2 className="text-lg font-medium">Cuisines</h2>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
              <div className="text-xs text-center">Category</div>
            </div>
          ))}
        </div>
      </div> 
      */}

      <div className="flex flex-col gap-4 p-5">
        <h2>All places</h2>

        <ul className="grid gap-4">
          {placesJSON.map((place) => (
            <Link key={place.id} to={`/places/${place.slug}`}>
              <li className="h-56 rounded-2xl border border-gray-300">
                <div className="w-full h-3/4 bg-gray-200 rounded-2xl overflow-hidden">
                  <img
                    alt="banner"
                    src={place.images[0]}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-sm p-2">
                  <div className="font-medium">{place.name}</div>
                  <div className="flex items-center gap-2">
                    <Banknote />
                    <div>{`${formatRupiah(
                      parseInt(place.priceMin)
                    )} - ${formatRupiah(parseInt(place.priceMax))}`}</div>
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
}
