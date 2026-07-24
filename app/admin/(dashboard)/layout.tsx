import Sidebar from '@/components/admin/Sidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';
import SessionProviderWrapper from '@/components/admin/SessionProviderWrapper';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProviderWrapper>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col min-h-screen relative">
          <AdminNavbar />
          <main className="flex-1 p-8 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </SessionProviderWrapper>
  );
}
