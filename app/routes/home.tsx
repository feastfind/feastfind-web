import type { Route } from './+types/home';
import { Input } from '@/components/ui/input';
import { MapPin, Banknote, House, MapPinned, Heart, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-red-500 p-4 flex justify-start items-center gap-4">
        <div className="border border-white rounded p-2">
          <MapPin color="white" />
        </div>
        <div className="flex flex-col text-white font-medium">
          <h2 className="text-xs">Current location</h2>
          <p className="text-sm max-w-[300px] truncate">
            Suite 846 87042 Schroeder Spring, Warrenside, OH 59614
          </p>
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
        <h2 className="text-lg font-medium">Cuisines</h2>
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
        <h2>All places</h2>

        <ul className="grid grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Link key={i} to={`/places/${crypto.randomUUID()}`}>
              <li className="h-56 rounded-2xl border border-gray-300">
                <div className="w-full h-3/4 bg-slate-300 rounded-2xl" />
                <div className="text-sm p-2">
                  <div className="font-medium">Special Name</div>
                  <div className="flex items-center gap-2 font-light text-gray-500">
                    <Banknote />
                    <div>Rp 843.123,67</div>
                  </div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
  );
}
