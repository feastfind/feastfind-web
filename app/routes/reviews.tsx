import type { Route } from './+types/reviews';

import type { paths } from '@/schema';
import { ENV } from '@/env';
import {
  PinBottomIcon,
  PinTopIcon,
  StarFilledIcon,
} from '@radix-ui/react-icons';
import { MessageSquareQuoteIcon, PinIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Link, useOutletContext } from 'react-router';
import SearchForm from '@/components/shared/SearchForm';
import { Button } from '@/components/ui/button';

type ReviewsResponse =
  paths['/reviews']['get']['responses'][200]['content']['application/json'];

export async function clientLoader() {
  const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/reviews`);
  const reviewsData: ReviewsResponse = await response.json();
  return { reviewsData };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Reviews - FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { reviewsData } = loaderData;
  const searchFormStatus: boolean = useOutletContext();

  return (
    <>
      <div className="flex flex-col gap-4 p-5 dark:text-white">
        {searchFormStatus && <SearchForm />}
        <div className="flex justify-between items-center">
          <div className="text-2xl font-medium ">All Reviews</div>
          <div className="flex gap-3">
            <PinTopIcon className="hover:text-black text-red-600 dark:text-slate-200 size-5 cursor-pointer" />
            <PinBottomIcon className="hover:text-black text-red-600 dark:text-slate-200 dark:text-slate-200 size-5 cursor-pointer" />
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-4 p-5 mb-10">
        <section className="grid gap-4">
          <ul>
            {reviewsData.map((item) => (
              <li
                key={item.id}
                className="p-4 border border-gray-300 rounded-2xl mb-4 h-auto dark:bg-slate-800 dark:text-white"
              >
                <div className="flex justify-between bg-slate-200 pt-2 pb-2 pl-2 pr-3 mb-3 rounded-lg dark:bg-slate-600">
                  <div className="flex">
                    <Avatar className="size-6">
                      <AvatarImage
                        src={String(item.user.avatarURL)}
                        alt={item.user.username}
                        className="rounded-full"
                      />
                      <AvatarFallback>{item.user.name}</AvatarFallback>
                    </Avatar>
                    <span className="text-md ml-2">{item.user.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarFilledIcon className="text-yellow-500" />
                    {item.rating}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1/5">
                    <Link
                      to={`/${item.menuItem.place.slug}/${item.menuItem.slug}`}
                    >
                      <img
                        src={item.menuItem.images[0].url}
                        className="object-cover rounded-lg mb-2"
                      />
                      <div className=" mb-2 text-xs text-red-600 dark:text-yellow-500 hover:text-amber-600">
                        {item.menuItem.name}
                      </div>
                    </Link>
                  </div>
                  <div className="w-4/5">
                    <div className="flex mb-3">
                      <div className="size-2 mr-6">
                        <MessageSquareQuoteIcon />
                      </div>
                      <div className="text-sm size-full">{item.comment}</div>
                    </div>

                    <hr className="mb-3" />
                    <div className="flex justify-end">
                      <div className="flex gap-2">
                        <PinIcon className="p-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                        <span className="text-sm text-amber-600 hover:text-amber-500 transition-all">
                          <Link to={`/${item.menuItem.place.slug}`}>
                            {item.menuItem.place.name}
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-center">
            <Button className="max-w-40 mt-3 bg-red-700 dark:bg-slate-700 dark:text-white hover:dark:bg-slate-500">
              Load More ...
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
