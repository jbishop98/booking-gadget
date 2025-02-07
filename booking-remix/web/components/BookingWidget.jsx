// app/components/BookingWidget.jsx
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingWidget({ unavailableDates, onDateSelect }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const disabledDates = unavailableDates.map((date) => new Date(date));

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  return (
    <div>
      <h3>Select Booking Date:</h3>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        minDate={new Date()}
        excludeDates={disabledDates}
        dateFormat="yyyy-MM-dd"
      />
    </div>
  );
}
