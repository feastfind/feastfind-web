import type { Route } from './+types/placeBySlug';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  MapPin,
  Banknote,
  Star,
  House,
  MapPinned,
  Heart,
  User,
  EllipsisVertical,
} from 'lucide-react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function placesById() {
  return (
    <>
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

      <main className="flex flex-col gap-4 p-5">
        <div className="w-full h-52 bg-slate-300 rounded-2xl" />
        <div className="text-xl font-medium">Ground Beef Tacos</div>
        <div className="flex items-center gap-4">
          <div className="text-yellow-500">
            <Star />
          </div>
          <Label>4.9</Label>
          <div className="flex items-center gap-2 font-light">
            <Banknote />
            <div>Rp 843.123,67</div>
          </div>
        </div>

        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem odio
          distinctio illo dolore asperiores incidunt ullam amet repellat.
          Asperiores rem hic quidem in, doloremque animi.
        </p>

        <Textarea placeholder="What do you think about this food ?" />

        <Button className="bg-red-500 max-w-40 self-center">
          Write Review
        </Button>

        <section className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="flex gap-5 items-center">
                <div className="w-16 h-16 bg-slate-300 rounded-full" />
                <div className="flex flex-col gap-2">
                  <div>James Anderson</div>
                  <div className="text-sm font-light">01/01/2025</div>
                </div>
                <div className="ms-auto">
                  <EllipsisVertical />
                </div>
              </div>

              <p className="px-3">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque
                obcaecati ea, hic aspernatur quas cupiditate accusamus! Ad nulla
                amet delectus optio qui veniam exercitationem, ex rerum nihil
                ducimus reiciendis molestias.
              </p>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
