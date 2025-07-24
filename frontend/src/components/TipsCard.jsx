import { Lightbulb } from "lucide-react";

const TipsCard = () => (
  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
    <div className="flex items-center space-x-2 mb-4">
      <Lightbulb className="w-5 h-5 text-blue-600" />
      <h3 className="font-semibold text-blue-900">Quick Tips</h3>
    </div>
    <ul className="space-y-2 text-sm text-blue-800">
      <li className="flex items-start space-x-2">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
        <span>Include company size and industry for better tracking</span>
      </li>
      <li className="flex items-start space-x-2">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
        <span>Add salary range and benefits for comparison</span>
      </li>
      <li className="flex items-start space-x-2">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
        <span>Note key requirements and skills needed</span>
      </li>
    </ul>
  </div>
);

export default TipsCard;
