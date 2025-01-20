import type { paths } from '@/schema';
import type { Route } from './+types/home';

import { Input } from '@/components/ui/input';
import { Banknote } from 'lucide-react';
import { Link, Form } from 'react-router';
import { ENV } from '@/env';
import { formatRupiah } from '@/lib/utils';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';

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
    <div className="dark:text-white">
      <div className="flex flex-col gap-4 p-5 ">
        <div className="text-2xl font-medium ">What would you like today?</div>
        <div className="text-sm">{`${placesJSON.length} places available`}</div>
        <Form action="/search">
          <Input
            type="text"
            placeholder="Search restaurant, menu, food etc."
            className="rounded-2xl placeholder:text-xs border-gray-300"
            name="q"
          />
        </Form>
      </div>

      <div className="flex flex-col gap-4 px-5 mb-4">
        <h2>All places</h2>

        <ul className="grid gap-4">
          {placesJSON.map((place) => (
            <Link key={place.id} to={`/${place.slug}`}>
              <li className="h-72 border-b mb-3">
                <div className="h-2/3 rounded-t-xl overflow-hidden">
                  <img
                    alt="banner"
                    src={place.images[0]}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex">
                  <div className="text-sm w-5/6 p-3">
                    <div className="text-xl font-bold text-red-800 dark:text-yellow-500 hover:text-amber-500 transition-all">
                      {place.name}
                    </div>
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-cyan-300">
                      <Banknote />
                      <div>{`${formatRupiah(
                        parseInt(place.priceMin)
                      )} - ${formatRupiah(parseInt(place.priceMax))}`}</div>
                    </div>
                    <div className="w-[280px] md:w-[350px] text-xs truncate">
                      {place.address}
                    </div>
                  </div>
                  <div className="w-1/6 flex items-center  justify-center border-l dark:border-l-grey">
                    <StarFilledIcon className="size-8 p-1 text-yellow-500 rounded-full" />
                    <span className="font-bold dark:text-yellow-500">
                      {place.ratingScore}
                    </span>
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
        <div className="flex justify-center">
          <Button className="max-w-40 mt-3 mb-8 bg-red-700 dark:bg-slate-700 dark:text-white hover:dark:bg-slate-500">
            Load More ...
          </Button>
        </div>
      </div>
    </div>
  );
}
