import React from 'react';
export default function AuthCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="container">
      <div className="card">
        <h1 className="text-xl font-semibold mb-4">{title}</h1>
        {children}
      </div>
    </div>
  );
}
