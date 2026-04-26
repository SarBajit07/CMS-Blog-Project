'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 border-b border-[#1A1A1A] pb-8">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#777777] mb-4 block">
            Author Workspace
          </span>
          <h1 className="font-display text-5xl md:text-6xl mb-4">
            Welcome, {user?.username}.
          </h1>
          <p className="text-lg text-[#474747] font-light max-w-2xl">
            This is your private dashboard where you can manage your stories, track engagement, and draft new editorial pieces.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 border border-[#1A1A1A] bg-white shadow-[8px_8px_0px_0px_#1A1A1A]">
            <h2 className="font-display text-2xl mb-4">Your Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
                <span className="text-xs uppercase tracking-wider font-semibold">Total Posts</span>
                <span className="font-mono text-sm">0</span>
              </div>
              <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
                <span className="text-xs uppercase tracking-wider font-semibold">Comments Received</span>
                <span className="font-mono text-sm">0</span>
              </div>
            </div>
          </div>

          <div className="p-8 border border-[#1A1A1A] bg-white shadow-[8px_8px_0px_0px_#1A1A1A] flex flex-col justify-between">
            <div>
              <h2 className="font-display text-2xl mb-4">Quick Actions</h2>
              <p className="text-sm text-[#474747] mb-6 font-light">
                Ready to share something new with the world?
              </p>
            </div>
            <button className="w-full py-3 bg-[#1A1A1A] text-white text-xs tracking-widest uppercase font-bold hover:bg-[#474747] transition-colors">
              Create New Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}
