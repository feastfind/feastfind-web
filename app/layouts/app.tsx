import { auth } from '@/lib/auth';
import { House, MapPinned, StarIcon, UserIcon } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router';
import type { Route } from './+types/app';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

export async function clientLoader() {
  const user = await auth.getUser();
  return { user };
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  const [searchFormStatus, setSearchFormStatus] = useState(false);
  let location = useLocation();

  return (
    <div className="max-w-[500px] relative min-h-screen border-l border-r mx-auto overflow-auto no-scrollbar pb-16">
      <div className="w-full h-16 sticky top-0 border-b bg-red-700">
        <div className="h-full flex items-center justify-between gap-4 px-4">
          <NavLink to={'/'}>
            <h1 className="text-2xl font-bold text-white">🍽️ FeastFind</h1>
          </NavLink>
          {location.pathname !== '/' && (
            <MagnifyingGlassIcon
              onClick={() => setSearchFormStatus(!searchFormStatus)}
              className="text-white size-5"
            />
          )}
        </div>
      </div>

      <Outlet context={searchFormStatus} />

      <nav className="fixed bottom-0 left-0 right-0 w-full max-w-[500px] mx-auto h-16 bg-white flex justify-start items-center gap-4 border">
        <div className="w-full h-full flex justify-around">
          <NavLink
            to="/"
            className={({ isActive }) => {
              return `w-16 flex flex-col gap-0.5 justify-center items-center hover:bg-gray-100${
                isActive ? ' text-red-700' : ''
              }`;
            }}
          >
            <House />
            <span className="text-xs font-light">Home</span>
          </NavLink>

          <NavLink
            to="/explore"
            className={({ isActive }) => {
              return `w-16 flex flex-col gap-0.5 justify-center items-center hover:bg-gray-100${
                isActive ? ' text-red-500' : ''
              }`;
            }}
          >
            <MapPinned />
            <span className="text-xs font-light">Explore</span>
          </NavLink>

          <NavLink
            to="/reviews"
            className={({ isActive }) => {
              return `w-16 flex flex-col gap-0.5 justify-center items-center hover:bg-gray-100${
                isActive ? ' text-red-500' : ''
              }`;
            }}
          >
            <StarIcon />
            <span className="text-xs font-light">Reviews</span>
          </NavLink>

          <NavLink
            to="/account"
            className={({ isActive }) => {
              return `w-16 flex flex-col gap-0.5 justify-center items-center hover:bg-gray-100${
                isActive ? ' text-red-500' : ''
              }`;
            }}
          >
            {user && (
              <>
                <Avatar className="size-6">
                  <AvatarImage
                    src={String(user.avatarURL)}
                    alt={user.username}
                  />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-light">@{user.username}</span>
              </>
            )}
            {!user && (
              <>
                <UserIcon />
                <span className="text-xs font-light">Account</span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
