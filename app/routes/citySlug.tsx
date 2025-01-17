import SearchForm from '@/components/shared/SearchForm';
import type { Route } from './+types/citySlug';
import { Link, useLocation, useOutletContext } from 'react-router';
import type { paths } from '@/schema';
import { ENV } from '@/env';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { Banknote } from 'lucide-react';
import { Label } from '@radix-ui/react-label';
import { formatRupiah } from '@/lib/utils';

type CityBySlugResponse =
  paths['/cities/{slug}']['get']['responses'][200]['content']['application/json'];

export async function clientLoader({ params }: Route.LoaderArgs) {
  const response = await fetch(
    `${ENV.VITE_BACKEND_API_URL}/cities/${params.citySlug}`
  );
  const cityData: CityBySlugResponse = await response.json();
  return { cityData };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'City - FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { cityData } = loaderData;
  const searchFormStatus: boolean = useOutletContext();
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col gap-4 p-5">
      {searchFormStatus && <SearchForm />}
      <div className="text-2xl font-medium">
        All Places in{' '}
        <span className=" text-cyan-600 capitalize">
          {pathname.split('/')[2]}
        </span>
      </div>

      <ul className="grid gap-4">
        {cityData.places.map((place) => (
          <li key={place.id}>
            <div className="border-b pt-2 pb-2 flex flex-col gap-2">
              <Link to={`/${place.slug}`}>
                <h3 className="font-bold text-lg text-red-600 hover:text-yellow-700">
                  {place.name}
                </h3>
              </Link>

              <p className="text-sm">{place.description}</p>
              <div className="flex items-center gap-2 text-cyan-700 text-sm">
                <Banknote />
                <Label>{`${formatRupiah(
                  parseInt(String(place.priceMin))
                )} - ${formatRupiah(
                  parseInt(String(place.priceMax))
                )}`}</Label>{' '}
                | Rating : <StarFilledIcon className="text-yellow-600" />{' '}
                {place.ratingScore}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
