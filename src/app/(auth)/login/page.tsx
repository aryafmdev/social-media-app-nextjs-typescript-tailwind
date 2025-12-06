'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../store/authSlice';
import { saveAuth, loadAuth } from '../../../lib/authStorage';
import { useRouter } from 'next/navigation';
import AuthTemplate from '../../../components/templates/AuthTemplate';
import AuthCard from '../../../components/organisms/AuthCard';
import TextField from '../../../components/molecules/TextField';
import PasswordField from '../../../components/molecules/PasswordField';
import Button from '../../../components/atoms/Button';
import AlertBanner from '../../../components/organisms/AlertBanner';
import { useMemo, useState } from 'react';
import { getMe } from '../../../lib/api/me';
import { loginUser } from '../../../lib/api/auth';

const LoginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Minimal 6 karakter' }),
});

type LoginValues = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const [serverErrorLabel, setServerErrorLabel] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: LoginValues) => {
      const res = await loginUser({
        email: data.email,
        password: data.password,
      });
      return res;
    },
    onSuccess: async (res) => {
      const token: string | undefined = res?.token;
      let name: string | undefined;
      let username: string | undefined;
      let phone: string | undefined;
      let bio: string | undefined;
      try {
        if (token) {
          const me = await getMe(token);
          name = me?.name;
          username = me?.username;
          phone = me?.phone;
          bio = me?.bio;
        }
      } catch {}
      const email = form.getValues().email;
      const saved = typeof window !== 'undefined' ? loadAuth() : undefined;
      const mergedUser = {
        email: email || saved?.user?.email || '',
        name: (name && name.trim()) || saved?.user?.name,
        username: (username && username.trim()) || saved?.user?.username,
        phone: (phone && phone.trim()) || saved?.user?.phone,
        bio: (bio && bio.trim()) || saved?.user?.bio,
      };
      dispatch(setAuth({ token, user: mergedUser }));
      saveAuth(token, mergedUser);
      router.push('/');
    },
    onError: (err) => {
      const label = err instanceof Error ? err.message : 'Login gagal';
      setServerErrorLabel(label);
    },
  });

  const onSubmit = (values: LoginValues) => mutation.mutate(values);

  const clientErrorLabel = useMemo(() => {
    const errs = form.formState.errors;
    const parts: string[] = [];
    const labels: [keyof LoginValues, string][] = [
      ['email', 'Email'],
      ['password', 'Password'],
    ];
    for (const [key, label] of labels) {
      const e = errs[key];
      if (e?.message) parts.push(`${label}: ${e.message}`);
    }
    if (parts.length === 0) return null;
    return `Perbaiki: ${parts.join('; ')}`;
  }, [form.formState.errors]);

  return (
    <AuthTemplate>
      <AuthCard
        title='Welcome Back!'
        className='w-[clamp(345px,30.97vw,446px)]'
      >
        <form
          className='flex flex-col text-md font-regular gap-xl md:gap-3xl w-[clamp(313px,27.63vw,398px)] justify-self-center'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <TextField
            label='Email'
            name='email'
            placeholder='Enter your email'
            error={form.formState.errors.email}
            registerFnAction={form.register}
          />
          <PasswordField
            label='Password'
            name='password'
            placeholder='Enter your password'
            error={form.formState.errors.password}
            registerFnAction={form.register}
          />
          <Button type='submit' loading={mutation.isPending}>
            Login
          </Button>
          {(mutation.isError || !!clientErrorLabel) && (
            <div className='mt-xl'>
              <AlertBanner
                label={serverErrorLabel ?? clientErrorLabel ?? 'Login gagal'}
                variant='danger'
              />
            </div>
          )}
          {mutation.isSuccess && (
            <div className='mt-xl'>
              <AlertBanner label='Login success' variant='success' />
            </div>
          )}
          <p className='text-sm md:text-md font-semibold text-neutral-300 text-center'>
            Don`t have an account?{' '}
            <a
              href='/register'
              className='text-primary-200 text-sm md:text-md font-bold'
            >
              Register
            </a>
          </p>
        </form>
      </AuthCard>
    </AuthTemplate>
  );
}
