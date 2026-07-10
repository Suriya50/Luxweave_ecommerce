import { motion } from 'framer-motion';

const StatsCard = ({ icon, label, value }) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white p-3 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 flex items-center gap-3 sm:gap-4"
    >
      <div className="p-2 sm:p-3 bg-gold-50 rounded-lg sm:rounded-xl text-gold-600">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-sm text-gray-500">{label}</p>
        <p className="text-base sm:text-2xl font-bold truncate">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;