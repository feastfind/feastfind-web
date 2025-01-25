import { formatRupiah } from '@/lib/utils';
import type { itemPlaceSchema } from '@/schema/schema';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { Label } from '@radix-ui/react-label';
import { Banknote } from 'lucide-react';
import { Link } from 'react-router';

export default function PlacesCardWithOutImage({ place }: itemPlaceSchema) {
  return (
    <Link
      viewTransition
      to={`/${place.slug}`}
      className="dark:hover:bg-slate-900 cursor-pointer"
    >
      <li className="dark:text-slate-200">
        <div className="border-b pt-2 pb-2 flex flex-col gap-2">
          <h3 className="font-bold text-lg text-red-600 hover:text-red-700 dark:text-yellow-500">
            {place.name}
          </h3>

          <p className="text-sm">{place.description}</p>
          <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300 text-sm">
            <Banknote />
            <Label>{`${formatRupiah(
              parseInt(String(place.priceMin))
            )} - ${formatRupiah(
              parseInt(String(place.priceMax))
            )}`}</Label>{' '}
            | Rating :{' '}
            <StarFilledIcon className="text-yellow-600 dark:text-yellow-500" />
            {place.ratingScore}
          </div>
        </div>
      </li>
    </Link>
  );
}
