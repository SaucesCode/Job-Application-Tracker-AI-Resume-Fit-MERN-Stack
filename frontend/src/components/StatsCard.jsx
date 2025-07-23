const StatsCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white rounded-xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p
            className={`text-sm mt-1 ${
              change.startsWith("+") ? "text-green-600" : "text-red-600"
            }`}
          >
            {change} from last month
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default StatsCard;
