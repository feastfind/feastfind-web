import type { paths } from '@/schema';
import type { Route } from './+types/home';

import { Input } from '@/components/ui/input';
import { Form, useRevalidator } from 'react-router';
import { ENV } from '@/env';

import { Button } from '@/components/ui/button';
import PlacesCard from '@/components/shared/PlacesCard';
import { useFetcher } from 'react-router';
import { useState } from 'react';

type PlacesResponse =
  paths['/places']['get']['responses'][200]['content']['application/json'];

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export async function clientLoader() {
  const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/places`);
  const placesJSON: PlacesResponse = await response.json();

  return { placesJSON: placesJSON };
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { placesJSON } = loaderData;
  const [limitPage, setLimitPage] = useState<number>(20);
  const revalidator = useRevalidator();

  let fetcher = useFetcher();
  let busy = fetcher.state !== 'idle';

  const handlePagination = async (limit: number): Promise<void> => {
    const pageLimit = limitPage + limit;
    const response = await fetch(
      `${ENV.VITE_BACKEND_API_URL}/places?limit${pageLimit}`
    );
    await response.json();
    setLimitPage(limitPage + limit);
    revalidator.revalidate();
  };

  return (
    <div className="dark:text-white mt-16">
      <div className="flex flex-col gap-4 p-5 ">
        <div className="text-2xl font-medium ">What would you like today?</div>
        <div className="text-sm">{`${placesJSON.length} places available`}</div>
        <Form action="/search">
          <Input
            type="text"
            placeholder="Search restaurant, menu, food etc."
            className="rounded-2xl placeholder:text-xs border-gray-300"
            name="q"
          />
        </Form>
      </div>

      <div className="flex flex-col gap-4 px-5 mb-4">
        <h2>All places</h2>

        <ul className="flex flex-col gap-4">
          {placesJSON.map((place, index) => (
            <PlacesCard place={place} key={index} />
          ))}
        </ul>
        <div className="flex flex-col items-center">
          <Button
            className="max-w-40 mt-3 mb-8 bg-red-700 dark:bg-slate-700 dark:text-white hover:dark:bg-slate-500"
            type="submit"
            onClick={() => handlePagination(10)}
          >
            {busy ? 'Loading ...' : 'Load more'}
          </Button>
        </div>
      </div>
    </div>
  );
}
