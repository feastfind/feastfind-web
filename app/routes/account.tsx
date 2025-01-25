import type { Route } from './+types/account';
import { auth } from '@/lib/auth';
import { Form, Link, redirect, useOutletContext } from 'react-router';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SearchForm from '@/components/shared/SearchForm';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Account - FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export async function clientLoader() {
  const user = await auth.getUser();
  if (!user) {
    return redirect('/login');
  }
  return { user };
}

export async function clientAction() {
  auth.logout();
  return redirect('/login');
}

export default function Route({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const searchFormStatus: boolean = useOutletContext();

  return (
    <main className="p-3 mt-16">
      {searchFormStatus && <SearchForm />}

      {auth.isAuthenticated && user ? (
        <>
          <div className="flex mt-4 p-4 gap-4 border rounded-2xl overflow-auto items-center dark:bg-slate-700">
            <div>
              <Avatar className="size-20">
                <AvatarImage src={String(user.avatarURL)} alt={user.username} />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
            </div>

            <div className="p-2 flex flex-col gap-4 ">
              <label className="text-xl dark:text-white">
                Hello, {user.username}
              </label>

              <div className="flex gap-2">
                <Form method="post">
                  <Button type="submit">Logout</Button>
                </Form>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-3 bg-blue-200 rounded-2xl mt-3">
          Please{' '}
          <Link
            to={'/login'}
            className="underline text-blue-500"
            viewTransition
          >
            Login
          </Link>
        </div>
      )}
    </main>
  );
}
