"use client";

// Updated: Force new deployment
export default function TestPage() {
  return (
    <div className="min-h-screen bg-background text-primary flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Test Page</h1>
        <p className="text-orange-300">
          This is a simple test page without authentication.
        </p>
        <p className="text-orange-300 mt-2">
          If you can see this, the basic routing works.
        </p>
      </div>
    </div>
  );
}
