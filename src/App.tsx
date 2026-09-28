import { EventDetails } from "./components/event/EventDetails";
import { Calendar } from "./components/calendar/Calendar";
import { BookingForm } from "./components/booking/BookingForm";
import { ConfirmationScreen } from "./components/booking/ConfirmationScreen";
import { useBookingFlow } from "./hooks/useBookingFlow";

export default function App() {
  const {
    state,
    selectDate,
    selectSlot,
    proceedToForm,
    backToDateTime,
    setMonth,
    setTimezone,
    updateFormData,
    confirmBooking,
    reset,
  } = useBookingFlow();

  const { step, selectedDate, selectedSlot, currentMonth, timezone, formData } = state;

  return (
    <div className="min-h-screen bg-butter flex flex-col items-center justify-center p-3 sm:p-6 lg:p-10 font-sans text-nearblack">
      {/* Main Two-Column Card */}
      <div className="w-full max-w-5xl bg-white border border-butter-border rounded-xl shadow-card overflow-hidden flex flex-col lg:flex-row relative">
        {/* Left Panel: Host Info & Full Description (Scrollable) */}
        <div className="w-full lg:w-[380px] lg:min-w-[380px] p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-butter-border bg-white flex flex-col max-h-[85vh]">
          <EventDetails />
        </div>

        {/* Right Panel: Calendar / Slots / Form / Confirmation */}
        <div className="flex-1 p-6 lg:p-8 relative min-w-0 bg-white flex flex-col justify-start">
          {/* Small "POWERED BY" Ribbon in Top-Right Corner */}
          <div className="absolute top-0 right-0 overflow-hidden w-28 h-28 pointer-events-none z-20">
            <div className="bg-primary text-white text-[9px] font-bold tracking-widest uppercase py-1 w-36 text-center absolute top-4 -right-9 rotate-45 shadow-xs">
              POWERED BY
            </div>
          </div>

          {step === 3 && selectedDate && selectedSlot ? (
            <ConfirmationScreen
              date={selectedDate}
              slot={selectedSlot}
              timezone={timezone}
              email={formData.email}
              attendeeName={`${formData.firstName} ${formData.lastName}`.trim()}
              onReset={reset}
            />
          ) : step === 2 && selectedDate && selectedSlot ? (
            <BookingForm
              date={selectedDate}
              slot={selectedSlot}
              timezone={timezone}
              formData={formData}
              onUpdate={updateFormData}
              onBack={backToDateTime}
              onConfirm={confirmBooking}
            />
          ) : (
            <Calendar
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              timezone={timezone}
              onDateSelect={selectDate}
              onSlotSelect={selectSlot}
              onConfirmSlot={proceedToForm}
              onMonthChange={setMonth}
              onTimezoneChange={setTimezone}
            />
          )}
        </div>
      </div>
    </div>
  );
}
