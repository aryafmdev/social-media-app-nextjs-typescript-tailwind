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

  const mutation = useMutation({
    mutationFn: async (data: LoginValues) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Login gagal');
      return res.json();
    },
    onSuccess: (data) => {
      const token: string | undefined = data?.token;
      dispatch(setAuth({ token, user: { email: form.getValues().email } }));
      saveAuth(token, { email: form.getValues().email });
      router.push('/');
    },
  });

  const onSubmit = (values: LoginValues) => mutation.mutate(values);

  return (
    <AuthTemplate>
      <AuthCard 
      title='Welcome Back!'
      className="w-[clamp(345px,30.97vw,446px)]">
        <form
          className='flex flex-col gap-xl md:gap-3xl w-[clamp(313px,27.63vw,398px)] justify-self-center'
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
          <p className='text-sm text-neutral-300 text-center'>
            Don`t have an account?{' '}
            <a href='/register' className='text-primary-200 font-medium'>
              Register
            </a>
          </p>
        </form>
      </AuthCard>
    </AuthTemplate>
  );
}
