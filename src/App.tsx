
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
          attendeeName={`${formData.firstName} ${formData.lastName}`.trim()}
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
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-0.5">
            Step 1 of 3
          </span>
          <h2 className="text-lg font-bold text-navy-900 tracking-tight">
            Select a Date & Time
          </h2>
        </div>
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
      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12 lg:py-16">
        <div className="w-full max-w-5xl">
          <div
            className={`card overflow-hidden ${
              isFullWidth ? "max-w-xl mx-auto" : ""
            }`}
            style={{ borderTop: "3px solid #2563EB" }}
          >
            {isFullWidth ? (
              // Confirmation: single column with generous padding
              <div className="p-8 sm:p-10 lg:p-12">{renderRightPanel()}</div>
            ) : (
              // Steps 1–3: two-column on desktop with 32-40px padding
              <div className="flex flex-col lg:flex-row">
                {/* Left: event details with subtle gradient anchor */}
                <div
                  className="lg:w-[400px] lg:min-w-[400px] p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-border"
                  style={{
                    background: "linear-gradient(160deg, #EFF6FF 0%, #F8FAFC 35%, #F8FAFC 100%)",
                  }}
                >
                  <EventDetails />
                </div>

                {/* Right: calendar / slots / form */}
                <div className="flex-1 p-6 sm:p-8 lg:p-10 min-w-0 bg-surface">
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
