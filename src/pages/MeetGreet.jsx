import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const MeetGreet = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("events").select("*").eq("status", "open");
      if (error) console.error("Error fetching events:", error);
      else setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white py-12 px-6">
      <h1 className="text-4xl font-bold text-center mb-10 text-pink-400 drop-shadow-glow">
        🌟 Meet & Greet Events
      </h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No upcoming events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-[#1c1c1c] p-5 rounded-xl shadow-md hover:shadow-pink-500/30 transition-all border border-pink-500/10"
            >
              <img
                src={event.image_url || "/images/default-event.jpg"}
                alt={event.title}
                className="rounded-md h-48 w-full object-cover mb-4 border border-pink-300/10"
                onError={(e) => (e.target.src = "/images/default-event.jpg")}
              />
              <h2 className="text-xl font-bold text-pink-300 mb-1 truncate">{event.title}</h2>
              <p className="text-sm text-gray-400 mb-2 italic">{event.theme} • {new Date(event.date_time).toLocaleString()}</p>
              <p className="text-sm text-gray-300 mb-4 line-clamp-2">{event.description}</p>

              <div className="flex justify-between items-center">
                <span className={`text-sm px-2 py-1 rounded-full ${event.is_free ? 'bg-green-600' : 'bg-purple-600'} text-white`}>
                  {event.is_free ? "Free" : `₹${event.fee}`}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/registerForEvent/${event.id}`)}
                    className="text-sm px-3 py-1 bg-green-500 hover:bg-green-400 rounded shadow font-medium"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => navigate(`/eventDetails/${event.id}`)}
                    className="text-sm px-3 py-1 bg-blue-500 hover:bg-blue-400 rounded shadow font-medium"
                  >
                    Get Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MeetGreet;
