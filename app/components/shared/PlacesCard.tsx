import { formatRupiah } from '@/lib/utils';
import type { itemPlaceSchema } from '@/schema/schema';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { Banknote } from 'lucide-react';
import { Link } from 'react-router';

export default function PlacesCard({ place }: itemPlaceSchema) {
  return (
    <Link to={`/${place.slug}`} viewTransition>
      <li className="h-72 mb-3">
        <div className="h-2/3">
          <img
            alt="banner"
            // src={`${place.images[0]}-/resize/500/`}
            src={
              place.images[0]
                ? `${place.images[0]}/-/resize/500/`
                : '/restoran.jpg'
            }
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
              <div>{`${formatRupiah(parseInt(place.priceMin))} - ${formatRupiah(
                parseInt(place.priceMax)
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
  );
}
