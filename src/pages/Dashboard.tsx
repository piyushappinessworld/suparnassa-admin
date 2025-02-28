
import { BarChart, Users, Home } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Site Traffic",
      value: "2,345",
      change: "+14%",
      icon: BarChart,
    },
    {
      title: "Properties Listed",
      value: "48",
      change: "+7%",
      icon: Home,
    },
    {
      title: "Total Users",
      value: "1,257",
      change: "+21%",
      icon: Users,
    },
  ];

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.title}
            className="bg-white overflow-hidden rounded-xl border border-gray-200 hover:border-primary/20 transition-colors"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.title}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {item.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        {item.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
