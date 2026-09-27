
import { EventDetails } from "./components/event/EventDetails";
import { Calendar } from "./components/calendar/Calendar";
import { TimeSlotList } from "./components/booking/TimeSlotList";
import { BookingForm } from "./components/booking/BookingForm";
import { ConfirmationScreen } from "./components/booking/ConfirmationScreen";
import { Footer } from "./components/layout/Footer";
import { useBookingFlow } from "./hooks/useBookingFlow";

export default function App() {
  const {
    state,
    selectDate,
    selectSlot,
    setMonth,
    setTimezone,
    updateFormData,
    backToStep1,
    backToStep2,
    confirmBooking,
    reset,
  } = useBookingFlow();

  const { step, selectedDate, selectedSlot, currentMonth, timezone, formData } = state;

  // Right panel content keyed by step so React re-mounts the step-enter animation.
  const renderRightPanel = () => {
    if (step === 4 && selectedDate && selectedSlot) {
      return (
        <ConfirmationScreen
          key="step-4"
          date={selectedDate}
          slot={selectedSlot}
          timezone={timezone}
          email={formData.email}
          onReset={reset}
        />
      );
    }

    if (step === 3 && selectedDate && selectedSlot) {
      return (
        <BookingForm
          key="step-3"
          date={selectedDate}
          slot={selectedSlot}
          timezone={timezone}
          formData={formData}
          onUpdate={updateFormData}
          onBack={backToStep2}
          onConfirm={confirmBooking}
        />
      );
    }

    if (step === 2 && selectedDate) {
      return (
        <TimeSlotList
          key="step-2"
          date={selectedDate}
          timezone={timezone}
          selectedSlot={selectedSlot}
          onSlotSelect={selectSlot}
          onBack={backToStep1}
        />
      );
    }

    // Step 1 — calendar
    return (
      <div key="step-1" className="step-enter">
        <h2 className="text-base font-semibold text-navy-900 mb-4">Select a Day</h2>
        <Calendar
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          timezone={timezone}
          onDateSelect={selectDate}
          onMonthChange={setMonth}
          onTimezoneChange={setTimezone}
        />
      </div>
    );
  };

  const isFullWidth = step === 4;

  return (
    <div className="min-h-dvh flex flex-col">
      <main className="flex-1 flex items-start justify-center px-4 py-10 lg:py-16">
        <div className="w-full max-w-5xl">
          <div
            className={`card overflow-hidden ${
              isFullWidth ? "max-w-lg mx-auto" : ""
            }`}
          >
            {isFullWidth ? (
              // Confirmation: single column
              <div className="p-6 lg:p-10">{renderRightPanel()}</div>
            ) : (
              // Steps 1–3: two-column on desktop
              <div className="flex flex-col lg:flex-row">
                {/* Left: event details */}
                <div className="lg:w-[360px] lg:min-w-[360px] p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-border bg-surface">
                  <EventDetails />
                </div>

                {/* Right: calendar / slots / form */}
                <div className="flex-1 p-6 lg:p-8 min-w-0">
                  {renderRightPanel()}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
