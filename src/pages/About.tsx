import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Users, Award, Target, Zap, Globe, Heart, FileText, CreditCard, Fingerprint, BarChart3, CheckCircle, ArrowRight, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import leadersBudget from "@/assets/leaders-budget.webp";
import leadersEvent from "@/assets/leaders-event.jpg";
import logo from "@/assets/logo.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const About = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      {/* Hero */}
      <section className="bg-hero-gradient text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-sm font-semibold mb-4 backdrop-blur-sm">
              About Us
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">Tax Suvidha Jan Kendra</h1>
            <p className="text-lg md:text-xl opacity-85 max-w-2xl mx-auto">
              Your trusted partner for tax & government services — Supporting India's Digital Economy
            </p>
            <p className="text-base font-hindi opacity-70 mt-2">भारत की डिजिटल अर्थव्यवस्था का समर्थन</p>
          </motion.div>
        </div>
      </section>

      {/* Logo + Leader Photos Section */}
      <section className="py-14 md:py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Government of India – Tax Service Initiative</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Supporting India's mission for transparent, accessible and digital tax services for every citizen</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden border-2 border-secondary/30 shadow-card-hover bg-card p-2">
                <img src={logo} alt="Tax Suvidha Jan Kendra Logo" className="w-full h-full object-contain rounded-xl" />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">Tax Suvidha Jan Kendra</p>
              <p className="text-xs text-muted-foreground font-hindi">टैक्स सुविधा जन केंद्र</p>
            </motion.div>

            {/* PM Photo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-full max-w-[280px] aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-card-hover">
                <img src={leadersBudget} alt="Hon'ble Prime Minister and Finance Minister of India" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary)/0.6)] to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                  <p className="text-xs font-semibold text-primary-foreground">Hon'ble Leadership</p>
                  <p className="text-[10px] text-primary-foreground/80">Government of India</p>
                </div>
              </div>
            </motion.div>

            {/* FM Photo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-full max-w-[280px] aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-card-hover">
                <img src={leadersEvent} alt="Hon'ble Prime Minister and Finance Minister at national event" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--primary)/0.6)] to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                  <p className="text-xs font-semibold text-primary-foreground">Digital India Initiative</p>
                  <p className="text-[10px] text-primary-foreground/80">Building a Digital Nation</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div {...fadeUp}>
            <div className="bg-card rounded-2xl border border-border shadow-card p-8 md:p-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-secondary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Who We Are</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4 text-base">
                <strong className="text-foreground">Tax Suvidha Jan Kendra</strong> is a government-authorized service center dedicated to providing reliable, legal and transparent tax and government services to citizens across India. We believe every citizen deserves easy access to essential services without bureaucratic hassle.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4 text-base">
                Our team of experienced professionals ensures that your GST registration, income tax filing, PAN card services, and Aadhaar-related work is completed accurately, on time, and at affordable prices.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base">
                Under the Government of India's Digital India initiative, we support citizens and businesses with fast, transparent and technology-driven tax and documentation services.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-muted/30 chakra-bg">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-3">
              Why Choose Us
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Core Values</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Target, title: "Mission of Tax Suvidha Jan Kendra", titleHi: "हमारा मिशन", desc: "To make tax compliance simple, affordable and accessible for every Indian citizen and business. We bridge the gap between complex government processes and common people.", color: "bg-saffron-light text-secondary" },
              { icon: Globe, title: "Government Digital Service Support", titleHi: "डिजिटल सेवा समर्थन", desc: "We support the Digital India initiative by providing online tax filing, e-verification, digital document processing and technology-driven government services.", color: "bg-navy-light text-primary" },
              { icon: Heart, title: "Customer Trust & Transparency", titleHi: "विश्वास और पारदर्शिता", desc: "Your data is encrypted and secure. We follow strict data protection guidelines and maintain complete transparency in pricing, processing and service delivery.", color: "bg-india-green-light text-accent" },
              { icon: Zap, title: "Fast Online Processing", titleHi: "तेज़ ऑनलाइन प्रोसेसिंग", desc: "Get your applications processed quickly with our streamlined online system. Track your application status in real-time and receive instant updates.", color: "bg-saffron-light text-secondary" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group bg-card rounded-2xl border border-border shadow-card p-6 md:p-8 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm font-hindi text-muted-foreground mb-3">{item.titleHi}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Services */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-3">Our Key Services</span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Comprehensive Tax & Government Services</h2>
            <p className="text-muted-foreground mt-2">PAN Card, ITR Filing, GST, Aadhaar and more</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: CreditCard, title: "PAN Card Services", titleHi: "पैन कार्ड" },
              { icon: FileText, title: "ITR Filing", titleHi: "आयकर रिटर्न" },
              { icon: BarChart3, title: "GST Services", titleHi: "जीएसटी सेवाएँ" },
              { icon: Fingerprint, title: "Aadhaar Services", titleHi: "आधार सेवाएँ" },
              { icon: Shield, title: "TDS Returns", titleHi: "टीडीएस रिटर्न" },
              { icon: Building2, title: "Business Registration", titleHi: "व्यापार पंजीकरण" },
            ].map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="group bg-card rounded-xl border border-border p-5 text-center hover:shadow-card-hover hover:border-secondary/30 transition-all duration-300"
              >
                <service.icon className="h-8 w-8 text-secondary mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-sm font-semibold text-foreground mb-1">{service.title}</h3>
                <p className="text-xs font-hindi text-muted-foreground">{service.titleHi}</p>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} className="text-center mt-10">
            <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              View All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-hero-gradient text-primary-foreground">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div {...fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Happy Clients", labelHi: "खुश ग्राहक" },
              { value: "50,000+", label: "Returns Filed", labelHi: "रिटर्न दाखिल" },
              { value: "99%", label: "Success Rate", labelHi: "सफलता दर" },
              { value: "5+", label: "Years Experience", labelHi: "वर्षों का अनुभव" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
                <p className="text-xs font-hindi opacity-60">{stat.labelHi}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Shield, title: "Government Authorized", desc: "Licensed and authorized service center" },
              { icon: Users, title: "Expert Team", desc: "Certified tax professionals" },
              { icon: Award, title: "Data Security", desc: "Encrypted & protected data" },
              { icon: CheckCircle, title: "100% Compliance", desc: "Fully legal & transparent" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-start gap-3 bg-card rounded-xl border border-border shadow-card p-5 hover:shadow-card-hover transition-shadow duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
