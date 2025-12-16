import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Store, Users, ShieldCheck, ArrowRight, Package, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="gradient-primary text-primary-foreground">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Package className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-heading font-bold">B2B Footwear</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/seller">Seller Portal</Link>
            </Button>
            <Button className="gradient-accent text-accent-foreground" asChild>
              <Link to="/admin">Admin Panel</Link>
            </Button>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 animate-fade-in">
            B2B Footwear Sales Platform
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8 animate-slide-up">
            Connect retailers with wholesalers. Manage catalogs, orders, payments, and deliveries all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button size="lg" className="gradient-accent text-accent-foreground shadow-lg hover:shadow-xl transition-shadow" asChild>
              <Link to="/seller">
                <Store className="w-5 h-5 mr-2" />
                Seller Portal
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-secondary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/admin">
                <ShieldCheck className="w-5 h-5 mr-2" />
                Admin Panel
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Store, title: 'Seller Portal', desc: 'Manage catalog, inventory, orders, and pricing from one dashboard' },
              { icon: Users, title: 'Retailer Management', desc: 'Onboard retailers, verify documents, and manage credit lines' },
              { icon: TrendingUp, title: 'Analytics', desc: 'Track sales, orders, and performance metrics in real-time' },
            ].map((feature) => (
              <Card key={feature.title} className="shadow-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-xl gradient-primary mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-accent-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-accent-foreground/80 mb-6">Choose your portal to begin</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/seller">
                Seller Portal <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/admin">
                Admin Panel <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
