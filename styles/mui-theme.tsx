import { Close } from '@mui/icons-material';
import type { ButtonProps } from '@mui/material';
import {
  tableRowClasses,
  inputBaseClasses,
  alpha,
  buttonClasses,
  createTheme,
  iconButtonClasses,
  tabClasses,
  tableCellClasses,
  tablePaginationClasses,
  tableSortLabelClasses,
  tabsClasses,
  toggleButtonGroupClasses,
} from '@mui/material';
import type { DataType } from 'csstype';
import exports from './_exports.module.scss';

export const toRem = (px: number) => `${px / 16}rem`;

const emphasisAlphas = {
  high: 0.87,
  medium: 0.6,
  disabled: 0.38,
  divider: 0.12,
} as const;

export const emphasis = (color: Parameters<typeof alpha>[0], emphasis: keyof typeof emphasisAlphas) =>
  alpha(color, emphasisAlphas[emphasis]);

declare module '@mui/material/styles/createMixins' {
  // Allow for custom mixins to be added
  interface Mixins {
    toRem: typeof toRem;
    emphasis: typeof emphasis;
    adminButton: (color?: Exclude<ButtonProps['color'], 'inherit'>) => CSSProperties;
    disabledButtonLight: {
      text: CSSProperties;
      outlined: CSSProperties;
      contained: CSSProperties;
    };
    lightTheme: {
      button: (config?: { selected?: boolean; accentColor?: DataType.Color }) => CSSProperties;
      tabs: () => CSSProperties;
    };
  }
}

const theme = createTheme({
  typography: {
    fontFamily: exports.fontFamily,
    button: {
      textTransform: 'none',
      fontSize: toRem(16),
    },
  },
  mixins: {
    toRem,
    emphasis,
    adminButton: (color = 'secondary') => ({
      borderColor: theme.palette[color].main,
      color: 'white',
      [`.${buttonClasses.endIcon}, .${buttonClasses.startIcon}`]: {
        color: theme.palette[color].main,
      },
      '&:hover': {
        borderColor: theme.palette[color].light,
      },
    }),
    disabledButtonLight: {
      text: {
        color: emphasis('#fff', 'disabled'),
      },
      outlined: {
        color: emphasis('#fff', 'disabled'),
        borderColor: emphasis('#fff', 'divider'),
      },
      contained: {
        color: emphasis('#fff', 'disabled'),
        borderColor: emphasis('#fff', 'divider'),
        backgroundColor: emphasis('#fff', 'divider'),
      },
    },
    lightTheme: {
      button: ({ selected, accentColor = exports.lightThemeButtonIconColor } = {}) => ({
        background: selected ? 'linear-gradient(180deg, #53387e 0%, #1a094b 100%)' : exports.lightThemeButtonGradient,
        color: selected ? '#fff' : exports.lightThemeButtonColor,
        borderColor: selected ? '#1A094B' : exports.lightThemeButtonBorder,
        outline: exports.lightThemeButtonOutline,
        transition: 'background 0.5s ease',
        '&:hover': {
          background: selected
            ? 'linear-gradient(180deg, #53387e 0%, #1a094b 100%)'
            : exports.lightThemeButtonHoverGradient,
          borderColor: selected ? '#1A094B' : exports.lightThemeButtonHoverBorder,
        },
        '&:not(:disabled)': {
          ['.' + buttonClasses.startIcon + ', .' + buttonClasses.endIcon]: {
            color: accentColor,
          },
        },
      }),
      tabs: () => ({
        paddingX: '20px',
        marginX: '-20px',
        minHeight: '38px',
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          borderBottom: '1px solid',
          borderColor: exports.lightThemeButtonBorder,
        },
        ['.' + tabsClasses.flexContainer]: {
          gap: '10px',
        },
        ['.' + tabsClasses.indicator]: {
          zIndex: 10,
          backgroundColor: '#fff',
        },
        ['.' + tabClasses.root]: {
          ...theme.mixins.lightTheme.button(),
          borderWidth: '1px 1px 0',
          borderStyle: 'solid',
          borderRadius: '6px 6px 0 0',
          minHeight: '38px',
          ['&.Mui-selected']: {
            background: '#fff',
            color: exports.lightThemeButtonColor,
          },
        },
      }),
    },
  },
  palette: {
    background: {
      default: exports.background,
      paper: exports.paper,
    },
    primary: { main: exports.primary, contrastText: exports.onPrimary },
    secondary: { main: exports.secondary },
    error: { main: exports.error },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: ({ theme }) => ({
          [theme.breakpoints.down('lg')]: {
            fontSize: toRem(14),
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          borderColor: exports.buttonOutline,
        },
        contained: ({ ownerState, theme }) => ({
          border: `1px solid ${
            theme.palette[ownerState.color && ownerState.color !== 'inherit' ? ownerState.color : 'primary'].dark
          }`,
          background:
            ownerState.color === 'primary' && !ownerState.disabled
              ? `linear-gradient(189.05deg, ${exports.buttonDark} 9.71%, ${exports.buttonLight} 95.98%)`
              : undefined,
          padding: '5px 15px',
          '&, &:hover, &:focus': {
            boxShadow: 'none',
          },
          '&:disabled': {
            borderColor: theme.palette.divider,
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.shape.borderRadius,
        }),
      },
      defaultProps: {
        deleteIcon: <Close />,
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          background: `linear-gradient(189.05deg, ${exports.buttonDark} 9.71%, ${exports.buttonLight} 95.98%)`,
          color: exports.onPrimary,
          marginBottom: 16,
          [`& + .${tabsClasses.root}`]: {
            marginTop: -16,
            marginBottom: 16,
            [`.${tabClasses.root}`]: {
              padding: '12px 24px',
            },
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderTop: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 48,
        },
      },
    },
    MuiInputBase: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          boxShadow: `inset 0px 0px 6px ${alpha('#000', 0.1)}`,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          color: 'transparent',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 10,
          borderRadius: 5,
        },
        rail: {
          opacity: 1,
          backgroundColor: '#EFEFEF',
          border: '1px solid rgba(0,0,0, 0.1)',
        },
        track: {
          opacity: 0.5,
        },
        mark: {
          height: 4,
          width: 4,
          borderRadius: 2,
        },
        thumb: ({ theme }) => ({
          '&::before': {
            boxShadow: 'none',
          },
          height: 24,
          width: 24,
          color: '#fff',
          border: `5px solid ${theme.palette.primary.main}`,
          [`.Mui-disabled &`]: {
            borderColor: '#bdbdbd',
          },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: exports.purpleText,
          borderBottom: 'none',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: `1px solid ${exports.darkPurple}`,
        },
      },
    },
    MuiTableFooter: {
      styleOverrides: {
        root: {
          backgroundColor: exports.darkPurple,
          color: 'white',
          [`.${tablePaginationClasses.root}`]: {
            color: emphasis('#fff', 'high'),
            [`.${tablePaginationClasses.selectIcon}`]: {
              color: emphasis('#fff', 'medium'),
            },
            [`.${tablePaginationClasses.actions}`]: {
              [`.${iconButtonClasses.root}`]: {
                color: emphasis('#fff', 'high'),
                '&:hover': {
                  backgroundColor: alpha('#fff', 0.04),
                },
                [`&.${iconButtonClasses.disabled}`]: {
                  color: emphasis('#fff', 'disabled'),
                },
              },
            },
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(180deg, #53387e 0%, #1a094b 100%)',
          color: 'white',
          [`.${tableCellClasses.root}`]: {
            color: emphasis('#fff', 'high'),
            fontSize: toRem(15),
            fontWeight: 700,
            [`.${tableSortLabelClasses.root}`]: {
              '&:focus': {
                color: emphasis('#fff', 'high'),
              },
              '&:hover': {
                color: emphasis('#fff', 'medium'),
              },
              '&.Mui-disabled, &:disabled': {
                color: emphasis('#fff', 'disabled'),
                [`.${tableSortLabelClasses.icon}`]: {
                  opacity: 0.15,
                },
              },
              '&.Mui-active': {
                color: emphasis('#fff', 'high'),
                [`.${tableSortLabelClasses.icon}`]: {
                  opacity: 1,
                },
              },
              [`.${tableSortLabelClasses.icon}`]: {
                color: 'white',
                opacity: emphasisAlphas.disabled,
              },
            },
          },
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          ['.' + inputBaseClasses.root]: {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even):not(.Mui-selected)': {
            backgroundColor: alpha('#000', 0.04),
            [`&.${tableRowClasses.hover}:hover`]: {
              backgroundColor: alpha('#000', 0.08),
            },
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: 40,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: '#866bb1',
          borderColor: '#53387e',
          borderRadius: 40,
          fontSize: toRem(16),
          fontWeight: 'bold',
          padding: '7px 25px',
          '&:hover': {
            backgroundColor: alpha('#fff', 0.04),
          },
          '&.Mui-selected': {
            borderColor: '#c4aaf6',
            color: 'white',
            backgroundColor: alpha('#fff', 0.08),
            '&:hover': {
              backgroundColor: alpha('#fff', 0.12),
            },
            [`&.${toggleButtonGroupClasses.grouped}:not(:first-of-type)`]: {
              borderLeftColor: '#c4aaf6',
            },
          },
        },
      },
    },
  },
});

export default theme;
