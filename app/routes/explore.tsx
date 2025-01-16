import SearchForm from '@/components/shared/SearchForm';
import type { Route } from './+types/explore';
import { useOutletContext } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Explore - FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function Route() {
  const searchFormStatus: boolean = useOutletContext();
  return (
    <>
      <div className="flex flex-col gap-4 p-5">
        {searchFormStatus && <SearchForm />}
        <div className="text-2xl font-medium">Explore Places</div>
      </div>
    </>
  );
}
