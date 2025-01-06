import type { Route } from './+types/home';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth } from '@/lib/auth';

type RegisterInputs = {
  name: string;
  username: string;
  email: string;
  password: string;
  cpassword: string;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function register() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<RegisterInputs>();
  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    const payload = {
      avatarURL: '',
      ...data,
    };

    const response = await auth.register(payload);
    if (!response) {
      alert('Something went wrong, please try again later');
      return;
    }

    navigate('/login', { state: { registered: true } });
    return;
  };

  return (
    <div className="max-w-[500px] relative min-h-screen border-l border-r mx-auto overflow-auto no-scrollbar">
      <div className="h-screen flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Create Account</h1>
              <p className="text-balance text-sm text-muted-foreground">
                Enter your email below to create an account
              </p>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register('name', { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="john07"
                  {...register('username', { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register('email', { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="*********"
                  autoComplete="off"
                  {...register('password', { required: true })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cpassword">Confirm Password</Label>
                <Input
                  id="cpassword"
                  type="password"
                  placeholder="*********"
                  autoComplete="off"
                  {...register('cpassword', { required: true })}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="underline underline-offset-4 text-red-500"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
