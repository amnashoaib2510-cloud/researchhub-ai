const Loader = ({ label = "Loading…" }) => (
  <div className="flex items-center justify-center py-16">
    <p className="font-mono text-xs text-ink-soft tracking-wide animate-pulse">{label}</p>
  </div>
);

export default Loader;
