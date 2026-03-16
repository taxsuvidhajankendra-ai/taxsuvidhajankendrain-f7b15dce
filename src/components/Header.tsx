import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import logo from "@/assets/logo.jpg";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const searchSuggestions = [
  "GST Registration",
  "GST Return Filing",
  "Income Tax Return (ITR)",
  "TDS Filing",
  "PAN Card Services",
  "Aadhaar Services",
  "GST Late Fee",
  "ITR Filing Deadline",
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const filteredSuggestions = searchQuery.length > 0
    ? searchSuggestions.filter((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Tricolor Bar */}
      <div className="h-1 bg-tricolor-bar w-full" />

      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="Tax Suvidha Jan Kendra Logo" className="h-12 w-12 object-contain rounded" />
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-primary leading-tight">Tax Suvidha</p>
              <p className="text-xs font-semibold text-primary leading-tight">Jan Kendra</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search + Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                placeholder="Search GST, ITR, PAN, Aadhaar services..."
                className="pl-9 pr-4 py-2 w-64 lg:w-80 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              {searchOpen && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg border border-border shadow-card-hover z-50">
                  {filteredSuggestions.map((s) => (
                    <Link
                      key={s}
                      to="/services"
                      className="block px-4 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className="hidden lg:inline-flex items-center px-4 py-2 rounded-lg bg-saffron-gradient text-sm font-semibold text-primary-foreground shadow hover:opacity-90 transition-opacity"
            >
              Book Now
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-border bg-card animate-fade-in">
            <div className="p-4">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search services..."
                  className="pl-9 pr-4 py-2 w-full rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="block mt-3 text-center px-4 py-2.5 rounded-lg bg-saffron-gradient text-sm font-semibold text-primary-foreground"
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
