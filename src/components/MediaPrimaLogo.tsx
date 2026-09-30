import React from 'react';

interface MediaPrimaLogoProps {
  variant?: 'header' | 'hero' | 'compact';
  showSubtitle?: boolean;
  showBerhad?: boolean;
  language?: 'en' | 'bm';
  className?: string;
}

export const MediaPrimaLogo: React.FC<MediaPrimaLogoProps> = ({
  variant = 'header',
  showSubtitle = true,
  showBerhad = true,
  language = 'bm',
  className = '',
}) => {
  const isBm = language === 'bm';

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center text-center gap-2.5 ${className}`}>
        {/* Exact Media Prima Red Box + "media" & "prima" logo */}
        <div className="flex items-center gap-2 select-none group">
          {/* Red Square with "media" */}
          <div className="w-14 h-14 bg-[#E21836] flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105">
            <span className="font-headline font-extrabold text-white text-[20px] tracking-tight lowercase select-none">
              media
            </span>
          </div>

          {/* "prima" text outside red box */}
          <span className="font-headline font-extrabold text-on-surface text-[24px] tracking-tight lowercase select-none">
            prima
          </span>

          {showBerhad && (
            <span className="ml-1 self-start font-headline font-bold text-[10px] tracking-widest text-[#E21836] uppercase bg-[#E21836]/10 px-1.5 py-0.5 rounded">
              BERHAD
            </span>
          )}
        </div>

        {/* Subtitle */}
        {showSubtitle && (
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E21836]" />
            <span>
              {isBm
                ? 'Portal Masa Lebih Masa Kakitangan (Employee Portal)'
                : 'Employee Overtime & Shift Compliance Portal'}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 select-none ${className}`}>
        <div className="w-7 h-7 bg-[#E21836] flex items-center justify-center shrink-0">
          <span className="font-headline font-extrabold text-white text-[10px] tracking-tight lowercase">
            media
          </span>
        </div>
        <span className="font-headline font-extrabold text-on-surface text-[13px] tracking-tight lowercase">
          prima
        </span>
      </div>
    );
  }

  // Default 'header' variant
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Media Prima Logo representation */}
      <div className="flex items-center gap-1.5 group">
        {/* Red Box with "media" */}
        <div className="w-9 h-9 bg-[#E21836] flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-150 group-hover:scale-105">
          <span className="font-headline font-extrabold text-white text-[13px] tracking-tight lowercase">
            media
          </span>
        </div>

        {/* "prima" */}
        <span className="font-headline font-extrabold text-on-surface text-[17px] tracking-tight lowercase">
          prima
        </span>
      </div>

      {/* Divider and Portal Subtitle */}
      <div className="flex flex-col justify-center border-l border-outline-variant/60 pl-2.5">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-headline font-bold text-[10px] tracking-widest text-[#E21836] uppercase bg-[#E21836]/10 px-1 py-0.5 rounded">
            BERHAD
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] font-medium text-on-surface-variant leading-tight mt-0.5 truncate">
            {isBm ? 'Portal Masa Lebih Masa' : 'Employee Overtime Portal'}
          </span>
        )}
      </div>
    </div>
  );
};
