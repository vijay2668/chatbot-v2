'use client';

import { cn } from '@/lib/utils';
import { ActionTooltip } from '@/components/action-tooltip';

export const NavigationItem = ({ onOpen, label, icon, openName }: any) => {
  return (
    <ActionTooltip side="right" align="center" label={label}>
      <button
        onClick={() => onOpen(openName)}
        className="group relative flex items-center"
      >
        <div
          className={cn(
            'relative hover:bg-primary/10 hover:text-primary/80 group flex items-center justify-center mx-3 h-[48px] w-[48px] rounded-[16px] transition-all overflow-hidden',
          )}
        >
          {icon}
        </div>
      </button>
    </ActionTooltip>
  );
};
