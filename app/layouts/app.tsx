import { House, MapPinned, Heart, User } from 'lucide-react';
import { Link, Outlet } from 'react-router';

export default function AppLayout() {
  return (
    <div className="relative max-w-[500px] h-screen overflow-auto no-scrollbar bg-white mx-auto">
      <Outlet />

      <nav className="sticky bottom-0 left-0 right-0 w-full bg-white flex justify-start items-center gap-4">
        <div className="w-full h-full flex justify-around items-center p-2">
          <Link className="p-4 hover:bg-slate-100 text-red-500" to="/">
            <House />
          </Link>

          <div className="p-4 hover:bg-slate-100 text-red-500">
            <MapPinned />
          </div>

          <div className="p-4 hover:bg-slate-100 text-red-500">
            <Heart />
          </div>

          <Link className="p-4 hover:bg-slate-100 text-red-500" to="/login">
            <User />
          </Link>
        </div>
      </nav>
    </div>
  );
}
