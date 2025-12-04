'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchMe, Me, UpdateMeInput } from '../../lib/api/me';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TextField from '../molecules/TextField';
import { Button } from '../ui/button';

const schema = z.object({
  name: z.string().min(1).optional(),
  username: z.string().min(3).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.any().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ProfileEditForm({
  me,
  onDoneAction,
}: {
  me: Me;
  onDoneAction?: () => void;
}) {
  const token = useSelector((s: RootState) => s.auth.token) as string;
  const qc = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: me.name,
      username: me.username,
      phone: me.phone,
      bio: me.bio,
    },
  });
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const files = (values.avatar as FileList | undefined)?.[0] || null;
      const input: UpdateMeInput = {
        name: values.name ?? undefined,
        username: values.username ?? undefined,
        phone: values.phone ?? undefined,
        bio: values.bio ?? undefined,
        avatar: files,
      };
      return patchMe(token, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] });
      onDoneAction?.();
    },
  });

  return (
    <form
      className='mt-2xl rounded-2xl bg-neutral-900 border border-neutral-800 p-3xl flex flex-col gap-xl'
      onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
    >
      <TextField<FormValues>
        label='Name'
        name='name'
        placeholder='Your name'
        registerFnAction={form.register}
      />
      <TextField<FormValues>
        label='Username'
        name='username'
        placeholder='Your username'
        registerFnAction={form.register}
      />
      <TextField<FormValues>
        label='Phone'
        name='phone'
        placeholder='Your phone'
        registerFnAction={form.register}
      />
      <TextField<FormValues>
        label='Bio'
        name='bio'
        placeholder='Your bio'
        registerFnAction={form.register}
      />
      <input
        type='file'
        accept='image/png,image/jpeg,image/webp'
        {...form.register('avatar')}
        className='text-neutral-25'
      />
      <Button type='submit'>Save</Button>
    </form>
  );
}
