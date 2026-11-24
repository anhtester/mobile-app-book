import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect, forwardRef, useCallback } from 'react';

import { Stack, TextField, Autocomplete, FormHelperText, type TextFieldProps } from '@mui/material';

import { useRequest } from 'src/hooks/use-request';

import { axios } from 'src/api/axios';

import { LabelBorder } from '../label/label-border';

type AddressFieldProps = { value: string | null; onChange: (value: string | null) => void } & Omit<
  TextFieldProps,
  'ref' | 'value' | 'onChange'
>;

const decodeAddress = (address: string) => {
  const d = address.split(', ');
  if (d.length >= 3) {
    return {
      address: d.slice(0, -2).join(', ') ?? '',
      ward: d.at(-2) ?? '',
      div: d.at(-1) ?? '',
    };
  }
  if (d.length === 2) {
    return {
      address: '',
      ward: d[0] ?? '',
      div: d[1] ?? '',
    };
  }
  return {
    address: '',
    ward: '',
    div: d[0],
  };
};

// Hàm cấp module (tham chiếu cố định): callback viết thẳng vào useRequest chỉ ổn định khi React
// Compiler tối ưu được component, nó bỏ qua là mỗi lần render gọi API lại ⇒ vòng lặp (2026-11-25)
const getDivisions = () => axios.get('/address').then((res) => res.data as string[]);

const encodeAddress = (address: string, ward: string, div: string) =>
  [address, ward, div].filter(x=>x.trim()).join(', ');

export const AddressField = forwardRef<HTMLDivElement, AddressFieldProps>(
  ({ value, onChange, disabled, error, helperText }, ref) => {
    const [div, setDiv] = useState<string>('');
    const [ward, setWard] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const flagUserHandle = useRef<boolean>(false);
    const { t } = useTranslation();

    const { data: listDiv = [], loading: isLoadingDiv } = useRequest(getDivisions);

    const { data: listWard = [], loading: isLoadingWard } = useRequest(
      useCallback(
        () =>
          !div
            ? (new Promise((resolve) => resolve([])) as Promise<string[]>)
            : axios.get(`/address/${div}`).then((res) => res.data as string[]),
        [div]
      )
    );

    useEffect(() => {
      if (encodeAddress(address, div, ward) !== value) {
        if (flagUserHandle.current) {
          onChange(encodeAddress(address, ward, div));
          flagUserHandle.current = false;
        } else {
          const { address: a, div: d, ward: w } = decodeAddress(value || '');
          setDiv(d);
          setWard(w);
          setAddress(a);
        }
      }
    }, [address, div, onChange, value, ward]);

    return (
      <Stack>
        <Stack
          tabIndex={0}
          ref={ref}
          gap={2}
          border={1}
          sx={{
            // borderStyle: 'dashed',
            borderColor: 'divider',
            borderRadius: 1,
            position: 'relative',
            mx: -1.5,
            mb: -1.5,
            p: 1.5,
            pt: 2.5,
            ...(disabled && { opacity: 0.8, pointerEvents: 'none' }),
            ...(error && {
              borderColor: 'error.main',
            }),
          }}
        >
          <LabelBorder error={error}>{t('common.fields.address')}</LabelBorder>
          <Autocomplete
            id="address-division"
            value={div}
            onChange={(_, e) => {
              setDiv(e || '');
              setWard('');
              setAddress('');
              flagUserHandle.current = true;
            }}
            options={listDiv}
            loading={isLoadingDiv}
            renderInput={(params) => (
              <TextField error={error} {...params} fullWidth label={t('user.address.division')} />
            )}
          />

          <Autocomplete
            value={ward}
            id="address-ward"
            onChange={(_, e) => {
              setWard(e || '');
              setAddress('');
              flagUserHandle.current = true;
            }}
            options={listWard}
            loading={isLoadingWard}
            disabled={!div}
            renderInput={(params) => <TextField error={error} {...params} fullWidth label={t('user.address.ward')} />}
          />

          <TextField
            id="address"
            disabled={!ward || !div}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              flagUserHandle.current = true;
            }}
            error={error}
            multiline
            minRows={2}
            fullWidth
            label={t('user.address.detail')}
          />
        </Stack>
        {helperText && (
          <FormHelperText error={error} sx={{ px: 2 }}>
            {helperText}
          </FormHelperText>
        )}
      </Stack>
    );
  }
);
