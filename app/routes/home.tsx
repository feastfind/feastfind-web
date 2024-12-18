import { Button } from '@/components/ui/button';
import type { Route } from './+types/home';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function Home() {
  return (
    <div>
      <h1>FeastFind</h1>

      <form>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="name@example.com" />
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}
