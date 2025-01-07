import { Form, Link, redirect } from 'react-router';
import { parseWithZod } from '@conform-to/zod';

import type { Route } from './+types/home';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth, UserRegisterPayloadSchema } from '@/lib/auth';
import { useForm } from '@conform-to/react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Register New Account - FeastFind' },
    {
      name: 'description',
      content: 'Register new account to find the best feast!',
    },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: UserRegisterPayloadSchema,
  });

  if (submission.status !== 'success') return submission.reply();

  const response = await auth.register(submission.value);
  if (!response) {
    console.error(response);
    return;
  }

  return redirect('/login');
}

export default function register({ actionData }: Route.ComponentProps) {
  const [form, fields] = useForm({
    shouldValidate: 'onBlur',
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UserRegisterPayloadSchema });
    },
  });

  return (
    <div className="max-w-[500px] relative min-h-screen border-l border-r mx-auto overflow-auto no-scrollbar">
      <div className="h-screen flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <Form
            method="post"
            id={form.id}
            onSubmit={form.onSubmit}
            className="flex flex-col gap-6"
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
                  name="name"
                  type="text"
                  placeholder="John Doe"
                />
                <p>{fields.name.errors}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                />
                <p>{fields.username.errors}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="*********"
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cpassword">Confirm Password</Label>
                <Input
                  id="cpassword"
                  name="cpassword"
                  type="password"
                  placeholder="*********"
                  autoComplete="off"
                />
              </div>
              <input type="hidden" name="avatarURL" />
              <Button type="submit" className="w-full">
                Register
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
          </Form>
        </div>
      </div>
    </div>
  );
}
