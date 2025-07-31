import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [checking, setChecking] = useState(false);
  const [user, setUser] = useState(null); // NEW

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const { email, password } = form;

    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return;
      }

      const { user } = data.session ?? {};
      if (user && !user.email_confirmed_at) {
        setMessage("Please verify your email before continuing.");
        return;
      }

      setMessage("Logged in!");
      setUser(user);
      navigate("/");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else {
        setMessage("Signup successful! Check your email to confirm before logging in.");
        setIsLogin(true);
      }
    }
  };

  const resendVerification = async () => {
    setError("");
    setMessage("");

    if (!form.email) {
      setError("Enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: form.email,
    });

    if (error) setError("Could not resend confirmation: " + error.message);
    else setMessage("Verification email resent. Please check your inbox.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMessage("You have been logged out.");
  };

  useEffect(() => {
    const checkSession = async () => {
      setChecking(true);
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);

      if (data.user && !data.user.email_confirmed_at) {
        setMessage("Please confirm your email before continuing.");
      }
      setChecking(false);
    };

    checkSession();
  }, []);

  return (
    <div className="relative bg-black text-white px-6 py-16 flex items-center justify-center">
      <div className="w-full max-w-md bg-[#1e1e1e] p-8 rounded-xl shadow-lg border border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-6 text-gradient bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {!user ? (
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-900 border border-gray-700 text-white"
            />

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded transition"
              disabled={checking}
            >
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-green-400">You're logged in as <strong>{user.email}</strong></p>
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}

        {/* Messages & Resend */}
        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        {message && (
          <>
            <p className="text-green-400 text-sm mt-3">{message}</p>
            {message.toLowerCase().includes("verify") && (
              <button
                onClick={resendVerification}
                className="mt-4 text-sm text-yellow-300 underline hover:text-yellow-200"
              >
                Resend verification email
              </button>
            )}
          </>
        )}

        {!user && (
          <p className="mt-6 text-center text-gray-400">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <button
              className="text-purple-400 hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
