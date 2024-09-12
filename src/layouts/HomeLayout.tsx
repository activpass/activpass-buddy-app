import Image from 'next/image';
import type { FC, PropsWithChildren } from 'react';
import { FaStar } from 'react-icons/fa';

import ThemeToggle from '../components/Common/ThemeToggle';
import { Logo } from '../components/Logo';

export const HomeLayout: FC<PropsWithChildren> = ({ children }) => {
  const starIndexes = Array.from({ length: 5 }).map((_, i) => i);
  const quotes = [
    {
      name: 'Sundhar Pichai',
      position: 'CEO at Google',
      avatar: '/avatars/avatar-1.jpg',
      description:
        'Activpass is the best platform for fitness enthusiasts. It has helped me to stay fit and healthy. I highly recommend it to everyone. It is a must-have app. I love it.',
    },
  ];
  return (
    <>
      <div />
      <div className="relative grid place-items-center lg:grid-cols-2 lg:place-items-stretch lg:overflow-hidden">
        <div className="hidden bg-muted lg:block">
          <Logo className="ml-5 mt-8" />
          <div className="mx-auto flex h-full max-w-xl items-center justify-center text-center">
            {quotes.map(quote => (
              <figure key={quote.name}>
                <div className="mb-4 flex items-center justify-center gap-2">
                  {starIndexes.map(index => (
                    <FaStar key={index} className="size-5 text-yellow-300" />
                  ))}
                </div>
                <blockquote>
                  <p className="px-4 text-2xl font-medium italic">
                    <q>{quote.description}</q>
                  </p>
                </blockquote>
                <figcaption className="mt-6 flex items-center justify-center space-x-3 rtl:space-x-reverse">
                  <Image
                    className="size-16 rounded-full"
                    src={quote.avatar}
                    alt="Avatar"
                    width="80"
                    height="80"
                  />
                  <div className="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700 rtl:divide-x-reverse">
                    <cite className="pe-3 font-medium">{quote.name}</cite>
                    <cite className="ps-3 text-sm text-gray-500 dark:text-gray-400">
                      {quote.position}
                    </cite>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center py-16 lg:py-0">
          <Logo className="absolute left-6 top-6 block lg:hidden" />
          <ThemeToggle className="absolute right-6 top-6" />
          {children}
        </div>
      </div>
    </>
  );
};
