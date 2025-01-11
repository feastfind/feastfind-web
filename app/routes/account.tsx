import type { Route } from './+types/account';
import { auth } from '@/lib/auth';
import { Form, Link, redirect, useLoaderData } from 'react-router';
import { Button } from '@/components/ui/button';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export async function clientLoader() {
  const user = await auth.checkUser();
  return { user };
}

export async function clientAction() {
  auth.logout();
  return redirect('/login');
}

export default function AccountRoutes() {
  const data = useLoaderData() as Awaited<ReturnType<typeof clientLoader>>;
  return (
    <main className="p-3">
      {auth.isAuthenticated ? (
        <div className="flex gap-4 border rounded-2xl overflow-auto">
          <div className="rounded-full size-24 overflow-hidden">
            <img
              alt="avatar"
              src={data?.user?.user?.avatarURL}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-2 flex flex-col gap-4">
            <label className="text-xl">
              Hello, {data?.user?.user?.username}
            </label>

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
