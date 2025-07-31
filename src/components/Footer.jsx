import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 border-t border-gray-800 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 text-center">
        <h2 className="text-2xl font-bold text-white flex justify-center items-center gap-2">
          🌌 Trippy Drippy Vibes
        </h2>
        <p className="text-sm mb-4 text-gray-400">
          Crafted with ❤️. High on 🌿
        </p>

        {/* Social + Support Links */}
        <div className="flex justify-center gap-6 mb-2">
          <a
            href="#"
            className="hover:text-pink-400 transition duration-300"
            title="Instagram"
          >
            Instagram
          </a>
          <a
            href="#"
            className="hover:text-purple-400 transition duration-300"
            title="Twitter"
          >
            Twitter
          </a>
          {/* <Link
            to="/support"
            className="hover:text-indigo-400 transition duration-300"
            title="Support"
          >
            Support
          </Link> */}
        </div>

        {/* Privacy Policy */}
        <div className="mb-4">
          <Link
            to="/privacy-policy"
            className="text-xs text-gray-500 hover:text-gray-300 transition"
          >
            Privacy Policy
          </Link>
        </div>

        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} TrippyWebs. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
