import { motion } from "framer-motion";

const StatCard = ({ label, value, num, icon: Icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="card relative overflow-hidden"
    >
      <span className="absolute top-4 right-5 font-mono text-[11px] text-ink/20">{num}</span>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon size={16} className="text-gold-dark" />}
        <p className="eyebrow">{label}</p>
      </div>
      <p className="font-display text-3xl font-semibold text-ink">{value}</p>
    </motion.div>
  );
};

export default StatCard;
