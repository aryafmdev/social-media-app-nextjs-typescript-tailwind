'use client';
import { useState } from 'react';
import Input from '../atoms/Input';
import HelperText from '../atoms/HelperText';
import { FieldError, FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { Icon } from '@iconify/react';

type Props<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  placeholder?: string;
  error?: FieldError;
  registerFnAction?: UseFormRegister<T>;
};

export default function PasswordField<T extends FieldValues>({
  label,
  name,
  placeholder,
  error,
  registerFnAction,
}: Props<T>) {
  const [show, setShow] = useState(false);
  return (
    <div className='flex flex-col gap-xs'>
      <label className='text-sm font-bold text-neutral-200'>{label}</label>
      <div className='relative'>
        <Input
          {...(registerFnAction ? registerFnAction(name) : {})}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          invalid={!!error}
          className='pr-7xl'
        />
        <button
          type='button'
          className='absolute right-md top-1/2 -translate-y-1/2 text-neutral-400'
          onClick={() => setShow((s) => !s)}
        >
          {show ? (
            <Icon icon="iconamoon:eye-off" className="size-5" />
          ) : (
            <Icon icon="iconamoon:eye" className="size-5" />
          )}
        </button>
      </div>
      <HelperText text={error?.message} />
    </div>
  );
}
