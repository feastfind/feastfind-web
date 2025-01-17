import type { paths } from '@/schema';
import type { Route } from './+types/menuItemSlug';

import { ENV } from '@/env';
import { Debug } from '@/components/ui/debug';
import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons';
import { MessageSquareQuoteIcon, PinIcon } from 'lucide-react';
import { Link, useOutletContext } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import SearchForm from '@/components/shared/SearchForm';
import { auth } from '@/lib/auth';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type MenuItemSlugResponse =
  paths['/menu-items/{slug}']['get']['responses'][200]['content']['application/json'];

export async function clientLoader({ params }: Route.LoaderArgs) {
  const response = await fetch(
    `${ENV.VITE_BACKEND_API_URL}/menu-items/${params.menuItemSlug}`
  );
  const menuItem: MenuItemSlugResponse = await response.json();

  return { menuItem };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Menu Item - FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { menuItem } = loaderData;
  const searchFormStatus: boolean = useOutletContext();

  return (
    <div className="flex flex-col gap-4 p-5 mb-20">
      {searchFormStatus && <SearchForm />}
      <div className="text-2xl font-medium">{menuItem.name}</div>
      <img src={menuItem.images[0].url} className="w-full h-80 rounded-2xl" />
      <div className="flex items-center gap-2 text-slate-400">
        Rating: <StarFilledIcon className="size-5 text-amber-600" />
        <p>{menuItem.ratingScore}</p>
      </div>
      <p className="text-amber-600 hover:text-amber-800">
        Place: <Link to={`/${menuItem.place.slug}`}>{menuItem.place.name}</Link>
      </p>
      <p>{menuItem.description}</p>
      <div>
        {auth?.isAuthenticated && (
          <div className="bg-slate-200 pl-4 pr-4 pt-5 pb-5 rounded-lg">
            <h3 className="font-bold text-cyan-600 underline mb-1">
              What do you think?
            </h3>
            <div className="flex items-center gap-1 mb-3">
              Rating :
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
            </div>
            <Textarea
              placeholder="What do you think about this food ?"
              className="mb-2"
            />
            <Button className="max-w-40 self-center mt-3" disabled>
              Write Review
            </Button>
          </div>
        )}

        <h3 className="font-bold text-cyan-600 underline mb-3 mt-5">Reviews</h3>
        {menuItem.reviews.length === 0 && (
          <p className="text-sm">No reviews available.</p>
        )}
        <section className="grid gap-4">
          <ul>
            {menuItem.reviews.map((item) => (
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
                    {<span className="text-md ml-2">{item.user.name}</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <StarFilledIcon className="text-amber-600" />
                    {item.rating}
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-full">
                    <div className="flex mb-3">
                      <div className="size-2 mr-6">
                        <MessageSquareQuoteIcon />
                      </div>
                      <div className="text-sm size-full">{item.comment}</div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
