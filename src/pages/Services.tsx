import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  FileText, BarChart3, Calculator, Receipt, CreditCard, Fingerprint,
  CheckCircle, Building2, MessageSquare, Palette, Globe, Code, Layout,
  FileCheck, Image, CreditCard as CardIcon, Monitor
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const allServices = [
  // Tax & Government
  { icon: FileText, title: "GST Registration", titleHi: "जीएसटी पंजीकरण", description: "Get your business registered under GST with expert assistance. Complete documentation to approval.", features: ["GSTIN Number", "Expert Documentation", "Quick Processing", "Government Fees Included"], category: "Tax & Government" },
  { icon: BarChart3, title: "GST Return Filing", titleHi: "जीएसटी रिटर्न फाइलिंग", description: "Timely and accurate filing of GSTR-1, GSTR-3B, GSTR-9 and annual returns.", features: ["Monthly/Quarterly Filing", "GSTR-1 & GSTR-3B", "Annual Return", "Compliance Review"], category: "Tax & Government" },
  { icon: Calculator, title: "Income Tax Return (ITR)", titleHi: "आयकर रिटर्न", description: "Professional ITR filing for salaried employees, freelancers and businesses.", features: ["All ITR Forms", "Tax Planning", "Refund Maximization", "Expert Review"], category: "Tax & Government" },
  { icon: Receipt, title: "TDS Filing", titleHi: "टीडीएस फाइलिंग", description: "Complete TDS return filing including salary, rent, professional fees and contractor payments.", features: ["TDS Returns", "Form 16/16A", "Challan Management", "Compliance"], category: "Tax & Government" },
  { icon: CreditCard, title: "PAN Card Services", titleHi: "पैन कार्ड सेवाएँ", description: "New PAN card application, corrections, reprints and PAN-Aadhaar linking.", features: ["New PAN", "Corrections", "Reprint", "Aadhaar Linking"], category: "Tax & Government" },
  { icon: Fingerprint, title: "Aadhaar Services", titleHi: "आधार सेवाएँ", description: "Aadhaar enrollment, update, correction and linking services.", features: ["Enrollment", "Update/Correction", "Download", "Linking Services"], category: "Tax & Government" },
  { icon: Building2, title: "Business Registration", titleHi: "व्यापार पंजीकरण", description: "Company incorporation, MSME registration, trade license and compliance setup.", features: ["Company Registration", "MSME Registration", "Trade License", "Compliance Setup"], category: "Tax & Government" },
  { icon: MessageSquare, title: "Tax Consultation", titleHi: "कर परामर्श", description: "Expert consultation for individuals and businesses on tax planning and compliance.", features: ["Tax Planning", "Expert Advice", "Compliance Review", "Personalized Solutions"], category: "Tax & Government" },
  { icon: FileCheck, title: "Government Document Services", titleHi: "सरकारी दस्तावेज़ सेवाएँ", description: "Complete assistance with government document processing, verification and attestation.", features: ["Document Processing", "Verification", "Attestation", "E-Filing Support"], category: "Tax & Government" },
  { icon: FileText, title: "Online Form Services", titleHi: "ऑनलाइन फॉर्म सेवाएँ", description: "Help with filling and submitting government online forms and applications.", features: ["Form Filling", "Online Submission", "Application Tracking", "Status Updates"], category: "Tax & Government" },
  // Digital & Design
  { icon: Globe, title: "Website Design", titleHi: "वेबसाइट डिज़ाइन", description: "Professional, modern website design to establish your online presence.", features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Mobile Friendly"], category: "Digital & Design" },
  { icon: Code, title: "Website Development", titleHi: "वेबसाइट डेवलपमेंट", description: "Full-stack website development with modern technologies and custom features.", features: ["Custom Development", "E-Commerce", "CMS Integration", "API Integration"], category: "Digital & Design" },
  { icon: Layout, title: "Website Templates", titleHi: "वेबसाइट टेम्पलेट्स", description: "Ready-made professional website templates for quick business launch.", features: ["Pre-built Designs", "Easy Customization", "Quick Setup", "Multiple Industries"], category: "Digital & Design" },
  { icon: Palette, title: "Logo Design", titleHi: "लोगो डिज़ाइन", description: "Professional logo design that represents your brand identity.", features: ["Custom Design", "Multiple Concepts", "Source Files", "Unlimited Revisions"], category: "Digital & Design" },
  { icon: Image, title: "Banner Design", titleHi: "बैनर डिज़ाइन", description: "Eye-catching banner designs for social media, websites and print.", features: ["Social Media Banners", "Web Banners", "Print Banners", "Custom Sizes"], category: "Digital & Design" },
  { icon: CardIcon, title: "Visiting Card Design", titleHi: "विजिटिंग कार्ड डिज़ाइन", description: "Professional visiting card designs that leave a lasting impression.", features: ["Modern Designs", "Print Ready", "Double Sided", "Premium Finish"], category: "Digital & Design" },
  { icon: Palette, title: "Graphic Design", titleHi: "ग्राफिक डिज़ाइन", description: "Complete graphic design services for branding, marketing and business.", features: ["Branding", "Marketing Materials", "Social Media", "Print Design"], category: "Digital & Design" },
  { icon: Monitor, title: "Digital Services", titleHi: "डिजिटल सेवाएँ", description: "Comprehensive digital services to help your business grow online.", features: ["Digital Marketing", "Social Media Setup", "Online Presence", "Brand Building"], category: "Digital & Design" },
];

const categories = ["Tax & Government", "Digital & Design"];

const Services = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      <section className="bg-hero-gradient text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-sm font-semibold mb-4 backdrop-blur-sm">All Services</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">Our Services</h1>
            <p className="text-lg opacity-80 max-w-xl mx-auto">Complete tax, government & digital services under one roof</p>
          </motion.div>
        </div>
      </section>

      {categories.map((category) => (
        <section key={category} className={`py-14 md:py-16 ${category === "Digital & Design" ? "bg-muted/30" : "bg-background"}`}>
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-1 rounded-full bg-saffron-gradient" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{category}</h2>
              </div>
              <p className="text-muted-foreground text-sm ml-4 pl-3">
                {category === "Tax & Government" ? "Professional tax filing, registration and government document services" : "Website design, development, branding and digital marketing services"}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-5">
              {allServices.filter(s => s.category === category).map((service, i) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="group bg-card rounded-2xl border border-border shadow-card p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors duration-300">
                      <service.icon className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-foreground">{service.title}</h3>
                      <p className="text-xs font-hindi text-muted-foreground mb-2">{service.titleHi}</p>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{service.description}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {service.features.map((f) => (
                          <div key={f} className="flex items-center gap-1 text-xs text-foreground">
                            <CheckCircle className="h-3 w-3 text-accent shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-16 bg-hero-gradient text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Get Started?</h2>
            <p className="opacity-80 mb-6 max-w-md mx-auto">Contact us today for any service. We'll guide you through the complete process.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-saffron-gradient text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
              Contact Us Now
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Services;
