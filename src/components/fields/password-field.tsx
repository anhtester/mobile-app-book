import { useState, forwardRef } from 'react';

import { TextField, IconButton, InputAdornment, type TextFieldProps } from '@mui/material';

import { Iconify } from '../iconify';

type PasswordFieldProps = TextFieldProps;

// Mỗi ô có state hiện/ẩn riêng (trước đây dùng chung một store nên bấm một ô thì mọi ô cùng hiện).
// `ref` gắn vào thẻ <input> để react-hook-form focus được vào ô khi có lỗi.
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordFieldInner({ slotProps, ...props }, ref) {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <TextField
        {...props}
        inputRef={ref}
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          ...slotProps,
          input: {
            ...(slotProps?.input as object),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                >
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    );
  }
);
