export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-background text-primary flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-xl text-orange-300">Loading...</p>
      </div>
    </div>
  );
}
