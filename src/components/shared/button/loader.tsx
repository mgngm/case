import type { ComponentPropsWithoutRef } from 'react';
import { useMemo } from 'react';
import { useTheme } from '@mui/material';
import type { Theme } from '@mui/material';
import Box from '@mui/material/Box';
import { MoonLoader } from 'react-spinners';
import { arrayIncludes, satisfies } from 'src/logic/libs/helpers';

const allowColors = satisfies<readonly (keyof Theme['palette'])[]>()([
  'primary',
  'secondary',
  'error',
  'success',
] as const);

interface ButtonLoadingIndicatorProps extends Partial<ComponentPropsWithoutRef<typeof MoonLoader>> {
  // allow {} to enable autocompletion but also arbitrary strings https://github.com/microsoft/TypeScript/issues/29729
  // eslint-disable-next-line @typescript-eslint/ban-types
  color?: typeof allowColors[number] | (string & {});
}

const ButtonLoadingIndicator = ({ color = 'primary', size = 18, ...props }: ButtonLoadingIndicatorProps) => {
  const theme = useTheme();
  const finalColor = useMemo(
    () => (arrayIncludes(allowColors, color) ? theme.palette[color].main : color),
    [color, theme]
  );
  return (
    <Box sx={{ display: 'flex', textAlign: 'start' }}>
      <MoonLoader color={finalColor} size={size} {...props} />
    </Box>
  );
};

export default ButtonLoadingIndicator;
