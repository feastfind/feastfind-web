import type { Route } from './+types/home';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, Form, redirect } from 'react-router';
import { auth, UserLoginrPayloadSchema } from '@/lib/auth';
import { parseWithZod } from '@conform-to/zod';
import { useForm } from '@conform-to/react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Login - FeastFind' },
    { name: 'description', content: 'Find the best feast!' },
  ];
}

export async function clientLoader() {
  const user = await auth.getUser();
  if (user) return redirect('/');
  return null;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  let formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: UserLoginrPayloadSchema,
  });

  if (submission.status !== 'success') return submission.reply();

  const response = await auth.login(submission.value);
  if (!response) {
    console.error(response);
    return;
  }

  return redirect('/');
}

export default function Route({ actionData }: Route.ComponentProps) {
  const [form, fields] = useForm({
    shouldValidate: 'onBlur',
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UserLoginrPayloadSchema });
    },
  });

  return (
    <div className="border-l border-r mx-auto overflow-auto no-scrollbar">
      <div className="flex justify-center mt-32">
        <div className="w-full max-w-xs">
          <Form
            method="post"
            id={form.id}
            onSubmit={form.onSubmit}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold dark:text-white">
                Login to your account
              </h1>
              <p className="text-balance text-sm text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="grid gap-6 dark:text-white">
              <div className="grid gap-2 ">
                <Label htmlFor="email">Email / Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="m@example.com / johndoe07"
                  autoComplete="off"
                  name={fields.identifier.name}
                />
                <span className="text-sm text-red-500">
                  {fields.identifier.errors}
                </span>
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
                  placeholder="*********"
                  name={fields.password.name}
                />
                <span className="text-sm text-red-500">
                  {fields.password.errors}
                </span>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="text-center text-sm dark:text-white">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="underline underline-offset-4 text-red-500 hover:text-red-700 dark:text-yellow-500 dark:hover:text-yellow-600 transition-all"
              >
                Sign up
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
