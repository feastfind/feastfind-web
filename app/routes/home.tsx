import type { paths } from '@/schema';
import type { Route } from './+types/home';

import { Input } from '@/components/ui/input';
import { Banknote } from 'lucide-react';
import { Link, Form } from 'react-router';
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
        <Form action="/search">
          <Input
            type="text"
            placeholder="Search restaurant, menu, food etc."
            className="rounded-full placeholder:text-xs"
            name="q"
          />
        </Form>
      </div>

      <div className="flex flex-col gap-4 px-5 mb-4">
        <h2>All places</h2>

        <ul className="grid gap-4">
          {placesJSON.map((place) => (
            <Link key={place.id} to={`/${place.slug}`}>
              <li className="h-56 rounded-2xl border border-gray-300">
                <div className="w-full h-2/3 bg-gray-200 rounded-2xl overflow-hidden">
                  <img
                    alt="banner"
                    src={place.images[0]}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col text-sm p-2">
                  <div className="font-medium">{place.name}</div>
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Banknote />
                    <div>{`${formatRupiah(
                      parseInt(place.priceMin)
                    )} - ${formatRupiah(parseInt(place.priceMax))}`}</div>
                  </div>
                  <div className="w-[280px] md:w-[350px] text-xs truncate">
                    {place.address}
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
