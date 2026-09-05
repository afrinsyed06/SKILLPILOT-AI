import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import SearchModal from '../ui/SearchModal';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#020817' }}>
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />

      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
      />
      <div
        className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }}
      />

      {/* Sidebar */}
      <div className="hidden lg:flex flex-shrink-0 relative z-10">
        <Sidebar isOpen={true} setIsOpen={() => {}} />
      </div>
      <div className="lg:hidden relative z-10">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Topbar
          onMenuClick={() => setSidebarOpen((o) => !o)}
          onSearchClick={() => setSearchOpen(true)}
        />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
