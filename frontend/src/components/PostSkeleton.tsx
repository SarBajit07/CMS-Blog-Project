import React from 'react';

export default function PostSkeleton() {
  return (
    <div className="p-8 border-r border-b border-[#1A1A1A] bg-white animate-pulse flex flex-col justify-between h-full min-h-[320px]">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-3 w-16 bg-gray-200" />
          <div className="h-3 w-4 bg-gray-200" />
          <div className="h-3 w-20 bg-gray-200" />
        </div>
        <div className="h-8 w-full bg-gray-200 mb-4" />
        <div className="h-8 w-2/3 bg-gray-200 mb-6" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-100" />
          <div className="h-3 w-full bg-gray-100" />
          <div className="h-3 w-4/5 bg-gray-100" />
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-[#E5E5E5] flex justify-between items-center">
        <div className="h-3 w-24 bg-gray-200" />
        <div className="h-3 w-16 bg-gray-100" />
      </div>
    </div>
  );
}

export function PostRowSkeleton() {
  return (
    <div className="group border-b border-[#E5E5E5] pb-12 last:border-0 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-2 w-16 bg-gray-200" />
            <div className="h-2 w-12 bg-gray-200" />
          </div>
          <div className="h-10 w-3/4 bg-gray-200 mb-4" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-100" />
            <div className="h-3 w-5/6 bg-gray-100" />
          </div>
        </div>
        <div className="md:text-right">
          <div className="h-2 w-12 bg-gray-100 mb-2 ml-auto" />
          <div className="h-3 w-24 bg-gray-200 ml-auto" />
        </div>
      </div>
    </div>
  );
}
