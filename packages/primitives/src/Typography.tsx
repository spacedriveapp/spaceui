import { clsx } from 'clsx';
import { forwardRef } from 'react';

export const headingVariants = {
  h1: 'text-3xl font-bold tracking-tight',
  h2: 'text-2xl font-semibold tracking-tight',
  h3: 'text-xl font-semibold tracking-tight',
  h4: 'text-lg font-semibold tracking-tight',
  h5: 'text-base font-semibold',
  h6: 'text-sm font-semibold',
};

export const bodyVariants = {
  large: 'text-base leading-relaxed',
  default: 'text-sm leading-relaxed',
  small: 'text-xs leading-relaxed',
  muted: 'text-sm leading-relaxed text-ink-dull',
};

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: keyof typeof headingVariants | keyof typeof bodyVariants;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ variant = 'default', as: Component, className, children, ...props }, ref) => {
    const isHeading = variant in headingVariants;
    const isBody = variant in bodyVariants;

    const defaultComponent = isHeading
      ? (variant as keyof typeof headingVariants)
      : 'p';

    const As = Component || defaultComponent;

    const classes = isHeading
      ? headingVariants[variant as keyof typeof headingVariants]
      : isBody
      ? bodyVariants[variant as keyof typeof bodyVariants]
      : bodyVariants.default;

    return (
      <As
        ref={ref as React.Ref<HTMLHeadingElement & HTMLParagraphElement>}
        className={clsx(classes, 'text-ink', className)}
        {...props}
      >
        {children}
      </As>
    );
  }
);

Typography.displayName = 'Typography';

export { Typography };
