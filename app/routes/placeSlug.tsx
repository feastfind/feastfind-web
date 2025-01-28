import { Link, useOutletContext } from 'react-router';
import type { Route } from './+types/placeSlug';
import { Banknote, MapPin } from 'lucide-react';
import { StarFilledIcon } from '@radix-ui/react-icons';

import type { paths } from '@/schema';
import { ENV } from '@/env';
import { Label } from '@/components/ui/label';
import { formatRupiah } from '@/lib/utils';
import SearchForm from '@/components/shared/SearchForm';
import MenuItemsCard from '@/components/shared/MenuItemsCard';

import 'mapbox-gl/dist/mapbox-gl.css';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import { useState } from 'react';

type PlaceBySlugResponse =
  paths['/places/{slug}']['get']['responses'][200]['content']['application/json'];

export async function clientLoader({ params }: Route.LoaderArgs) {
  const response = await fetch(
    `${ENV.VITE_BACKEND_API_URL}/places/${params.placeSlug}`
  );
  const placeData: PlaceBySlugResponse = await response.json();

  if (response.status !== 200) {
    return { placeData };
  }

  return { placeData };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Place - FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const [accessToken, setAccessToken] = useState<string>(
    ENV.VITE_MAPBOX_ACCESS_TOKEN
  );

  const { placeData } = loaderData;

  const searchFormStatus: boolean = useOutletContext();

  return (
    <main className="flex flex-col gap-4 p-5 mb-20 mt-16">
      {searchFormStatus && <SearchForm />}

      {!placeData.name ? (
        <div>
          <h3>404</h3>
          <p>Page Not Found</p>
        </div>
      ) : (
        <>
          <div className="w-full relative h-52 bg-gray-200 rounded-2xl overflow-hidden">
            <img
              alt="place"
              src={
                placeData.menuItems[0]
                  ? `${placeData.menuItems[0].images[0]}/-/resize/500/`
                  : '/restoran.jpg'
              }
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex items-center justify-center gap-1 p-2 rounded-lg bg-white">
              <StarFilledIcon className="size-5 text-yellow-500" />
              <span>{placeData.ratingScore}</span>
            </div>
          </div>
          <div className="text-3xl font-bold dark:text-yellow-500">
            {placeData.name}
          </div>

          <div className="flex items-center gap-2 font-light dark:text-cyan-400">
            <Banknote />
            <Label>{`${formatRupiah(
              parseInt(String(placeData.priceMin))
            )} - ${formatRupiah(parseInt(String(placeData.priceMax)))}`}</Label>
          </div>

          <p className="dark:text-white">{placeData.description}</p>

          <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg mt-4">
            <div className="flex gap-4 justify-center">
              <div className="flex gap-1 border-r border-slate-400 dark:border-slate-600 pr-4 content-center">
                <Link
                  viewTransition
                  to={`/city/${placeData.city.slug}`}
                  className=" items-center flex flex-col text-cyan-700 hover:text-cyan-500 dark:text-cyan-200 dark:hover:text-cyan-300 transition-all"
                >
                  <MapPin />
                  {placeData.city.name}
                </Link>
              </div>
              <div className="w-full gap-3">
                <p className="text-sm dark:text-slate-300">
                  {placeData.address}
                </p>
              </div>
            </div>
            <hr className="mt-2 mb-2 border-slate-400 dark:border-slate-600" />
            <Map
              mapboxAccessToken={accessToken}
              initialViewState={{
                longitude: placeData.longitude,
                latitude: placeData.latitude,
                zoom: 14,
              }}
              style={{ maxWidth: 600, height: 300, borderRadius: '10px' }}
              mapStyle="mapbox://styles/mapbox/streets-v9"
            >
              <Marker
                longitude={placeData.longitude}
                latitude={placeData?.latitude}
                color="red"
              />
              <NavigationControl />
            </Map>
          </div>

          <section className="grid gap-4">
            <h3 className="font-bold text-2xl text-foreground">Menu Items</h3>
            <ul>
              {placeData.menuItems.length === 0 && (
                <p className="text-sm">No menu items available</p>
              )}
              {placeData.menuItems.map((item, index) => (
                <MenuItemsCard
                  item={item}
                  key={index}
                  isUserExist={false}
                  placeSlug={null}
                />
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
