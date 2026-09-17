// app/guide/layout.tsx
import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './guide.css';

export default function GuideLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />

      <div className="guide-layout">
        <Sidebar />
        <main>{children}</main>
      </div>
    </div>
  );
}
