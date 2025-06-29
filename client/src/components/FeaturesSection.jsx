import {
  FileText,
  Store,
  BarChart3,
  Download,
  Repeat,
  PackageCheck,
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <FileText size={28} color="#fabd05" />,
      title: "GST Billing",
      desc: "Generate professional GST invoices in seconds.",
    },
    {
      icon: <Store size={28} color="#fabd05" />,
      title: "Store Management",
      desc: "Track stock, purchases, and updates.",
    },
    {
      icon: <BarChart3 size={28} color="#fabd05" />,
      title: "Insights",
      desc: "See item trends and business analytics.",
    },
    {
      icon: <Download size={28} color="#fabd05" />,
      title: "PDF Invoicing",
      desc: "Download clean, structured invoices.",
    },
    {
      icon: <Repeat size={28} color="#fabd05" />,
      title: "Transactions",
      desc: "Keep logs of all your buys & sells.",
    },
    {
      icon: <PackageCheck size={28} color="#fabd05" />,
      title: "Inventory Alerts",
      desc: "Never run out — get real-time stock alerts.",
    },
  ];
  return (
    <>
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl sm:text-5xl font-extrabold text-[#1E1E2D] mb-4">
            Everything You Need to Grow Your Business
          </h2>
          <p className="text-gray-500 text-base sm:text-lg mb-14">
            Powerful features designed specifically for Indian small and medium
            businesses
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-[#fefefe] border border-gray-200 rounded-xl p-6 text-left hover:shadow-md  hover:scale-105 hover:border-[#fabd05] transition"
              >
                <div className="bg-yellow-50 w-10 h-10 flex items-center justify-center rounded-md mb-4">
                  <div className="text-[#1E1E2D]">{f.icon}</div>
                </div>
                <h4 className="text-lg font-bold text-[#1E1E2D] mb-1">
                  {f.title}
                </h4>
                <p className="text-md text-gray-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturesSection;
