export const globalCss = {
  extend: {
    '*': {
      '--global-color-border': 'colors.border',
      '--global-color-placeholder': 'colors.fg.subtle',
      '--global-color-selection': 'colors.colorPalette.subtle.bg',
      '--global-color-focus-ring': 'colors.colorPalette.solid.bg',
    },
    html: {
      colorPalette: 'gray',
    },
    body: {
      background: 'canvas',
      color: 'fg.default',
    },
    // TipTap editor styles
    '.tiptap': {
      '& > * + *': {
        marginTop: '0.5em',
      },
      '& h1': {
        fontSize: '2xl',
        fontWeight: 'bold',
        lineHeight: '1.3',
      },
      '& h2': {
        fontSize: 'xl',
        fontWeight: 'semibold',
        lineHeight: '1.3',
      },
      '& h3': {
        fontSize: 'lg',
        fontWeight: 'semibold',
        lineHeight: '1.4',
      },
      '& p': {
        lineHeight: '1.7',
        fontSize: 'sm',
      },
      '& ul, & ol': {
        paddingLeft: '1.5em',
        fontSize: 'sm',
      },
      '& ul': {
        listStyleType: 'disc',
      },
      '& ol': {
        listStyleType: 'decimal',
      },
      '& li': {
        lineHeight: '1.7',
        '& > p': {
          margin: 0,
        },
      },
      '& blockquote': {
        borderLeft: '3px solid',
        borderColor: 'border.default',
        paddingLeft: '1em',
        color: 'fg.subtle',
        fontStyle: 'italic',
      },
      '& code': {
        bg: 'bg.muted',
        borderRadius: 'sm',
        px: '1',
        py: '0.5',
        fontSize: 'xs',
        fontFamily: 'monospace',
      },
      '& pre': {
        bg: 'bg.muted',
        borderRadius: 'md',
        p: '3',
        overflow: 'auto',
        '& code': {
          bg: 'transparent',
          p: 0,
          fontSize: 'xs',
        },
      },
      '& hr': {
        border: 'none',
        borderTop: '1px solid',
        borderColor: 'border.default',
        my: '4',
      },
      '& strong': {
        fontWeight: 'bold',
      },
      '& em': {
        fontStyle: 'italic',
      },
      '& u': {
        textDecoration: 'underline',
      },
      '& s': {
        textDecoration: 'line-through',
      },
      '& mark': {
        bg: 'yellow.3',
        borderRadius: 'sm',
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
            marginTop: '0.25em',
            '& input[type="checkbox"]': {
              cursor: 'pointer',
              accentColor: 'var(--colors-color-palette-solid-bg)',
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
