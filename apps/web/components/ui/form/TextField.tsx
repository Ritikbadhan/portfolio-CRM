'use client';

import { TextField as MuiTextField, TextFieldProps as MuiTextFieldProps } from '@mui/material';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

export type TextFieldProps<T extends FieldValues> = Omit<MuiTextFieldProps, 'name'> & {
  name: Path<T>;
  control: Control<T>;
};

export function TextField<T extends FieldValues>({ name, control, ...props }: TextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MuiTextField
          {...field}
          {...props}
          error={!!error}
          helperText={error?.message || props.helperText}
          fullWidth
        />
      )}
    />
  );
}
