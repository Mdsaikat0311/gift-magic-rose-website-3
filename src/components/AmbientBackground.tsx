export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#FFE6EC] via-[#FFF6F8] to-[#FFEBEF]"
    >
      <div
        className="absolute -top-40 left-1/2 h-[540px] w-[900px] -translate-x-1/2 rounded-full opacity-70"
        style={{
          background:
            'radial-gradient(circle, rgba(240, 24, 91, 0.09) 0%, rgba(255, 244, 246, 0) 70%)',
        }}
      />
    </div>
  );
}
