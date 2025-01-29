import type { paths } from '@/schema';
import type { Route } from './+types/search';
import { ENV } from '@/env';
import { Link } from 'react-router';
import { Banknote } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import SearchForm from '@/components/shared/SearchForm';
import { StarFilledIcon } from '@radix-ui/react-icons';
import PlacesCard from '@/components/shared/PlacesCard';

type SearchResponse =
  paths['/search']['get']['responses'][200]['content']['application/json'];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/search?q=${q}`);
  const searchJSON: SearchResponse = await response.json();

  return { q, searchJSON: searchJSON };
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `Search: ${data.q} - FeastFind` },
    {
      name: 'description',
      content: 'Search foods, menu items, places, restaurants, etc.',
    },
  ];
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { searchJSON } = loaderData;
  return (
    <>
      <div className="flex flex-col gap-4 p-5 mt-16">
        <SearchForm />
      </div>

      <div className="flex flex-col gap-4 px-5 mb-8">
        <h3 className="font-bold text-cyan-600 dark:text-slate-300 underline text-2xl">
          Menus
        </h3>
        {searchJSON.menuItems.length === 0 && (
          <p className="text-sm">No menu items available.</p>
        )}

        <ul className="grid gap-4">
          {searchJSON.menuItems.map((item) => (
            <li key={item.id}>
              <Link
                to={`/${item.place.slug}/${item.slug}`}
                viewTransition
                className="block"
              >
                <div className="flex border rounded-2xl overflow-hidden h-32">
                  <div className="w-32 h-full bg-gray-50">
                    <img
                      alt="menu item"
                      src={String(item.images[0].url ?? '')}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-4">
                    <Label className="text-lg text-amber-800 hover:text-amber-600 dark:text-yellow-500 dark:hover:text-yellow-400 cursor-pointer font-bold">
                      {item.name}
                    </Label>
                    <div className="flex items-center gap-1 dark:text-slate-300">
                      <StarFilledIcon className="text-yellow-500 " />
                      {item.ratingScore}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-emerald-800 dark:text-cyan-300">
                      <Banknote />
                      <div>{`${formatRupiah(
                        parseInt(String(item.price))
                      )}`}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4 px-5 mb-8">
        <h3 className="font-bold text-cyan-600 dark:text-slate-300 underline text-2xl">
          Places
        </h3>
        {searchJSON?.places?.length === 0 && (
          <p className="text-sm dark:text-white">No places found.</p>
        )}
        <ul className="grid gap-4">
          {searchJSON?.places?.map((place) => (
            <Link key={place.id} to={`/${place.slug}`} viewTransition>
              <li className="h-72 mb-3">
                <div className="h-2/3">
                  <img
                    alt="banner"
                    src={place.menuItems[0]?.images[0]?.url ?? '/restoran.jpg'}
                    className="w-full h-full object-cover rounded-t-xl "
                  />
                </div>

                <div className="flex h-1/3 border-b">
                  <div className="text-sm w-5/6 p-3">
                    <div className="text-xl font-bold text-red-800 dark:text-yellow-500 hover:text-amber-500 transition-all">
                      {place.name}
                    </div>
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-cyan-300">
                      <Banknote />
                      <div>{`${formatRupiah(
                        parseInt(String(place.priceMin))
                      )} - ${formatRupiah(
                        parseInt(String(place.priceMax))
                      )}`}</div>
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
      </div>
    </>
  );
}
