import { Bookmark, Clock, Users, CheckCircle, XCircle } from "lucide-react";

export const statusOptions = [
  {
    value: "saved",
    label: "Saved",
    icon: Bookmark,
    color: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
    description: "Interested, haven't applied yet",
  },
  {
    value: "applied",
    label: "Applied",
    icon: Clock,
    color: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
    description: "Application submitted",
  },
  {
    value: "interviewing",
    label: "Interviewing",
    icon: Users,
    color: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
    description: "In the interview process",
  },
  {
    value: "offer",
    label: "Offer",
    icon: CheckCircle,
    color: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    description: "Received job offer",
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: XCircle,
    color: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    description: "Application declined",
  },
];
