export const globalCss = {
  extend: {
    '*': {
      '--global-color-border': 'colors.border',
      '--global-color-placeholder': 'colors.fg.subtle',
      '--global-color-selection': 'colors.colorPalette.subtle.bg',
      '--global-color-focus-ring': 'colors.colorPalette.solid.bg',
      boxSizing: 'border-box',
    },
    html: {
      colorPalette: 'indigo',
      fontFamily: 'body',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    body: {
      background: 'canvas',
      color: 'fg.default',
    },
    '::selection': {
      bg: 'indigo.a3',
      color: 'fg.default',
    },
    '::-webkit-scrollbar': {
      width: '6px',
      height: '6px',
    },
    '::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '::-webkit-scrollbar-thumb': {
      background: '{colors.gray.a4}',
      borderRadius: '3px',
      _hover: {
        background: '{colors.gray.a5}',
      },
    },
    // TipTap editor styles
    '.tiptap': {
      '& > * + *': {
        marginTop: '0.6em',
      },
      '& h1': {
        fontSize: '1.875rem',
        fontWeight: 'bold',
        lineHeight: '1.25',
        letterSpacing: '-0.025em',
        color: 'fg.default',
        mt: '1.5em',
        mb: '0.5em',
        '&:first-child': { mt: 0 },
      },
      '& h2': {
        fontSize: '1.375rem',
        fontWeight: 'semibold',
        lineHeight: '1.3',
        letterSpacing: '-0.015em',
        color: 'fg.default',
        mt: '1.4em',
        mb: '0.4em',
      },
      '& h3': {
        fontSize: '1.125rem',
        fontWeight: 'semibold',
        lineHeight: '1.4',
        color: 'fg.default',
        mt: '1.2em',
        mb: '0.3em',
      },
      '& p': {
        lineHeight: '1.75',
        fontSize: '0.9375rem',
        color: 'fg.default',
      },
      '& ul, & ol': {
        paddingLeft: '1.5em',
        fontSize: '0.9375rem',
      },
      '& ul': {
        listStyleType: 'disc',
      },
      '& ol': {
        listStyleType: 'decimal',
      },
      '& li': {
        lineHeight: '1.75',
        '& > p': {
          margin: 0,
        },
      },
      '& blockquote': {
        borderLeft: '3px solid',
        borderColor: 'indigo.7',
        paddingLeft: '1em',
        color: 'fg.muted',
        fontStyle: 'italic',
        my: '1em',
      },
      '& code': {
        bg: 'gray.a3',
        borderRadius: '4px',
        px: '0.35em',
        py: '0.15em',
        fontSize: '0.85em',
        fontFamily: 'mono',
        color: 'indigo.11',
      },
      '& pre': {
        bg: '{colors.gray.2}',
        borderRadius: '8px',
        p: '4',
        overflow: 'auto',
        border: '1px solid',
        borderColor: 'border.default',
        '& code': {
          bg: 'transparent',
          p: 0,
          fontSize: '0.85em',
          color: 'fg.default',
        },
      },
      '& hr': {
        border: 'none',
        borderTop: '1px solid',
        borderColor: 'border.default',
        my: '2em',
      },
      '& strong': {
        fontWeight: 'bold',
      },
      '& em': {
        fontStyle: 'italic',
      },
      '& u': {
        textDecoration: 'underline',
        textUnderlineOffset: '2px',
      },
      '& s': {
        textDecoration: 'line-through',
      },
      '& mark': {
        bg: '{colors.indigo.a3}',
        borderRadius: '2px',
        px: '2px',
      },
      // Task list styles
      '& ul[data-type="taskList"]': {
        listStyle: 'none',
        paddingLeft: 0,
        '& li': {
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5em',
          '& > label': {
            flexShrink: 0,
            marginTop: '0.3em',
            '& input[type="checkbox"]': {
              cursor: 'pointer',
              accentColor: 'var(--colors-indigo-9)',
              width: '16px',
              height: '16px',
            },
          },
          '& > div': {
            flex: 1,
          },
        },
        '& li[data-checked="true"]': {
          '& > div > p': {
            textDecoration: 'line-through',
            color: 'fg.muted',
          },
        },
      },
    },
  },
}
