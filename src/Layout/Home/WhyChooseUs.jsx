import {
  FaHandHoldingHeart,
  FaUsers,
  FaShieldAlt,
  FaGlobe,
} from "react-icons/fa";

const WhyChooseUs = () => {
  const features = [
    {
      icon: FaHandHoldingHeart,
      number: "01",
      title: "Give Hope, Save Lives",
      description:
        "A single blood donation can become someone's second chance at life when they need it most.",
    },
    {
      icon: FaUsers,
      number: "02",
      title: "A Community That Cares",
      description:
        "Be part of a responsible community where donors come together to help people in critical moments.",
    },
    {
      icon: FaShieldAlt,
      number: "03",
      title: "Simple & Reliable",
      description:
        "Find and connect with blood donors through a simple, trustworthy and user-friendly platform.",
    },
    {
      icon: FaGlobe,
      number: "04",
      title: "Help Beyond Boundaries",
      description:
        "Connect with donors across different locations and make finding the right blood group easier.",
    },
  ];

  return (
    <section className="bg-white px-5 py-20 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-red-600">
            Why Choose Us
          </p>

          <h2 className="font-serif text-4xl font-black italic leading-[1.1] tracking-tight text-gray-950 sm:text-5xl md:text-6xl">
            More Than a Donation,
            <span className="block text-red-600">
              It's a Chance to Live
            </span>
          </h2>

          <div className="mx-auto mt-6 flex items-center justify-center gap-2">
            <span className="h-[2px] w-8 bg-gray-200" />
            <span className="h-[3px] w-12 rounded-full bg-red-600" />
            <span className="h-[2px] w-8 bg-gray-200" />
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-sm font-medium leading-7 text-gray-500 sm:text-base">
            We make it easier for people to connect, donate blood and support
            one another when every moment matters.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.number}
                className="group relative overflow-hidden rounded-[24px] border border-gray-100 bg-white p-7 shadow-[0_10px_35px_rgba(0,0,0,0.035)] transition-all duration-500 hover:-translate-y-2 hover:border-red-100 hover:shadow-[0_20px_50px_rgba(220,38,38,0.10)]"
              >
                {/* Hover Background */}
                <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-red-50 opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100" />

                {/* Top Accent */}
                <div className="absolute left-0 top-0 h-[3px] w-0 bg-red-600 transition-all duration-500 group-hover:w-full" />

                <div className="relative z-10">
                  {/* Number + Icon */}
                  <div className="mb-8 flex items-center justify-between">
                    <span className="font-serif text-3xl font-black italic text-gray-100 transition-colors duration-300 group-hover:text-red-100">
                      {feature.number}
                    </span>

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-red-600 transition-all duration-300 group-hover:border-red-600 group-hover:bg-red-600 group-hover:text-white">
                      <Icon className="text-xl" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-red-600">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm font-medium leading-6 text-gray-500">
                    {feature.description}
                  </p>

                  {/* Bottom Line */}
                  <div className="mt-7 flex items-center gap-2">
                    <span className="h-[2px] w-7 bg-red-600 transition-all duration-500 group-hover:w-12" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-300">
                      Make an impact
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Statement */}
        <div className="mt-16 border-t border-gray-100 pt-10">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <p className="font-serif text-2xl font-black italic text-gray-900 sm:text-3xl">
                One donor. One moment. One life changed.
              </p>

              <p className="mt-2 text-sm font-medium text-gray-400">
                Your decision to donate can mean everything to someone else.
              </p>
            </div>

            <div className="hidden h-12 w-px bg-gray-200 md:block" />

            <div className="max-w-xs">
              <p className="text-sm font-semibold leading-6 text-gray-500">
                Every contribution matters. Every donor makes a difference.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;