import { ReactNode } from 'react';

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col  px-4 space-y-2  flex-grow pb-4 bg-black text-white">
      {children}
    </div>
  );
}