import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const Support = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // 🔄 Load user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        setFormData((prev) => ({
          ...prev,
          name: profile?.username || "",
          email: user.email || "",
        }));
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setStatus("Please fill out all fields.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("support_queries")
      .insert([{ name, email, message }]);

    if (error) {
      console.error("Submission error:", error);
      setStatus("Something went wrong. Please try again.");
    } else {
      setStatus("Your message has been sent. Thank you!");
      setFormData({ ...formData, message: "" }); // keep name/email
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="max-w-lg w-full bg-[#1f1f1f] rounded-lg shadow-lg p-8 border border-green-800">
        <h1 className="text-3xl font-bold mb-6 text-green-400">📬 Contact Support</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            disabled
            className="w-full px-4 py-2 rounded-md bg-[#2b2b2b] border border-green-600 text-white placeholder-gray-400 opacity-70 cursor-not-allowed"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            disabled
            className="w-full px-4 py-2 rounded-md bg-[#2b2b2b] border border-green-600 text-white placeholder-gray-400 opacity-70 cursor-not-allowed"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded-md bg-[#2b2b2b] border border-green-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-2 rounded-md transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {status && (
          <div className="mt-4 text-sm text-center text-green-300">
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
