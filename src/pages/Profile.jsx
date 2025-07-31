import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setStatus("⚠️ Error loading user.");
        return;
      }

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, phone")
        .eq("id", user.id)
        .single();

      setUsername(profile?.username || "");
      setPhone(profile?.phone || "");
      setPhoneVerified(!!profile?.phone); // Assume verified if already set
    };

    loadProfile();
  }, []);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const sendOtp = async () => {
    setStatus("");
    if (!phone.trim()) {
      setStatus("❗ Phone number is required.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      setStatus("❌ Failed to send OTP.");
    } else {
      setStatus("📲 OTP sent to your phone.");
      setOtpSent(true);
    }
  };

  const verifyOtp = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });

    if (error) {
      setStatus("❌ Invalid OTP.");
    } else {
      setPhoneVerified(true);
      setStatus("✅ Phone verified.");
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      setStatus("❗ Username cannot be empty.");
      return;
    }

    if (!phone.trim()) {
      setStatus("❗ Phone number is required.");
      return;
    }

    if (!phoneVerified) {
      setStatus("⚠️ Please verify your phone before saving.");
      return;
    }

    // Check username uniqueness
    const { data: existing } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .neq("id", userId);

    if (existing?.length > 0) {
      setStatus("❌ Username already taken.");
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      username,
      phone,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setStatus("❌ Failed to update profile.");
    } else {
      setStatus("✅ Profile updated successfully.");
    }
    setTimeout(() => {
      window.location.reload();
    }, 100); // 1 second delay
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">Profile Setup</h2>

      <label className="block mb-2">Unique Username</label>
      <input
        className="w-full p-2 rounded bg-gray-800 mb-4"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="e.g. trippyGuru"
      />

      <label className="block mb-2">Phone Number (required)</label>
      <div className="flex gap-2 mb-4">
        <input
          className="w-full p-2 rounded bg-gray-800"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91-1234567890"
          disabled={phoneVerified}
        />
        <button
          onClick={sendOtp}
          className="bg-blue-500 px-3 py-2 rounded hover:bg-blue-400"
          disabled={phoneVerified}
        >
          Send OTP
        </button>
      </div>

      {otpSent && !phoneVerified && (
        <>
          <label className="block mb-2">Enter OTP</label>
          <div className="flex gap-2 mb-4">
            <input
              className="w-full p-2 rounded bg-gray-800"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button
              onClick={verifyOtp}
              className="bg-green-500 px-3 py-2 rounded hover:bg-green-400"
            >
              Verify
            </button>
          </div>
        </>
      )}

      <button
        onClick={handleSave}
        className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-400"
      >
        Update Profile
      </button>
      {status && <p className="mt-3 text-sm">{status}</p>}
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
      >
        Logout
      </button>
    </div>
    
  );
};

export default Profile;
