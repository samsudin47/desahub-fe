export default function AuthDivider({ label = "atau" }: { label?: string }) {
  return (
    <div className="relative py-4 sm:py-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-4 text-gray-400">{label}</span>
      </div>
    </div>
  );
}
