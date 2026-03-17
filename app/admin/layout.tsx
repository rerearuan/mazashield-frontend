import Sidebar from "@/components/admin/Sidebar";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1a8245]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <Sidebar />
      <main className="flex-1 ml-64 relative z-10">
        <div className="max-w-[1600px] mx-auto min-h-screen">
          {children}
        </div>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          className: 'premium-toast',
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            color: '#1e293b',
            padding: '16px 24px',
            borderRadius: '24px',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />
    </div>
  );
}
