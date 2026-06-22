// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import Header from '../layout/Header';
// import Footer from '../layout/Footer';
// import { Toaster } from 'react-hot-toast';

// const Layout: React.FC = () => {
//   return (
//     <div className="min-h-screen flex flex-col relative overflow-hidden">
//       <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.15),transparent_34%),radial-gradient(circle_at_top_right,rgba(20,184,166,0.16),transparent_30%)]" />
//       <Header />
//       <main className="relative z-10 flex-grow container mx-auto px-4 py-10 sm:py-12">
//         <Outlet />
//       </main>
//       <Footer />
//       <Toaster position="top-right" />
//     </div>
//   );
// };

// export default Layout;



import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      {/* Lime grid texture — matches Login / Dashboard / Home signature */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #D4FF3F 1px, transparent 1px), linear-gradient(to bottom, #D4FF3F 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <Header />
      <main className="relative z-10 flex-grow container mx-auto px-4 py-10 sm:py-12">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111111',
            color: '#FFFFFF',
            border: '1px solid rgba(212,255,63,0.3)',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '13px',
            borderRadius: '0px',
          },
        }}
      />
    </div>
  );
};

export default Layout;