import type { paths } from '@/schema';
import type { Route } from './+types/userPlace';
import { ENV } from '@/env';
import { accessToken, auth } from '@/lib/auth';
import { Link, redirect, useRevalidator } from 'react-router';
import { PlusCircleIcon } from 'lucide-react';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import PlacesCardWithOutImage from '@/components/shared/PlacesCardWithOutImage';

type PlacesResponse =
  paths['/places']['get']['responses'][200]['content']['application/json'];

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Your Places - FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export async function clientLoader() {
  const user = await auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const token = await accessToken.get();

  const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/userPlace`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  });
  const places: PlacesResponse = await response.json();

  return { places };
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { places } = loaderData;
  const revalidator = useRevalidator();

  const deletePlaceHandler = async (slug: string) => {
    const token = await accessToken.get();

    const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/places/${slug}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });

    revalidator.revalidate();
  };

  return (
    <div className="flex flex-col gap-4 p-5 mt-16">
      <div className="flex items-center justify-between gap-2">
        <div className="text-2xl font-medium text-foreground">Your Place</div>
        <div className="hover:bg-slate-100 transition-all rounded-lg p-2 cursor-pointer">
          <Link to="/account/place/add" viewTransition className="flex gap-2 ">
            <PlusCircleIcon className="text-foreground" /> Add Place
          </Link>
        </div>
      </div>

      <div hidden={revalidator.state === 'idle'}>Revalidating...</div>

      <ul className="grid gap-4">
        {places.length === 0 && (
          <div className="p-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You have no places, please add new place by click Plus Button on
              right side.
            </p>
          </div>
        )}
        {places &&
          places.map((place, index) => (
            <div className="flex items-center gap-4" key={index}>
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                  <Link to={`/account/place/edit/${place.slug}`} viewTransition>
                    <Pencil1Icon className="size-4 text-green-700 dark:text-green-400" />
                  </Link>
                  <TrashIcon
                    className="size-4 text-red-700 dark:text-red-400 cursor-pointer"
                    onClick={() => deletePlaceHandler(place.slug)}
                  />
                </div>

                <Link to={`/account/place/${place.slug}/menu/add`}>
                  <div className="text-foreground text-xs flex gap-2 items-center p-2 bg-slate-200 dark:bg-slate-800 rounded-md cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 transition-all">
                    <PlusCircleIcon className="text-foreground size-4" />
                    Menu
                  </div>
                </Link>
              </div>
              <div className="w-10/12">
                <PlacesCardWithOutImage place={place} />
              </div>
            </div>
          ))}
      </ul>
    </div>
  );
}
