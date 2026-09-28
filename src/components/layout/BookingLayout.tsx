import { ReactNode } from "react";
import { EventDetails } from "../event/EventDetails";
import type { TimeSlot } from "../../types/booking";

interface BookingLayoutProps {
  children: ReactNode;
  step?: 1 | 2 | 3;
  date?: Date | null;
  slot?: TimeSlot | null;
  timezone?: string;
  onBack?: () => void;
}

export function BookingLayout({
  children,
  step = 1,
  date,
  slot,
  timezone = "Asia/Kolkata",
  onBack,
}: BookingLayoutProps) {
  return (
    <div className="min-h-screen bg-butter flex flex-col items-center justify-center p-3 sm:p-6 lg:p-10 font-sans text-nearblack">
      <div className="w-full max-w-5xl bg-white border border-butter-border rounded-xl shadow-card overflow-hidden flex flex-col lg:flex-row relative">
        {/* Left Panel */}
        <div className="w-full lg:w-[380px] lg:min-w-[380px] p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-butter-border bg-white flex flex-col max-h-[85vh]">
          <EventDetails
            step={step}
            date={date}
            slot={slot}
            timezone={timezone}
            onBack={onBack}
          />
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-6 lg:p-8 relative min-w-0 bg-white flex flex-col justify-start">
          <div className="absolute top-0 right-0 overflow-hidden w-28 h-28 pointer-events-none z-20">
            <div className="bg-primary text-white text-[9px] font-bold tracking-widest uppercase py-1 w-36 text-center absolute top-4 -right-9 rotate-45 shadow-xs">
              POWERED BY
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
