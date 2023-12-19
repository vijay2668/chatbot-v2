'use client';
import { useModal } from '@/hooks/use-modal-store';
import { UserButton } from '@clerk/nextjs';
import { ScrollArea } from './ui/scroll-area';
import { NavigationItem } from './navigation-item';
import { File, Webhook } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const Sidebar = () => {
  const { onOpen } = useModal();

  const items = [
    {
      label: 'File',
      openName: 'file',
      icon: <File width={20} height={20} />,
    },
    {
      label: 'Website',
      openName: 'website',
      icon: <Webhook width={20} height={20} />,
    },
  ];

  return (
    <div className="hidden h-full md:flex md:w-[262px] bg-gray-900">
      <div className="flex flex-col w-full h-full py-5 overflow-auto text-sm font-bold text-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="flex items-start justify-between w-full gap-2 px-4">
          <div className="ml-2">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <Image width={36} height={36} src="/bot-image.png" alt="vercel" />
                <div>
                  <p className="text-white leading-6 text-base font-bold">
                    Chatbot
                  </p>
                  <p className="text-white/50 leading-4 text-xs font-medium">
                    by Vijay
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="px-4 py-6">

        </div>
        <ScrollArea className="flex-1 w-full">
          <div className="space-y-2">
            {items?.map((item, index) => (
              <NavigationItem
                key={index}
                label={item.label}
                icon={item.icon}
                openName={item.openName}
                onOpen={onOpen}
              />
            ))}
          </div>
        </ScrollArea>
        <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'h-[48px] w-[48px]',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
