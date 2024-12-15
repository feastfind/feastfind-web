import { useQuery } from '@tanstack/react-query';
import { paths } from '../schema';
import { ENV } from '../env';

type UsersResponse =
  paths['/users']['get']['responses'][200]['content']['application/json'];

export function UsersRoute() {
  const {
    isPending,
    isFetching,
    isError,
    data: users,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/users`);
      const users: UsersResponse = await response.json();
      return users;
    },
  });

  if (isError) {
    return <div>Failed to get all users.</div>;
  }

  return (
    <div>
      <h1>All Users</h1>

      {isPending && isFetching && <div>Loading all users...</div>}

      {!isPending && !isFetching && (
        <div>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <div>{user.name}</div>
                <div>{user.email}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
