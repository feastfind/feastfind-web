import { Link, useOutletContext } from 'react-router';
import type { Route } from './+types/placeSlug';
import { Banknote, MapPin } from 'lucide-react';
import { StarFilledIcon } from '@radix-ui/react-icons';

import type { paths } from '@/schema';
import { ENV } from '@/env';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatRupiah } from '@/lib/utils';
import { auth } from '@/lib/auth';
import SearchForm from '@/components/shared/SearchForm';

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
    { title: 'Place - FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { placeData } = loaderData;
  const searchFormStatus: boolean = useOutletContext();

  return (
    <main className="flex flex-col gap-4 p-5 mb-20">
      {searchFormStatus && <SearchForm />}
      <div className="w-full relative h-52 bg-gray-200 rounded-2xl overflow-hidden">
        <img
          alt="place"
          src={placeData.menuItems[0].images[0]}
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
              to={`/city/${placeData.city.slug}`}
              className=" items-center flex flex-col text-cyan-700 hover:text-cyan-500 dark:text-cyan-200 dark:hover:text-cyan-300 transition-all"
            >
              <MapPin />
              {placeData.city.name}
            </Link>
          </div>
          <div className="w-full gap-3">
            <p className="text-sm dark:text-slate-300">{placeData.address}</p>
          </div>
        </div>
        <hr className="mt-2 mb-2 border-slate-400 dark:border-slate-600" />
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.048821680061!2d104.0461696!3d1.1253095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d9891bc34134ff%3A0x9aa4327b66021810!2sde&#39;SAMPAN%20BBQ%20CENTRE!5e0!3m2!1sen!2sid!4v1737335666225!5m2!1sen!2sid"
            width="100%"
            height="250"
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <section className="grid gap-4">
        <h3 className="font-bold text-2xl text-cyan-600 dark:text-slate-300 underline">
          Menus
        </h3>
        <ul>
          {placeData.menuItems.map((item) => (
            <li key={item.id} className="mb-4">
              <Link to={`${item.slug}`} className="block">
                <div className="flex border rounded-2xl overflow-hidden h-32">
                  <div className="w-32 h-full bg-gray-50">
                    <img
                      alt="menu item"
                      src={item.images[0]}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-4">
                    <Label className="text-lg text-amber-800 hover:text-amber-600 dark:text-yellow-500 dark:hover:text-yellow-400 cursor-pointer font-bold">
                      {item.name}
                    </Label>
                    <div className="flex items-center gap-1 dark:text-slate-300">
                      <StarFilledIcon className="text-amber-600 dark:text-yellow-500" />
                      {item.ratingScore}
                    </div>
                    <div className="flex items-center gap-2 font-light dark:text-cyan-300">
                      <Banknote />
                      <Label>{`${formatRupiah(
                        parseInt(String(item.price))
                      )}`}</Label>
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
