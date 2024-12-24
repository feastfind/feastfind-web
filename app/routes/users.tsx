import type { paths } from '@/schema';
import { ENV } from '@/env';
import type { Route } from './+types/users';

type UsersResponse =
  paths['/users']['get']['responses'][200]['content']['application/json'];

export async function clientLoader() {
  const response = await fetch(`${ENV.VITE_BACKEND_API_URL}/users`);
  const users: UsersResponse = await response.json();

  return { users };
}

export default function UsersRoute({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData;

  return (
    <>
      <h1>All Users</h1>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <div>{user.name}</div>
            <div>{user.email}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
