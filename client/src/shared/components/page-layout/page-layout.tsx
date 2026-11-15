import { type ReactNode } from 'react';

import { PageLayoutRoot, PageLayoutTitle } from './page-layout.styles';

type PageLayoutProps = {
  title: string;
  children: ReactNode;
};

/** A page's heading above its content, filling the page's height. */
export const PageLayout = ({ title, children }: PageLayoutProps) => (
  <PageLayoutRoot>
    <PageLayoutTitle>{title}</PageLayoutTitle>
    {children}
  </PageLayoutRoot>
);
