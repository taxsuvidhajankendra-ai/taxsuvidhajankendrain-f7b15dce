import { useState } from "react";
import { Calculator, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  "GST Registration",
  "GST Return Filing (Monthly)",
  "GST Return Filing (Quarterly)",
  "Income Tax Return (Salaried)",
  "Income Tax Return (Business)",
  "TDS Filing",
  "PAN Card (New/Correction)",
  "Aadhaar Update/Linking",
  "Website Design",
  "Logo Design",
  "Banner/Visiting Card Design",
];

const TaxCalculator = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleService = (service: string) => {
    setSelected((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-3">
            <Calculator className="inline h-4 w-4 mr-1" />
            Service Selector
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Select Your Services
          </h2>
          <p className="text-muted-foreground">Choose the services you need and contact us for a quote</p>
        </div>

        <div className="max-w-2xl mx-auto bg-card rounded-2xl border border-border shadow-card p-6 md:p-8">
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {services.map((service) => (
              <button
                key={service}
                onClick={() => toggleService(service)}
                className={`flex items-center px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all duration-200 ${
                  selected.includes(service)
                    ? "border-secondary bg-secondary/10 text-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-secondary/50"
                }`}
              >
                <span className={`w-4 h-4 rounded-full border-2 mr-3 shrink-0 transition-colors ${
                  selected.includes(service) ? "bg-secondary border-secondary" : "border-muted-foreground/40"
                }`} />
                {service}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <div>
              <p className="text-sm text-muted-foreground">
                {selected.length} service{selected.length !== 1 ? "s" : ""} selected
              </p>
              <p className="text-xs text-muted-foreground mt-1">Contact us for pricing details</p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-saffron-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Get Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaxCalculator;
