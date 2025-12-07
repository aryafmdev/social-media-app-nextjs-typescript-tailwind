'use client';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { createPost } from '../../lib/api/posts';
import { Button } from '../ui/button';
import Image from 'next/image';
import AlertBanner from '../organisms/AlertBanner';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

const fileListSchema = z.custom<FileList>((v) => v instanceof FileList).superRefine((v, ctx) => {
  if (!v || v.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Image is required or make sure file max 5MB',
    });
    return;
  }

  const file = v[0];

  if (file.size > 5 * 1024 * 1024) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Image too large (max 5MB)',
    });
  }

  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Only PNG/JPG/WEBP allowed',
    });
  }
});

const schema = z.object({
  image: fileListSchema,
  caption: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AddPostForm() {
  const token = useSelector((s: RootState) => s.auth.token) as string;
  const router = useRouter();
  const qc = useQueryClient();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), mode: 'onChange'});

  const watchedImage = useWatch({ control: form.control, name: 'image' });
  const previewFile = useMemo(() => {
    const f = watchedImage && watchedImage.length > 0 ? watchedImage[0] : null;
    if (!f) return undefined;
    const file = f as File;
    if (
      !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      return undefined;
    }
    return file;
  }, [watchedImage]);
  const previewDataUrl = useMemo(
    () => (previewFile ? URL.createObjectURL(previewFile) : undefined),
    [previewFile]
  );
  useEffect(() => {
    return () => {
      if (previewDataUrl) URL.revokeObjectURL(previewDataUrl);
    };
  }, [previewDataUrl]);

  const [serverErrorLabel, setServerErrorLabel] = useState<string | null>(null);
  const mut = useMutation({
    mutationFn: async (v: FormValues) => {
      const file = v.image?.[0] as File;
      if (!file) throw new Error('Image is required or make sure file max 5MB');
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        throw new Error('Only PNG/JPG/WEBP allowed');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image too large (max 5MB)');
      }
      return createPost(token, { image: file, caption: v.caption });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feed'] });
      setServerErrorLabel(null);
      router.replace('/?posted=1');
    },
    onError: (err) => {
      const label = err instanceof Error ? err.message : 'Failed to post';
      setServerErrorLabel(label);
    },
  });

  return (
    <form
      className='flex flex-col gap-xl'
      onSubmit={form.handleSubmit((v) => mut.mutate(v))}
    >
      <div className='flex flex-col gap-xs'>
        <label className='text-neutral-25 font-bold text-sm'>Photo</label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            const dt = new DataTransfer();
            for (let i = 0; i < files.length && i < 1; i++)
              dt.items.add(files[i]);
            form.setValue('image', dt.files, { shouldValidate: true });
          }}
          className={`rounded-xl border ${
            form.formState.errors.image
              ? 'border-red-500 border-dashed'
              : 'border-neutral-900 border-dashed'
          } bg-neutral-950 p-2xl flex flex-col items-center justify-center gap-md`}
        >
          {!previewDataUrl && (
            <>
              <button
                type='button'
                className='rounded-lg size-10 bg-neutral-950 border border-neutral-900 text-neutral-25 flex items-center justify-center cursor-pointer'
                onClick={() => {
                  document.getElementById('image-input')?.click();
                }}
              >
                <Icon icon='lucide:cloud-upload' className='size-5' />
              </button>
              <div>
                <span
                  className='text-primary-200 text-sm font-bold cursor-pointer'
                  onClick={() =>
                    document.getElementById('image-input')?.click()
                  }
                >
                  Click to upload
                </span>
                <span className='text-neutral-600 text-sm'>
                  {' '}
                  or drag and drop
                </span>
              </div>
              <span className='text-neutral-600 text-sm'>
                PNG or JPG (max. 5mb)
              </span>
            </>
          )}
          {previewDataUrl && (
            <div className='w-full rounded-lg overflow-hidden'>
              <Image
                src={previewDataUrl}
                alt='preview'
                width={800}
                height={450}
                className='w-full h-auto rounded-lg object-cover'
                unoptimized
              />
              <div className='mt-xl flex gap-xl'>
                <label className='w-full rounded-lg px-3xl h-[40px] bg-neutral-900 border border-neutral-900 text-neutral-25 font-medium text-sm flex items-center justify-center gap-md cursor-pointer'>
                  <Icon
                    icon='fluent:arrow-upload-24-filled'
                    className='size-5'
                  />
                  Change Image
                  <input
                    id='image-input'
                    type='file'
                    accept='image/png,image/jpeg,image/webp'
                    {...form.register('image', {
                      onChange: (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files) {
                          form.setValue('image', files, {
                            shouldValidate: true,
                          });
                        }
                      },
                    })}
                    className='hidden'
                  />
                </label>
                <button
                  type='button'
                  className='w-full rounded-lg px-3xl h-[40px] bg-neutral-900 border border-neutral-900 text-accent-red font-medium text-sm flex items-center justify-center gap-md cursor-pointer'
                  onClick={() => form.resetField('image')}
                >
                  <Icon icon='streamline:recycle-bin-2' className='size-5' />
                  Delete Image
                </button>
              </div>
            </div>
          )}
          {!previewDataUrl && (
            <input
              id='image-input'
              type='file'
              accept='image/png,image/jpeg,image/webp'
              {...form.register('image', {
                onChange: (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) {
                    form.setValue('image', files, { shouldValidate: true });
                  }
                },
              })}
              className='hidden'
            />
          )}
        </div>
        {form.formState.errors.image && (
          <span className='text-[#B41759] text-sm'>
            {form.formState.errors.image.message}
          </span>
        )}
      </div>
      <div className='flex flex-col gap-xs'>
        <label className='text-neutral-25 font-bold text-sm'>Caption</label>
        <textarea
          {...form.register('caption')}
          className={`w-full rounded-md bg-neutral-950 text-neutral-25 text-md placeholder:text-neutral-600 px-md py-sm border ${
            form.formState.errors.caption
              ? 'border-red-500'
              : 'border-neutral-900'
          } focus:outline-none focus:ring-2 focus:ring-primary-200`}
          rows={4}
          placeholder='Create your caption'
        />
        {form.formState.errors.caption && (
          <span className='text-[#B41759] text-sm'>
            {form.formState.errors.caption.message?.toString()}
          </span>
        )}
      </div>
      <Button
        type='submit'
        disabled={mut.isPending}
        className='w-full rounded-full h-[40px] bg-primary-300 hover:bg-primary-200 text-neutral-25 font-bold text-sm cursor-pointer flex items-center justify-center gap-sm'
      >
        {mut.isPending ? (
          <>
            <Icon
              icon='line-md:loading-twotone-loop'
              className='size-5 animate-spin'
            />
            Posting...
          </>
        ) : (
          'Share'
        )}
      </Button>
      {(mut.isError || !!serverErrorLabel) && (
        <AlertBanner
          label={serverErrorLabel ?? 'Failed to post'}
          variant='danger'
        />
      )}
    </form>
  );
}
