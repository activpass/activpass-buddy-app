import { cn } from '@paalan/react-shared/lib';
import { type ComponentProps, forwardRef } from 'react';

import { Link as LocalizedLink } from '@/lib/navigation';

type LinkProps = Omit<ComponentProps<typeof LocalizedLink>, 'href'> & {
  href?: string;
};

const Link = forwardRef<React.ComponentRef<typeof LocalizedLink>, LinkProps>(
  ({ children, href, className, ...props }, ref) => {
    const localClassName = cn('', className);

    if (!href || href.toString().startsWith('http')) {
      return (
        <a href={href} className={localClassName} {...props}>
          {children}
        </a>
      );
    }

    return (
      <LocalizedLink href={href?.toString()} className={localClassName} {...props} ref={ref}>
        {children}
      </LocalizedLink>
    );
  }
);

Link.displayName = 'Link';

export default Link;
