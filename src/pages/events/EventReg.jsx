import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";

const RegisterForEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", contact: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };

    const fetchEvent = async () => {
      const { data, error } = await supabase.from("events").select("*").eq("id", eventId).single();
      if (error) console.error("Event fetch error:", error);
      else setEvent(data);
    };

    fetchUser();
    fetchEvent();
    setLoading(false);
  }, [eventId]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.name || !form.contact) {
      setError("Please fill all fields.");
      return;
    }

    const { error } = await supabase.from("registrations").insert([
      {
        event_id: eventId,
        user_id: user.id,
        name: form.name,
        contact: form.contact,
      },
    ]);

    if (error) {
      setError("Registration failed. Try again.");
    } else {
      setMessage("You are registered! 🎉");
      setForm({ name: "", contact: "" });

      if (event?.is_paid) {
        setTimeout(() => navigate(`/event/payment/${eventId}`), 1500);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl font-bold mb-4">🔐 Please log in to register</h2>
        <button
          onClick={() => navigate("/auth")}
          className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg text-lg transition"
        >
          Go to Login / Signup
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white px-6 py-16">
      <div className="max-w-2xl mx-auto bg-[#1c1c1c] rounded-xl p-8 shadow-xl border border-gray-800">
        <h1 className="text-4xl font-bold mb-6 text-green-400">
          🎫 Register for {event?.title || "the event"}
        </h1>

        <p className="text-md mb-4 text-gray-300">
          {event?.is_paid ? (
            <span className="text-yellow-400">This is a paid event</span>
          ) : (
            <span className="text-green-400">This is a free event</span>
          )}
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-3 rounded-md text-white"
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Info (Email or Phone)"
            value={form.contact}
            onChange={handleChange}
            className="w-full bg-black border border-gray-700 p-3 rounded-md text-white"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded-md"
          >
            {event?.is_paid ? "Proceed to Payment" : "Register"}
          </button>
        </form>

        {error && <p className="text-red-400 mt-4">{error}</p>}
        {message && <p className="text-green-400 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default RegisterForEvent;
