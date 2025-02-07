export default function BookingWidget({ unavailableDates, selectedDate, setSelectedDate }) {
    const [isAdding, setIsAdding] = useState(false);
    const disabledDates = unavailableDates.map(date => new Date(date));
  
    const addToCart = async () => {
      if (!selectedDate) {
        alert("Please select a booking date.");
        return;
      }
  
      setIsAdding(true);
  
      const response = await fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              id: YOUR_PRODUCT_VARIANT_ID, // Replace with actual variant ID
              quantity: 1,
              properties: { booking_date: selectedDate.toISOString().split("T")[0] },
            },
          ],
        }),
      });
  
      if (response.ok) {
        alert("Added to cart!");
      } else {
        alert("Failed to add to cart.");
      }
  
      setIsAdding(false);
    };
  
    return (
      <div>
        <h3>Select Booking Date:</h3>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          minDate={new Date()}
          excludeDates={disabledDates}
          dateFormat="yyyy-MM-dd"
        />
        <button onClick={addToCart} disabled={isAdding}>
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    );
  }
  