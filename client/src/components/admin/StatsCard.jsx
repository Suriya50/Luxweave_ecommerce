import { motion } from 'framer-motion';

const StatsCard = ({ icon, label, value, color = 'gold', trend, trendLabel }) => {
  const colors = {
    gold: 'from-gold-500 to-gold-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    pink: 'from-pink-500 to-pink-600',
  };

  const bgColors = {
    gold: 'bg-gold-50',
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    red: 'bg-red-50',
    pink: 'bg-pink-50',
  };

  const textColors = {
    gold: 'text-gold-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    pink: 'text-pink-600',
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/80 overflow-hidden group"
    >
      <div className="p-5 sm:p-6 relative">
        {/* Decorative gradient bar on top */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors[color]}`} />

        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
              {value}
            </p>
            {trend && (
              <p className={`text-xs font-medium mt-1 flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel || 'from yesterday'}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${bgColors[color]} group-hover:scale-110 transition-transform duration-300`}>
            <div className={`text-2xl sm:text-3xl ${textColors[color]}`}>
              {icon}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;