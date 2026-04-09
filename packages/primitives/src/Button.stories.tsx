import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@spacedrive/primitives';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'subtle', 'outline', 'dotted', 'gray', 'accent', 'colored', 'bare'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Button',
    variant: 'default',
    size: 'sm',
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Subtle: Story = {
  args: {
    variant: 'subtle',
  },
};

export const Accent: Story = {
  args: {
    variant: 'accent',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
  },
};

export const Dotted: Story = {
  args: {
    variant: 'dotted',
  },
};

export const Colored: Story = {
  args: {
    variant: 'colored',
    className: 'bg-status-info',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};
