import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
      if (error) console.error("Error fetching event:", error);
      else setEvent(data);
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <div className="text-center text-white mt-20">Loading event details...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 pt-10">
      <div className="max-w-5xl mx-auto bg-[#1c1c1c] rounded-xl shadow-xl overflow-hidden border border-pink-400/20">
        {/* Event Header Image */}
        <img
          src={event.image_url || "/images/default-event.jpg"}
          alt={event.title}
          className="w-full h-72 object-cover"
          onError={(e) => (e.target.src = "/images/default-event.jpg")}
        />

        {/* Event Content */}
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold text-pink-300">{event.title}</h1>
          <p className="text-sm text-gray-400 italic">{event.theme} • {new Date(event.date_time).toLocaleString()}</p>
          <p className="text-base text-gray-300">{event.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-200 mt-4">
            <div>
              <span className="font-bold">📍 Location: </span>
              {event.location}
            </div>
            {event.host && (
              <div>
                <span className="font-bold">👤 Host: </span>
                {event.host}
              </div>
            )}
            {event.duration && (
              <div>
                <span className="font-bold">⏱ Duration: </span>
                {event.duration}
              </div>
            )}
            <div>
              <span className="font-bold">💰 Entry Fee: </span>
              {event.is_free ? "Free" : `₹${event.fee}`}
            </div>
          </div>

          {event.extra_notes && (
            <div className="mt-3 text-sm text-yellow-200">
              <span className="font-bold">📝 Note: </span> {event.extra_notes}
            </div>
          )}

          {/* Map or location link */}
          {event.map_url && (
            <a
              href={event.map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm text-blue-400 underline hover:text-blue-300"
            >
              View on Google Maps 🌍
            </a>
          )}

          {/* Actions */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => navigate(`/registerForEvent/${event.id}`)}
              className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-2 rounded shadow transition"
            >
              {event.is_free ? "Register Now" : `Register (₹${event.fee})`}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="text-gray-300 hover:text-pink-400 transition text-sm"
            >
              ← Back to Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
