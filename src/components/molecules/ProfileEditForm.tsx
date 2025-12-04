'use client';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchMe, Me, UpdateMeInput } from '../../lib/api/me';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TextField from '../molecules/TextField';
import { Button } from '../ui/button';
import Avatar from '../atoms/Avatar';
import Input from '../atoms/Input';

const fileListSchema = z.custom<FileList>(
  (v) => typeof FileList !== 'undefined' && v instanceof FileList,
  {
    message: 'Invalid file list',
  }
);
const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  username: z
    .string()
    .min(3, 'Min length 3')
    .regex(/^[a-zA-Z0-9_\.\-]+$/, 'Only letters, numbers, _ . -'),
  phone: z
    .string()
    .min(8, 'Min length 8')
    .regex(/^\+?\d{8,15}$/i, 'Invalid phone'),
  bio: z.string().optional(),
  avatar: fileListSchema.optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ProfileEditForm({
  me,
  prefill,
  onDoneAction,
}: {
  me: Me;
  prefill?: Partial<Me>;
  onDoneAction?: () => void;
}) {
  const token = useSelector((s: RootState) => s.auth.token) as string;
  const qc = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: me.name ?? '',
      username: me.username ?? '',
      phone: me.phone ?? '',
      bio: me.bio ?? '',
    },
  });
  useEffect(() => {
    if (prefill) {
      form.reset({
        name: prefill.name ?? form.getValues().name ?? '',
        username: prefill.username ?? form.getValues().username ?? '',
        phone: prefill.phone ?? form.getValues().phone ?? '',
        bio: prefill.bio ?? form.getValues().bio ?? '',
        avatar: undefined,
      });
    }
  }, [prefill, form]);
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const files =
        values.avatar && values.avatar.length > 0 ? values.avatar[0] : null;
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
      <div className='flex flex-col items-center gap-xl'>
        <Avatar size={96} src={prefill?.avatarUrl ?? me.avatarUrl} />
        <label className='rounded-full border border-neutral-700 text-neutral-25 px-4xl py-sm cursor-pointer'>
          Change Photo
          <input
            type='file'
            accept='image/png,image/jpeg,image/webp'
            {...form.register('avatar')}
            className='hidden'
          />
        </label>
      </div>
      <TextField<FormValues>
        label='Name'
        name='name'
        placeholder='Your name'
        error={form.formState.errors.name}
        registerFnAction={form.register}
      />
      <TextField<FormValues>
        label='Username'
        name='username'
        placeholder='Your username'
        error={form.formState.errors.username}
        registerFnAction={form.register}
      />
      <div className='flex flex-col gap-xs'>
        <label className='text-sm text-neutral-200'>Email</label>
        <Input value={me.email ?? ''} disabled />
      </div>
      <TextField<FormValues>
        label='Number Phone'
        name='phone'
        placeholder='Your phone'
        error={form.formState.errors.phone}
        registerFnAction={form.register}
      />
      <div className='flex flex-col gap-xs'>
        <label className='text-sm text-neutral-200'>Bio</label>
        <textarea
          {...form.register('bio')}
          className={`w-full rounded-md bg-neutral-900 text-neutral-25 placeholder:text-neutral-500 px-md py-sm border ${form.formState.errors.bio ? 'border-red-500' : 'border-neutral-700'} focus:outline-none focus:ring-2 focus:ring-primary-200`}
          rows={4}
          placeholder='Your bio'
        />
      </div>
      <Button type='submit'>Save</Button>
    </form>
  );
}
