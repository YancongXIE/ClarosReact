export default function Guide() {
  return (
    <div className="relative" tabIndex={0}>
      <div className="ml-12 mt-6">
        <h1 className="text-primary text-primary-content font-bold text-4xl">
          Localis Data Dashboard: A Quick Guide 🤓
        </h1>
      </div>
      <div className="flex">
        <div className="m-12 flex-1 pr-10">
          <p className="text-xl text-primary-content">
            Hello, and thanks for trusting us to find the best data insights for
            your local area. The following guide will run you through how to
            understand our data and how you can get the most out of this app.
          </p>
          <h1 className="text-3xl font-semibold text-primary-content mt-10" id="adr">
            The Data
          </h1>
          <h2 className="text-xl mt-6 underline decoration-primary text-primary-content">
            Average Daily Rate
          </h2>
          <p className="mt-3 text-primary-content">
            The Average Daily Rate (ADR) is a key performance metric in the
            accommodation industry that represents the average income earned per
            occupied room in a specific period. It is calculated by dividing the
            total room revenue by the number of rooms sold. ADR helps businesses
            understand pricing trends and revenue performance.
          </p>
          <h2
            className="text-xl mt-6 underline decoration-primary text-primary-content"
            id="occupancy"
          >
            Average Historical Occupancy
          </h2>
          <p className="mt-3 text-primary-content">
            Historical occupancy refers to the percentage of available rooms or
            properties that were occupied over a given period in the past. It is
            calculated by dividing the total number of rooms or properties
            occupied by the total number of rooms or properties available during
            that period, often expressed as a percentage. This metric helps
            businesses track trends in room usage and demand over time.
          </p>
          <h2
            className="text-xl mt-6 underline decoration-primary text-primary-content"
            id="booking-window"
          >
            Average Booking Window
          </h2>
          <p className="mt-3 text-primary-content">
            The average booking window measures the average number of days
            between when a guest makes a reservation and their check-in date. It
            helps hotels and accommodations understand how far in advance their
            customers are booking, which is useful for marketing and pricing
            strategies.
          </p>
          <h2
            className="text-xl mt-6 underline decoration-primary text-primary-content"
            id="length-of-stay"
          >
            Average Length of Stay
          </h2>
          <p className="mt-3 text-primary-content">
            Average Length of Stay (ALOS) refers to the average number of days
            that guests stay at a property. It is calculated by dividing the
            total number of room nights occupied by the number of bookings or
            guests over a specific period.
          </p>
          <div className="flex w-full flex-col">
            <div className="divider divider-secondary"></div>
          </div>
          <h1 className="text-3xl font-semibold text-primary-content mt-4" id="adr">
            How to use this app
          </h1>
          <p className="mt-3 text-primary-content">
            {" "}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
            reiciendis qui sed expedita praesentium, quaerat placeat sint
            consequatur illo in repellat nemo nihil ducimus, esse quo et
            sapiente! Consectetur, ratione.
          </p>
        </div>
      </div>
    </div>
  );
}
