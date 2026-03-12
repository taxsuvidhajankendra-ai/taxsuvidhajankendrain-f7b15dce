import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, FileText, ArrowRight, CheckCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-hero-gradient text-primary-foreground">
      {/* Chakra BG */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-current rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-current rounded-full" />
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-px h-[300px] bg-current origin-bottom"
            style={{ transform: `translate(-50%, -100%) rotate(${i * 15}deg)` }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-28 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
              <Shield className="h-4 w-4" />
              Trusted by 10,000+ Customers
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              Reliable, Legal &{" "}
              <span className="text-gradient-saffron">Transparent</span>{" "}
              Services
            </h1>

            <p className="text-xl md:text-2xl font-hindi opacity-90 mb-6">
              भरोसेमंद, कानूनी और पारदर्शी सेवाएँ
            </p>

            <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">
              Your one-stop solution for GST, Income Tax, PAN, Aadhaar,
              Website Design & all government services.
            </p>

            {/* Quick trust points */}
            <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm opacity-80">
              {["Fast Processing", "Government Authorized", "100% Secure"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  {item}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-saffron-gradient text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                <FileText className="h-5 w-5" />
                Our Services
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 font-semibold text-lg hover:bg-primary-foreground/20 transition-all"
              >
                Book Now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
          >
            {[
              { value: "10K+", label: "Happy Clients" },
              { value: "50K+", label: "Returns Filed" },
              { value: "99%", label: "Success Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                <p className="text-xs md:text-sm opacity-70">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path d="M0 60L1440 60L1440 20C1200 50 960 0 720 20C480 40 240 10 0 30L0 60Z" fill="hsl(40 33% 98%)" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
