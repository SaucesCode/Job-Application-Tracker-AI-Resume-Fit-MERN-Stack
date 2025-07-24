const StatusOption = ({ value, label, icon: Icon, color, description, selected, onClick }) => (
  <div
    onClick={() => onClick(value)}
    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
      selected
        ? `${color} border-opacity-100 shadow-lg transform scale-105`
        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
    }`}
  >
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-lg ${selected ? "bg-white/20" : "bg-gray-100"}`}>
        <Icon className={`w-5 h-5 ${selected ? "text-white" : "text-gray-600"}`} />
      </div>
      <div>
        <h3 className={`font-semibold ${selected ? "text-white" : "text-gray-900"}`}>
          {label}
        </h3>
        <p className={`text-sm ${selected ? "text-white/80" : "text-gray-500"}`}>
          {description}
        </p>
      </div>
    </div>
  </div>
);

export default StatusOption;
