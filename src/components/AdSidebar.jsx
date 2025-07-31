// const AdContent = () => (
//   <div className="space-y-4">
//     <h3 className="text-lg font-semibold text-white">🌀 Sponsored</h3>
//     <div className="bg-[#1e1e1e] p-3 rounded-lg shadow-md">
//       <p className="text-sm text-gray-300">🔥 Try TrippyDrippy Premium</p>
//       <p className="text-xs text-gray-400 mt-1">No ads. More vibes.</p>
//     </div>
//     <div className="bg-[#1e1e1e] p-3 rounded-lg shadow-md">
//       <p className="text-sm text-green-300">🍄 Psychedelic Merch</p>
//       <p className="text-xs text-gray-400 mt-1">Get trippy T-shirts, stickers & more</p>
//     </div>
//   </div>
// );

// const AdSidebar = () => {
//   return (
//     <>
//       {/* Mobile: Top full-width bar above navbar */}
//       <div className="block lg:hidden w-full bg-[#121212] border-b border-gray-800 px-4 py-3 shadow-md z-50">
//         <AdContent />
//       </div>

//       {/* Desktop: Sticky right sidebar */}
//       <div className="hidden lg:flex flex-col fixed top-16 right-0 w-72 h-[calc(100vh-4rem)] bg-[#121212] border-l border-gray-800 px-4 py-6 overflow-y-auto z-40 shadow-lg">
//         <AdContent />
//       </div>
//     </>
//   );
// };

// export default AdSidebar;


const AdContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-white">🌀 Sponsored</h3>
    <div className="bg-[#1e1e1e] p-3 rounded-lg shadow-md">
      <p className="text-sm text-gray-300">🔥 Try TrippyDrippy Premium</p>
      <p className="text-xs text-gray-400 mt-1">No ads. More vibes.</p>
    </div>
    <div className="bg-[#1e1e1e] p-3 rounded-lg shadow-md">
      <p className="text-sm text-green-300">🍄 Psychedelic Merch</p>
      <p className="text-xs text-gray-400 mt-1">Get trippy T-shirts, stickers & more</p>
    </div>
  </div>
);

const AdSidebar = () => {
  return (
    <>
      {/* Mobile: Top bar */}
      <div className="block lg:hidden w-full bg-[#121212] border-b border-gray-800 px-4 py-3 shadow-md z-50">
        <AdContent />
      </div>

      {/* Desktop: Right fixed sidebar */}
      <div className="hidden lg:flex flex-col fixed top-0 right-0 w-72 h-screen bg-[#121212] border-l border-gray-800 px-4 py-6 overflow-y-auto z-40 shadow-lg">
        <AdContent />
      </div>
    </>
  );
};

export default AdSidebar;
