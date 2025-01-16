import type { Route } from './+types/reviews';

import type { paths } from '@/schema';
import { ENV } from '@/env';
import {
  BookmarkFilledIcon,
  QuestionMarkCircledIcon,
  SewingPinFilledIcon,
  StarFilledIcon,
} from '@radix-ui/react-icons';
import {
  LucideQuote,
  MapIcon,
  MessageSquareQuoteIcon,
  PinIcon,
  QuoteIcon,
  TextQuoteIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Form, Link, useOutletContext } from 'react-router';
import { Input } from '@/components/ui/input';
import SearchForm from '@/components/shared/SearchForm';
import { useState } from 'react';

type ReviewsResponse =
  paths['/reviews']['get']['responses'][200]['content']['application/json'];

export async function clientLoader({ params }: Route.LoaderArgs) {
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
      <div className="flex flex-col gap-4 p-5">
        {searchFormStatus && <SearchForm />}
        <div className="text-2xl font-medium">All Reviews</div>
      </div>

      <main className="flex flex-col gap-4 p-5 mb-20">
        <section className="grid gap-4">
          <ul>
            {reviewsData.map((item) => (
              <li
                key={item.id}
                className="p-4 border border-gray-300 rounded-2xl mb-4 h-auto"
              >
                <div className="flex justify-between bg-slate-200 pt-2 pb-2 pl-2 pr-3 mb-3 rounded-lg">
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
                    <StarFilledIcon className="text-amber-600" />
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
                      <div className=" mb-2 text-xs text-red-600 hover:text-amber-600">
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
                        <PinIcon className="p-1 bg-slate-200 rounded-full" />
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
        </section>
      </main>
    </>
  );
}
