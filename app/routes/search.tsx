import type { paths } from '@/schema';
import type { Route } from './+types/search';
import { ENV } from '@/env';
import { Input } from '@/components/ui/input';
import { Form, Link } from 'react-router';
import { Banknote } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import SearchForm from '@/components/shared/SearchForm';

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
      <div className="flex flex-col gap-4 p-5">
        <SearchForm />
      </div>

      <div className="flex flex-col gap-4 px-5 mb-8">
        <h3 className="font-bold text-cyan-600 underline">Menus</h3>
        {searchJSON.menuItems.length === 0 && (
          <p className="text-sm">No menu items available.</p>
        )}

        <ul className="grid gap-4">
          {searchJSON.menuItems.map((item) => (
            <li key={item.id}>
              <Link to={`/${item.place.slug}/${item.slug}`} className="block">
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
                    <div className="flex items-center gap-2 text-sm text-emerald-800">
                      <Banknote />
                      <div>{`${formatRupiah(parseInt(item.price))}`}</div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4 px-5 mb-8">
        <h3 className="font-bold text-cyan-600 underline">Places</h3>
        {searchJSON?.places?.length === 0 && (
          <p className="text-sm">No places found.</p>
        )}
        <ul className="grid gap-4">
          {searchJSON?.places?.map((place) => (
            <Link key={place.id} to={`/${place.slug}`}>
              <li className="h-56 rounded-2xl border border-gray-300">
                <div className="w-full h-2/3 bg-gray-200 rounded-2xl overflow-hidden">
                  <img
                    alt="banner"
                    src={place?.images?.[0] ?? null}
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
