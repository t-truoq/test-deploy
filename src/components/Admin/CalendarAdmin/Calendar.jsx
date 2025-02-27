import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

const CalendarDemo = () => {
  const [events, setEvents] = useState([]);

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingTitle, setBookingTitle] = useState("");

  const handleBooking = (e) => {
    e.preventDefault();
    const newEvent = {
      title: bookingTitle,
      start: `${bookingDate}T${bookingTime}`,
    };
    setEvents([...events, newEvent]);
    // Reset form
    setBookingDate("");
    setBookingTime("");
    setBookingTitle("");
  };

  return (
    <div className>
      <div className="mb-3 flex justify-end">
        <button
          onClick={() => document.getElementById("booking-modal").showModal()}
          className="px-4 py-2 bg-[#3D021E] text-white rounded-md hover:bg-[#3D021E]/90 transition-colors"
        >
          Book Appointment
        </button>
      </div>

      {/* Using native dialog instead of shadcn/ui Dialog */}
      <dialog
        id="booking-modal"
        className="p-6 rounded-lg shadow-lg backdrop:bg-black/50"
      >
        <div className="w-[425px] max-w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Book an Appointment</h2>
            <button
              onClick={() => document.getElementById("booking-modal").close()}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="title">
                Appointment Title
              </label>
              <input
                id="title"
                className="w-full px-3 py-2 border rounded-md"
                value={bookingTitle}
                onChange={(e) => setBookingTitle(e.target.value)}
                placeholder="Enter appointment title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="date">
                Date
              </label>
              <input
                id="date"
                type="date"
                className="w-full px-3 py-2 border rounded-md"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="time">
                Time
              </label>
              <input
                id="time"
                type="time"
                className="w-full px-3 py-2 border rounded-md"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#3D021E] text-white rounded-md hover:bg-[#3D021E]/90 transition-colors"
            >
              Book
            </button>
          </form>
        </div>
      </dialog>

      <div>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,listWeek",
          }}
          events={events}
          height="800px"
        />
      </div>
    </div>
  );
};

export default CalendarDemo;
