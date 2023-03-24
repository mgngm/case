import useMediaQuery from '@mui/material/useMediaQuery';
import capitalize from 'lodash/capitalize';
import exports from 'styles/_exports.module.scss';

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

/**
 * hook that acts on media query break points
 */
export default function useBreakpoint(device: Breakpoint, dir: 'above' | 'below' = 'above') {
  const width = exports[`breakpoint${capitalize(device)}`];
  const d = dir === 'above' ? 'min' : 'max';

  return useMediaQuery(`(${d}-width:${width})`);
}
