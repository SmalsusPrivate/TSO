import AdminProtect from '@/components/admin/AdminProtect';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#030308] min-h-screen text-white font-sans antialiased">
      <AdminProtect>
        {children}
      </AdminProtect>
    </div>
  );
}
