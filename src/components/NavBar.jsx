import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Maximize, Minimize, Menu, X} from "lucide-react";
import { supabase } from "../supabase";

// Define the nav items to be rendered
const navItems = [
  { path: "/", label: "Home" },
//   { path: "/robot-id", label: "Robot ID" },
//   { path: "/chat", label: "Chat" },
  { path: "/music", label: "Music" },
  { path: "/videos", label: "Videos" },
  { path: "/trip", label: "Trip of the Day" },
  // { path: "/meet-greet", label: "Meet" },
//   { path: "/support", label: "Support" },
  // { path: "/login", label: "LogIn" },
//   { path: "/signup", label: "Signup" },
];

const Navbar = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  const toggleFullscreen = () => {
    const doc = document;
    const docEl = doc.documentElement;
    const requestFullScreen =
      docEl.requestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.webkitRequestFullscreen ||
      docEl.msRequestFullscreen;
    const exitFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (!document.fullscreenElement) {
      requestFullScreen?.call(docEl);
    } else {
      exitFullScreen?.call(doc);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data, error } = await supabase.auth.getUser();
      const currentUser = data.user;
      setUser(currentUser);

      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", currentUser.id)
          .single();

        if (profile && profile.username) {
          setUsername(profile.username.trim());
        } else {
          setUsername(currentUser.email?.split("@")[0] || "User");
        }
      }
    };

    fetchUserAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("username")
          .eq("id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            setUsername(profile?.username || session.user.email?.split("@")[0] || "User");
          });
      } else {
        setUsername(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUsername(null);
    navigate("/");
  };

  const filteredNavItems = navItems.filter(
    (item) => !(item.path === "/login" && user)
  );

  return (
    <nav className="flex flex-wrap justify-between items-center w-full p-4 bg-black bg-opacity-30 backdrop-blur-md shadow-md z-50 lg:mr-64">
      {/* Logo */}
      <Link
        to="/"
        className="text-white font-bold text-xl flex items-center gap-2 px-2 hover:scale-105 transition-transform"
        title="Go Home"
      >
        <span className="text-2xl">🧠</span>
        <span className="hidden sm:inline">trippyWeb</span>
      </Link>

      {/* Right Section: Nav Items + Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        {filteredNavItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className="relative inline-block px-4 py-2 text-white font-semibold transition-transform duration-300 transform hover:scale-105 group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-70 blur-sm rounded-full group-hover:animate-pulse"></span>
            <span className="relative z-10">{label}</span>
          </Link>
        ))}

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="relative inline-flex items-center gap-1 px-4 py-2 text-white font-semibold transition-transform duration-300 transform hover:scale-105 group"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-70 blur-sm rounded-full group-hover:animate-pulse"></span>
          <span className="relative z-10 flex items-center gap-1">
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            {isFullscreen ? "Exit" : "Full"}screen
          </span>
        </button>

        {/* User Auth Buttons */}
        {user && (
          <>
            <button
              onClick={() => navigate("/profile")}
              className="relative inline-block px-4 py-2 text-white font-semibold transition-transform duration-300 transform hover:scale-105 group max-w-[140px] truncate"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-70 blur-sm rounded-full group-hover:animate-pulse"></span>
              <span className="relative z-10 truncate">{username}</span>
            </button>

            <button
              onClick={handleLogout}
              className="relative inline-block px-4 py-2 text-white font-semibold transition-transform duration-300 transform hover:scale-105 group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-500 opacity-70 blur-sm rounded-full group-hover:animate-pulse"></span>
              <span className="relative z-10">Logout</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;