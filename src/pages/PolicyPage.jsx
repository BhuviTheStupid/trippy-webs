import React from "react";

const PolicyPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-bold mb-6 text-green-400">Privacy Policy</h1>

      <p className="mb-4">
        Welcome to Trippy! Your privacy is important to us. This Privacy Policy
        explains how we collect, use, and protect your information when you use
        our website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-purple-300">1. Information We Collect</h2>
      <ul className="list-disc pl-6 mb-4 text-gray-300">
        <li>Email address and password (for authentication)</li>
        <li>Username and optionally phone number</li>
        <li>Music preferences and interactions (e.g. events, support messages)</li>
        <li>Anonymous device/session info (non-identifiable)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-purple-300">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4 text-gray-300">
        <li>To authenticate and manage your account</li>
        <li>To personalize your experience and save preferences</li>
        <li>To respond to support queries and improve services</li>
        <li>To notify you about events or updates</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-purple-300">3. Sharing Your Data</h2>
      <p className="mb-4 text-gray-300">
        We do <strong>not</strong> sell or share your personal data with third parties. We may use
        third-party infrastructure (like Supabase, IPFS) to store or transmit your data securely.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-purple-300">4. Data Security</h2>
      <p className="mb-4 text-gray-300">
        We use HTTPS, access control, and modern encryption to protect your information. You are
        responsible for keeping your credentials secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-purple-300">5. Your Rights</h2>
      <p className="mb-4 text-gray-300">
        You may update or delete your profile anytime via the Profile page. If you wish to remove
        your data permanently, please contact us.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2 text-purple-300">6. Contact</h2>
      <p className="mb-4 text-gray-300">
        If you have any questions about this policy, reach out at:{" "}
        <span className="text-green-400">support@trippyweb.app</span>
      </p>

      <p className="text-sm text-gray-500">Last Updated: July 26, 2025</p>
    </div>
  );
};

export default PolicyPage;
