import { useQuery } from '@tanstack/react-query';
import { getPlaceHolder } from '../services/HomeServices';
import { Navbar } from '../components/shared/Navbar';

export function HomeRoute() {
  const { isPending, isFetching, isError, data } = useQuery({
    queryKey: ['cacheKey'],
    queryFn: getPlaceHolder,
  });

  if (isError) {
    return <div>Something went wrong, please try again later.</div>;
  }

  return (
    <div>
      <Navbar />
      <h1>This is home page</h1>
      {isPending && isFetching ? (
        <div>Loading ...</div>
      ) : (
        <div>{JSON.stringify(data)}</div>
      )}
    </div>
  );
}
