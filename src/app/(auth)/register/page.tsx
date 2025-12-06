'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../store/authSlice';
import { saveAuth } from '../../../lib/authStorage';
import { useRouter } from 'next/navigation';
import AuthTemplate from '../../../components/templates/AuthTemplate';
import AuthCard from '../../../components/organisms/AuthCard';
import TextField from '../../../components/molecules/TextField';
import PasswordField from '../../../components/molecules/PasswordField';
import Button from '../../../components/atoms/Button';
import AlertBanner from '../../../components/organisms/AlertBanner';
import { useMemo, useState } from 'react';
import { registerUser } from '../../../lib/api/auth';

const RegisterSchema = z
  .object({
    name: z.string().min(2, { message: 'Minimal 2 karakter' }),
    username: z.string().min(3, { message: 'Minimal 3 karakter' }),
    email: z.string().email({ message: 'Email tidak valid' }),
    phone: z.string().min(8, { message: 'Minimal 8 digit' }),
    password: z.string().min(6, { message: 'Minimal 6 karakter' }),
    confirmPassword: z.string().min(6, { message: 'Minimal 6 karakter' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak sama',
    path: ['confirmPassword'],
  });

type RegisterValues = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onChange',
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const [serverErrorLabel, setServerErrorLabel] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: RegisterValues) => {
      const payload = {
        name: data.name,
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      const res = await registerUser(payload);
      return res;
    },
    onSuccess: async (_, variables) => {
      const user = {
        email: variables.email,
        name: variables.name,
        username: variables.username,
        phone: variables.phone,
      };
      const raw = mutation.data;
      const token = raw?.token;
      dispatch(setAuth({ token, user }));
      saveAuth(token, user);
      router.push('/login?registered=1');
    },
    onError: (err) => {
      const label = err instanceof Error ? err.message : 'Register gagal';
      setServerErrorLabel(label);
    },
  });

  const onSubmit = (values: RegisterValues) => mutation.mutate(values);

  const clientErrorLabel = useMemo(() => {
    const errs = form.formState.errors;
    const parts: string[] = [];
    const labels: [keyof RegisterValues, string][] = [
      ['name', 'Name'],
      ['username', 'Username'],
      ['email', 'Email'],
      ['phone', 'Number Phone'],
      ['password', 'Password'],
      ['confirmPassword', 'Confirm Password'],
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
      <AuthCard title='Register' className='w-[clamp(345px,36.31vw,523px)]'>
        <form
          className='flex flex-col gap-xl md:gap-3xl w-[clamp(313px,32.98vw,475px)] justify-self-center'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <TextField
            label='Name'
            name='name'
            placeholder='Enter your name'
            error={form.formState.errors.name}
            registerFnAction={form.register}
          />
          <TextField
            label='Username'
            name='username'
            placeholder='Enter your username'
            error={form.formState.errors.username}
            registerFnAction={form.register}
          />
          <TextField
            label='Number Phone'
            name='phone'
            placeholder='Enter your number phone'
            error={form.formState.errors.phone}
            registerFnAction={form.register}
          />
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
          <PasswordField
            label='Confirm Password'
            name='confirmPassword'
            placeholder='Enter your confirm password'
            error={form.formState.errors.confirmPassword}
            registerFnAction={form.register}
          />
          <Button type='submit' loading={mutation.isPending}>
            Submit
          </Button>
          {(mutation.isError || !!clientErrorLabel) && (
            <div className='mt-xl'>
              <AlertBanner
                label={serverErrorLabel ?? clientErrorLabel ?? 'Register gagal'}
                variant='danger'
              />
            </div>
          )}
          {mutation.isSuccess && (
            <div className='mt-xl'>
              <AlertBanner label='Registered' variant='success' />
            </div>
          )}
          <p className='text-sm md:text-md font-semibold text-neutral-300 text-center'>
            Already have an account?{' '}
            <a
              href='/login'
              className='text-primary-200 text-sm md:text-md font-bold'
            >
              Log in
            </a>
          </p>
        </form>
      </AuthCard>
    </AuthTemplate>
  );
}
