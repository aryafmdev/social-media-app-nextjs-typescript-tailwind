'use client';
import Input from '../atoms/Input';
import HelperText from '../atoms/HelperText';
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';

type Props<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  error?: FieldError;
  registerFnAction?: UseFormRegister<T>;
};

export default function TextField<T extends FieldValues>({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  registerFnAction,
}: Props<T>) {
  return (
    <div className='flex flex-col gap-xs'>
      <label className='text-sm text-neutral-200'>{label}</label>
      <Input
        {...(registerFnAction ? registerFnAction(name) : {})}
        type={type}
        placeholder={placeholder}
        invalid={!!error}
      />
      <HelperText text={error?.message} />
    </div>
  );
}
