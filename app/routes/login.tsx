import type { Route } from './+types/home';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useLocation, redirect, useNavigate } from 'react-router';
import { auth } from '@/lib/auth';

type LoginInputs = {
  identifier: string;
  password: string;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export default function login() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { register, handleSubmit } = useForm<LoginInputs>();
  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    const payload = {
      ...data,
    };
    const response = await auth.login(payload);
    if (!response) {
      alert('Something went wrong, please try again later');
      return;
    }
    navigate('/', { replace: true });
  };
  return (
    <div className="max-w-[500px] relative min-h-screen border-l border-r mx-auto overflow-auto no-scrollbar">
      {state?.registered && (
        <div className="p-2 rounded bg-emerald-100 text-center">
          User successfuly registered!
        </div>
      )}
      <div className="h-screen flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Login to your account</h1>
              <p className="text-balance text-sm text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email / Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="m@example.com / johndoe07"
                  autoComplete="off"
                  {...register('identifier', { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="off"
                  {...register('password', { required: true })}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="underline underline-offset-4 text-red-500"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
