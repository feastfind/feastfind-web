import { auth } from '@/lib/auth';
import { House, MapPinned, StarIcon, UserIcon } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router';
import type { Route } from './+types/app';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  CrossCircledIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
} from '@radix-ui/react-icons';
import { useState } from 'react';

export async function clientLoader() {
  const user = await auth.getUser();
  return { user };
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  const [searchFormStatus, setSearchFormStatus] = useState(false);
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'light');

  const modeHandlerSun = (): void => {
    localStorage.setItem('mode', 'dark');
    setMode('dark');
  };

  const modeHandlerMoon = (): void => {
    localStorage.setItem('mode', 'light');
    setMode('light');
  };

  let location = useLocation();

  return (
    <div className={`${mode} bg-gray-100 dark:bg-slate-800`}>
      <div className="max-w-[500px] dark:bg-slate-950 bg-white relative min-h-screen border-l border-r mx-auto overflow-auto no-scrollbar pb-16">
        <div className="z-50 fixed w-full h-16 max-w-[500px] top-0 bg-red-700 dark:bg-red-900">
          <div className="h-full flex items-center justify-between px-4">
            <div className="flex gap-4 items-center">
              <NavLink to={'/'}>
                <h1 className="text-2xl font-bold text-white">🍽️ FeastFind</h1>
              </NavLink>

              <NavLink
                to="/about"
                className="mr-3 text-white hover:text-gray-100 transition-all"
              >
                | About
              </NavLink>
            </div>

            <div>
              <div className="flex gap-2 text-white">
                {mode === 'light' ? (
                  <SunIcon
                    className="text-white size-5 cursor-pointer"
                    onClick={() => modeHandlerSun()}
                  />
                ) : (
                  <MoonIcon
                    className="text-white size-5 cursor-pointer"
                    onClick={() => modeHandlerMoon()}
                  />
                )}

                {location.pathname !== '/' &&
                  location.pathname !== '/search' &&
                  location.pathname !== '/login' &&
                  location.pathname !== '/register' &&
                  (!searchFormStatus ? (
                    <MagnifyingGlassIcon
                      onClick={() => setSearchFormStatus(!searchFormStatus)}
                      className="text-white size-5 hover:cursor-pointer hover:text-slate-300 transition-all"
                    />
                  ) : (
                    <CrossCircledIcon
                      onClick={() => setSearchFormStatus(!searchFormStatus)}
                      className="text-white size-5 hover:cursor-pointer hover:text-slate-300 transition-all"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>

        <Outlet context={searchFormStatus} />

        {location.pathname !== '/login' &&
          location.pathname !== '/register' && (
            <div className="text-sm text-center mt-4 mb-8 text-slate-600">
              &copy; Copyrights 2025 | Feastfind - All Rights Reserved
            </div>
          )}

        <nav className="fixed bottom-0 left-0 right-0 w-full max-w-[500px] mx-auto h-16 bg-white dark:bg-slate-700 flex justify-start items-center gap-4 border">
          <div className="w-full h-full flex justify-around">
            <NavLink
              to="/"
              className={({ isActive }) => {
                return `w-16 flex flex-col gap-0.5 dark:text-white hover:dark:text-black  justify-center items-center hover:bg-gray-100${
                  isActive
                    ? ' text-red-700 dark:text-white hover:dark:text-black'
                    : ''
                }`;
              }}
            >
              <House />
              <span className="text-xs font-light">Home</span>
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) => {
                return `w-16 flex flex-col gap-0.5 dark:text-white hover:dark:text-black transition-all justify-center items-center hover:bg-gray-100${
                  isActive
                    ? ' text-red-700 dark:text-white hover:dark:text-black'
                    : ''
                }`;
              }}
            >
              <MapPinned />
              <span className="text-xs font-light">Explore</span>
            </NavLink>

            <NavLink
              to="/reviews"
              className={({ isActive }) => {
                return `w-16 flex flex-col gap-0.5 dark:text-white hover:dark:text-black transition-all justify-center items-center hover:bg-gray-100${
                  isActive
                    ? ' text-red-700 dark:text-white hover:dark:text-black'
                    : ''
                }`;
              }}
            >
              <StarIcon />
              <span className="text-xs font-light">Reviews</span>
            </NavLink>

            <NavLink
              to="/account"
              className={({ isActive }) => {
                return `w-16 flex flex-col gap-0.5 dark:text-white hover:dark:text-black transition-all justify-center items-center hover:bg-gray-100${
                  isActive
                    ? ' text-red-700 dark:text-white hover:dark:text-black'
                    : ''
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
    </div>
  );
}
