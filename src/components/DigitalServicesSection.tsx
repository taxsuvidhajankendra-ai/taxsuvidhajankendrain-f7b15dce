import { motion } from "framer-motion";
import { Palette, Globe, Code, Layout, Image, CreditCard, Monitor, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const digitalServices = [
  { icon: Globe, title: "Website Design", desc: "Professional, responsive website design for your business." },
  { icon: Code, title: "Website Development", desc: "Full-stack custom website development with modern tech." },
  { icon: Layout, title: "Website Templates", desc: "Ready-made templates for quick business launch." },
  { icon: Palette, title: "Logo Design", desc: "Unique, professional logo that defines your brand." },
  { icon: Image, title: "Banner Design", desc: "Eye-catching banners for social media and print." },
  { icon: CreditCard, title: "Visiting Card Design", desc: "Premium visiting card designs for professionals." },
  { icon: Palette, title: "Graphic Design", desc: "Complete graphic design for branding and marketing." },
  { icon: Monitor, title: "Digital Services", desc: "Social media setup, digital marketing and online presence." },
];

const DigitalServicesSection = () => (
  <section className="py-20 bg-muted/30" id="digital-services">
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-3">
          Digital & Design Services
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Grow Your Business Online
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Professional digital services — website, logo, graphic design aur bahut kuch
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {digitalServices.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="group bg-card rounded-2xl border border-border shadow-card p-5 text-center hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-secondary/20 group-hover:scale-110 transition-all duration-300">
              <item.icon className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          Contact for Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default DigitalServicesSection;
