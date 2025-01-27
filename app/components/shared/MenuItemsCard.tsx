import { formatRupiah } from '@/lib/utils';
import type { itemMenuItemsSchema } from '@/schema/schema';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { Label } from '@radix-ui/react-label';
import { Banknote } from 'lucide-react';
import { Link } from 'react-router';

export default function MenuItemsCard({
  item,
  isUserExist,
  placeSlug,
}: itemMenuItemsSchema) {
  return (
    <li className="mb-4">
      <Link
        viewTransition
        to={`${!isUserExist ? item.slug : `/${placeSlug}/${item.slug}`}`}
        className="block"
        // target={`${placeSlug && '_blank'}`}
      >
        <div className="flex border rounded-2xl overflow-hidden h-32 bg-card">
          <div className="w-32 h-full bg-gray-50">
            <img
              alt="menu item"
              src={`${item.images[0]}-/resize/300/`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 p-4">
            <Label className="text-lg text-amber-800 dark:text-yellow-500 cursor-pointer font-bold">
              {item.name}
            </Label>
            <div className="flex items-center gap-1 dark:text-slate-300">
              {item.ratingScore}
              <StarFilledIcon className="text-amber-600 dark:text-yellow-500" />
            </div>
            <div className="flex items-center gap-2 font-light dark:text-cyan-300">
              <Banknote />
              <Label>{`${formatRupiah(parseInt(String(item.price)))}`}</Label>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
