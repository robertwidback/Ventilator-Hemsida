export const Marquee = ({ items, dark = false }) => {
  const row = [...items, ...items];
  return (
    <div
      className={`overflow-hidden border-y py-5 ${
        dark ? "border-white/10 bg-vent-dark" : "border-vent-blue/10 bg-vent-ice"
      }`}
      data-testid="editorial-marquee"
    >
      <div className="animate-marquee-slow flex w-max items-center gap-0">
        {row.map((item, i) => (
          <span key={i} className="flex items-center">
            <span
              className={`font-display text-2xl md:text-4xl font-bold uppercase tracking-tight whitespace-nowrap ${
                dark ? "text-white/80" : "text-vent-navy/80"
              }`}
            >
              {item}
            </span>
            <span className={`mx-8 text-xl ${dark ? "text-vent-green" : "text-vent-blue"}`}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};
