import type { Route } from './+types/reviews';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import type { paths } from '@/schema';
import { ENV } from '@/env';
import { useOutletContext } from 'react-router';
import SearchForm from '@/components/shared/SearchForm';
import { Button } from '@/components/ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import ReviewsCard from '@/components/shared/ReviewsCard';

export type ReviewsResponse =
  paths['/reviews']['get']['responses'][200]['content']['application/json'];

export async function clientLoader() {
  const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/reviews`);
  const reviewsData: ReviewsResponse = await response.json();

  reviewsData.forEach((review) => {
    review.updatedAt = dayjs(review.updatedAt).fromNow();
  });

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
  const [newReviewsData, setNewReviewsData] =
    useState<ReviewsResponse>(reviewsData);

  const [limitPage, setLimitPage] = useState<number>(20);
  const [buttonLoadMore, setButtonLoadMore] = useState(true);

  const [filterValue, setFilterValue] = useState<string>('recent');

  async function handleFilter(filterValueInput: string) {
    setFilterValue(filterValueInput);
    setLimitPage(20);
    setButtonLoadMore(true);

    console.log(filterValueInput);

    if (filterValueInput === 'highest' || filterValueInput === 'lowest') {
      console.log('highest atau lowest');
      const response = await fetch(
        `${ENV.VITE_BACKEND_API_URL}/reviews?rating=${filterValueInput}`
      );
      const reviewsData: ReviewsResponse = await response.json();
      setNewReviewsData(reviewsData);
    }

    if (filterValueInput === 'recent') {
      console.log('recent');
      setNewReviewsData(reviewsData);
    }
  }

  const handlePagination = async (limit: number) => {
    if (filterValue !== 'recent') {
      const pageLimit = limitPage + limit;
      const response = await fetch(
        `${ENV.VITE_BACKEND_API_URL}/reviews?limit=${pageLimit}&rating=${filterValue}`
      );
      const reviews = await response.json();
      if (reviews.length === newReviewsData.length) {
        setButtonLoadMore(!buttonLoadMore);
      }
      setNewReviewsData(reviews);
      setLimitPage(limitPage + limit);
      return;
    }

    const pageLimit = limitPage + limit;
    const response = await fetch(
      `${ENV.VITE_BACKEND_API_URL}/reviews?limit=${pageLimit}`
    );
    const reviews = await response.json();
    if (reviews.length === newReviewsData.length) {
      setButtonLoadMore(!buttonLoadMore);
    }
    setNewReviewsData(reviews);
    setLimitPage(limitPage + limit);
    return;
  };

  return (
    <>
      <div className="mt-20 flex flex-col gap-4 p-5 dark:text-white">
        {searchFormStatus && <SearchForm />}
        <div className="flex justify-between items-center">
          <div className="text-2xl font-medium w-3/5 ">Recent Reviews</div>
          <div className="w-2/5">
            <Select
              onValueChange={handleFilter}
              defaultValue={'Recent reviews'}
            >
              <SelectTrigger>
                <SelectValue
                  defaultValue={'recent'}
                  placeholder="Sort by rating ..."
                />
              </SelectTrigger>
              <SelectContent className="w-1/5">
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="highest">Highest</SelectItem>
                <SelectItem value="lowest">Lowest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <main className="flex flex-col gap-4 p-5 mb-10">
        <section className="grid gap-4">
          <ul>
            {newReviewsData
              ? newReviewsData.map((item) => {
                  return <ReviewsCard key={item.id} item={item} />;
                })
              : reviewsData.map((item) => {
                  return <ReviewsCard key={item.id} item={item} />;
                })}
          </ul>

          <div className="flex justify-center">
            {buttonLoadMore && (
              <Button
                onClick={() => handlePagination(5)}
                className="max-w-40 mt-3 bg-red-700 dark:bg-slate-700 dark:text-white hover:dark:bg-slate-500"
              >
                Load More ...
              </Button>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
