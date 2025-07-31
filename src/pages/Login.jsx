import React from "react";

const Login = () => (
  <div className="max-w-sm mx-auto mt-10 bg-white bg-opacity-10 p-6 rounded-xl shadow-lg backdrop-blur-md">
    <h2 className="text-2xl mb-4 text-center font-bold text-pink-300">Login</h2>
    <form className="flex flex-col gap-4">
      <input className="p-2 rounded bg-black bg-opacity-30 text-white" type="email" placeholder="Email" />
      <input className="p-2 rounded bg-black bg-opacity-30 text-white" type="password" placeholder="Password" />
      <button className="bg-pink-500 hover:bg-pink-700 p-2 rounded text-white font-bold transition">Log In</button>
    </form>
  </div>
);

export default Login;