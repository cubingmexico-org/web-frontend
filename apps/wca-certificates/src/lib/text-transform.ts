import { Extension } from '@tiptap/core'

export interface TextTransformOptions {
  types: string[],
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textTransform: {
      setTransform: (transform: 'uppercase' | 'lowercase' | 'capitalize') => ReturnType,
      unsetTransform: () => ReturnType,
    }
  }
}

export const TextTransform = Extension.create<TextTransformOptions>({
  name: 'textTransform',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          transform: {
            default: 'none',
            parseHTML: element => {
              const transform = element.style.textTransform
              return transform
            },
            renderHTML: attributes => {
              if (attributes.transform !== 'none') {
                return { style: `text-transform: ${attributes.transform}` }
              }

              return {}
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setTransform: (transform) => ({ commands }) => {
        return this.options.types
          .map(type => commands.updateAttributes(type, { transform }))
          .every(response => response)
      },

      unsetTransform: () => ({ commands }) => {
        return this.options.types
          .map(type => commands.resetAttributes(type, 'transform'))
          .every(response => response)
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-u': () => this.editor.commands.setTransform('uppercase'),
      'Mod-Shift-l': () => this.editor.commands.setTransform('lowercase'),
      'Mod-Shift-c': () => this.editor.commands.setTransform('capitalize'),
      'Mod-Shift-n': () => this.editor.commands.unsetTransform(),
    }
  },
})