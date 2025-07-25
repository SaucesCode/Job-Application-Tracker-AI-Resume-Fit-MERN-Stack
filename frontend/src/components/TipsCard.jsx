import { Lightbulb } from "lucide-react";

export const TipsCard = () => (
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

export const EditingTipsCard = () => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <Lightbulb className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-green-900 mb-2">Editing Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-green-800">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Update status as you progress</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Add interview notes and feedback</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Keep salary information updated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TipsCard;
