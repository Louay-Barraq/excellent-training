import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex bg-[var(--color-bg-main)] min-h-screen text-[var(--color-text-main)] transition-colors duration-300">
      <Sidebar />
      <div className="md:ml-64 flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar />
        <main className="flex-1 p-8 lg:p-12 space-y-12 mb-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;