/**
 * MarkdownViewer Molecule Stories
 */

import type { Meta, StoryObj } from '@storybook/react';

import { MarkdownViewer } from './MarkdownViewer';

const meta: Meta<typeof MarkdownViewer> = {
  title: 'Molecules/MarkdownViewer',
  component: MarkdownViewer,
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'Markdown content to render',
    },
    maxLines: {
      control: 'number',
      description: 'Maximum number of lines to show (0 = unlimited)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MarkdownViewer>;

const sampleMarkdown = `# Heading 1
## Heading 2
### Heading 3

This is a paragraph with **bold text**, *italic text*, and ~~strikethrough~~.

Here is some \`inline code\` in a sentence.

- First item
- Second item
- Third item

1. Ordered item one
2. Ordered item two
3. Ordered item three

> This is a blockquote

\`\`\`
function hello() {
  console.log("Hello World!");
}
\`\`\`

---

Here is a [link to Google](https://google.com) for reference.
`;

export const Default: Story = {
  args: {
    content: sampleMarkdown,
  },
};

export const SimpleText: Story = {
  args: {
    content: 'This is a simple paragraph with **bold** and *italic* text.',
  },
};

export const HeadersOnly: Story = {
  args: {
    content: `# Main Title
## Subtitle
### Section Header

Some content under the headers.`,
  },
};

export const ListsOnly: Story = {
  args: {
    content: `Shopping list:
- Milk
- Bread
- Eggs

Steps to follow:
1. Preheat oven
2. Mix ingredients
3. Bake for 30 minutes`,
  },
};

export const CodeBlocks: Story = {
  args: {
    content: `Here is an example:

\`\`\`typescript
const greeting = "Hello";
console.log(greeting);
\`\`\`

And some \`inline code\` too.`,
  },
};

export const WithLinks: Story = {
  args: {
    content: `Check out these resources:

- [React Native](https://reactnative.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Expo](https://expo.dev)

More info at [our docs](https://docs.example.com).`,
  },
};

export const Blockquotes: Story = {
  args: {
    content: `> The only way to do great work is to love what you do.
> - Steve Jobs

Normal text after the quote.`,
  },
};

export const WithMaxLines: Story = {
  args: {
    content: sampleMarkdown,
    maxLines: 3,
  },
};

export const EmptyContent: Story = {
  args: {
    content: '',
  },
};
