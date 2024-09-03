import { type ComponentProps, forwardRef } from 'react';

import { Link as LocalizedLink } from '@/lib/navigation';

type LinkProps = Omit<ComponentProps<typeof LocalizedLink>, 'href'> & {
  href?: string;
};

const Link = forwardRef<React.ComponentRef<typeof LocalizedLink>, LinkProps>(
  ({ children, href, ...props }, ref) => {
    if (!href || href.toString().startsWith('http')) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }

    return (
      <LocalizedLink href={href?.toString()} {...props} ref={ref}>
        {children}
      </LocalizedLink>
    );
  }
);

Link.displayName = 'Link';

export default Link;
