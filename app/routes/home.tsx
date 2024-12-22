import type { Route } from './+types/home';
import { Input } from '@/components/ui/input';
import { MapPin, Banknote, House, MapPinned, Heart, User } from 'lucide-react';
import { useNavigate } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="relative max-w-[500px] h-screen overflow-auto no-scrollbar bg-white mx-auto">
      <div className="bg-red-500 p-4 flex justify-start items-center gap-4">
        <div className="border border-white rounded p-2">
          <MapPin color="white" />
        </div>
        <div className="flex flex-col text-white font-medium">
          <div className="text-xs">Current location</div>
          <div className="text-sm max-w-[300px] truncate">
            Suite 846 87042 Schroeder Spring, Warrenside, OH 59614
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div className="text-3xl font-medium">What would you like today ?</div>
        <div className="text-sm font-light">3478 restaurant available</div>
        <Input
          type="email"
          placeholder="Search restaurant, menu, food etc."
          className="rounded-full"
        />
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div className="text-lg font-medium">Cuisines</div>
        <div className="flex justify-around items-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="w-24 h-24 bg-slate-300 rounded-full" />
              <div className="text-center">Category</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div>All places</div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-56 rounded-2xl border border-gray-300"
              onClick={() => {
                navigate(`/places/${crypto.randomUUID()}`);
              }}
            >
              <div className="w-full h-3/4 bg-slate-300 rounded-2xl" />
              <div className="text-sm p-2">
                <div className="font-medium">Special Name</div>
                <div className="flex items-center gap-2 font-light text-gray-500">
                  <Banknote />
                  <div>Rp 843.123,67</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 w-full bg-white flex justify-start items-center gap-4">
        <div className="w-full h-full flex justify-around items-center">
          <div className="p-4 hover:bg-slate-100 text-red-500">
            <House />
          </div>

          <div className="p-4 hover:bg-slate-100 text-red-500">
            <MapPinned />
          </div>

          <div className="p-4 hover:bg-slate-100 text-red-500">
            <Heart />
          </div>

          <div
            className="p-4 hover:bg-slate-100 text-red-500"
            onClick={() => {
              navigate('/login');
            }}
          >
            <User />
          </div>
        </div>
      </div>
    </div>
  );
}
