import type { Route } from './+types/account';
import { auth } from '@/lib/auth';
import { Form, Link, redirect, useLoaderData } from 'react-router';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Account - FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export async function clientLoader() {
  const user = await auth.getUser();
  return { user };
}

export async function clientAction() {
  auth.logout();
  return redirect('/login');
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <main className="p-3">
      {auth.isAuthenticated && user ? (
        <div className="flex p-4 gap-4 border rounded-2xl overflow-auto items-center">
          <div>
            <Avatar className="size-20">
              <AvatarImage src={String(user.avatarURL)} alt={user.username} />
              <AvatarFallback>{user.name}</AvatarFallback>
            </Avatar>
          </div>

          <div className="p-2 flex flex-col gap-4">
            <label className="text-xl">Hello, {user.username}</label>

            <Form method="post">
              <Button type="submit">Logout</Button>
            </Form>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-blue-200 rounded-md">
          Please{' '}
          <Link to={'/login'} className="underline text-blue-500">
            Log in.
          </Link>
        </div>
      )}
    </main>
  );
}
