import type { itemReviewSchema } from '@/schema/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { StarFilledIcon } from '@radix-ui/react-icons';
import {
  MessageSquareQuoteIcon,
  PinIcon,
  UtensilsCrossedIcon,
} from 'lucide-react';
import { Link } from 'react-router';

export default function ReviewsCard({ item }: itemReviewSchema) {
  return (
    <li
      key={item.id}
      className="p-4 border border-gray-300 rounded-2xl mb-4 h-auto dark:bg-slate-800 dark:text-white"
    >
      <div className="flex gap-4 items-center mb-2">
        <div className="w-1/5">
          <Link
            to={`/${item.menuItem.place.slug}/${item.menuItem.slug}`}
            viewTransition
          >
            <img
              src={item.menuItem.images[0].url}
              className="object-cover rounded-lg mb-2"
            />
          </Link>
        </div>

        <div className="w-4/5">
          <div className="flex gap-2">
            <UtensilsCrossedIcon className="p-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className=" mb-2 text-sm text-red-600 dark:text-yellow-500 hover:text-amber-600">
              <Link
                to={`/${item.menuItem.place.slug}/${item.menuItem.slug}`}
                viewTransition
              >
                {item.menuItem.name}
              </Link>
            </div>
          </div>

          <div className="flex gap-2">
            <PinIcon className="p-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <span className="text-sm text-amber-600 hover:text-amber-500 transition-all">
              <Link to={`/${item.menuItem.place.slug}`} viewTransition>
                {item.menuItem.place.name}
              </Link>
            </span>
          </div>
        </div>
      </div>

      <div className="flex bg-slate-200 pt-2 pb-2 pl-2 pr-3 mb-3 rounded-lg dark:bg-slate-600">
        <Avatar className="size-6">
          <AvatarImage
            src={String(item.user.avatarURL)}
            className="rounded-full"
          />
          <AvatarFallback>{item.user.name}</AvatarFallback>
        </Avatar>
        <span className="text-md ml-2">{item.user.name}</span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-1">
          <StarFilledIcon className="text-yellow-500" />
          {item.rating}
        </div>
        <div className="flex justify-end text-slate-500 text-sm">
          {item.updatedAt}
        </div>
      </div>

      <div className="flex mb-3">
        <div className="size-2 mr-6">
          <MessageSquareQuoteIcon />
        </div>
        <div className="text-sm size-full">{item.comment}</div>
      </div>
    </li>
  );
}
