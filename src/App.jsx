import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RobotID from "./pages/RobotID";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Videos from "./pages/Videos";
import MeetGreet from "./pages/MeetGreet";
import Support from "./pages/Support";
import Navbar from "./components/NavBar";
import Music from "./pages/Music";
import Slow from "./pages/music/Slow";
import Fast from "./pages/music/Fast";
import Air from "./pages/music/Air";
import Earth from "./pages/music/Earth";
import EventDetails from "./pages/events/EventDetails";
import RegisterForEvent from "./pages/events/EventReg";
import Auth from "./pages/Auth";
import Footer from "./components/Footer";
import AdSidebar from "./components/AdSidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import PolicyPage from "./pages/PolicyPage"; // ✅ fixed import
import TrippyVisualizer from "./pages/TrippyVisualiser";

function App() {
  return (
    <Router>
      <div className="flex bg-black text-white font-mono min-h-screen overflow-x-hidden">
        {/* <AdSidebar /> */}
        <div className="flex-grow relative pt-16 px-4 bg-black min-h-screen">
          <Navbar />
          <div className="p-6 bg-black">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/privacy-policy" element={<PolicyPage />} /> {/* ✅ fixed typo */}
              <Route path="/robot-id" element={<RobotID />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/meet-greet" element={<MeetGreet />} />
              <Route path="/support" element={<Support />} />
              <Route path="/music" element={<Music />} />
              <Route path="/music/slow" element={<Slow />} />
              <Route path="/music/fast" element={<Fast />} />
              <Route path="/music/air" element={<Air />} />
              <Route path="/music/earth" element={<Earth />} />
              <Route path="/eventDetails" element={<EventDetails />} />
              <Route path="/eventRegistration" element={<RegisterForEvent />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/trip" element={<TrippyVisualizer />} /> {/* Trip route */}
              <Route path="*" element={<div className="text-white text-center py-16 text-xl">404 - Page Not Found</div>} />
              
              {/* Protected Routes
              <Route
                path="/robot-id"
                element={
                  <ProtectedRoute>
                    <RobotID />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/music"
                element={
                  <ProtectedRoute>
                    <Music />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/videos"
                element={
                  <ProtectedRoute>
                    <Videos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/meet-greet"
                element={
                  <ProtectedRoute>
                    <MeetGreet />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/support"
                element={
                  <ProtectedRoute>
                    <Support />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/music/slow"
                element={
                  <ProtectedRoute>
                    <Slow />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/music/fast"
                element={
                  <ProtectedRoute>
                    <Fast />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/music/air"
                element={
                  <ProtectedRoute>
                    <Air />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/music/earth"
                element={
                  <ProtectedRoute>
                    <Earth />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/eventDetails"
                element={
                  <ProtectedRoute>
                    <EventDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/eventRegistration"
                element={
                  <ProtectedRoute>
                    <RegisterForEvent />
                  </ProtectedRoute>
                }
              /> */}

              {/* 404 fallback route */}
              {/* <Route
                path="*"
                element={
                  <div className="text-white text-center py-16 text-xl">
                    404 - Page Not Found
                  </div>
                }
              /> */}
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
