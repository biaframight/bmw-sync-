import { 
  useGetFeaturedProducts, 
  useGetFeaturedSellers, 
  useGetCategories,
  getGetFeaturedProductsQueryKey,
  getGetFeaturedSellersQueryKey,
  getGetCategoriesQueryKey
} from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { SellerCard } from "@/components/seller-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ArrowRight, UtensilsCrossed, Shirt, Sparkles, Store } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocationFilter] = useState("KL");

  const { data: featuredProducts, isLoading: isProductsLoading } = useGetFeaturedProducts({
    query: { queryKey: getGetFeaturedProductsQueryKey() }
  });

  const { data: featuredSellers, isLoading: isSellersLoading } = useGetFeaturedSellers({
    query: { queryKey: getGetFeaturedSellersQueryKey() }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (location) params.append("location", location);
    setLocation(`/products?${params.toString()}`);
  };

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'food': return <UtensilsCrossed className="w-8 h-8" />;
      case 'fashion': return <Shirt className="w-8 h-8" />;
      case 'services': return <Sparkles className="w-8 h-8" />;
      default: return <Store className="w-8 h-8" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-12">
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 md:pt-32 md:pb-40 overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20 shadow-sm">
              Your African Marketplace in Malaysia
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 font-serif max-w-4xl tracking-tight leading-tight"
          >
            Find <span className="text-primary italic">Home</span>, Anywhere.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl font-medium"
          >
            Jollof rice, ankara prints, braiding services, and everything you miss from home. Connect with trusted sellers near you.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-3xl bg-white p-2 rounded-2xl md:rounded-full shadow-xl shadow-primary/5 border border-border/50 flex flex-col md:flex-row gap-2"
          >
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row w-full gap-2">
              <div className="flex-1 flex items-center px-4 bg-muted/30 rounded-xl md:rounded-full border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-all h-14">
                <Search className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
                <input 
                  type="text" 
                  placeholder="What are you looking for?" 
                  className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-48 flex items-center px-4 bg-muted/30 rounded-xl md:rounded-full border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-all h-14">
                <MapPin className="w-5 h-5 text-muted-foreground mr-3 flex-shrink-0" />
                <select 
                  className="w-full bg-transparent border-none outline-none text-foreground cursor-pointer appearance-none"
                  value={location}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="">All Malaysia</option>
                  <option value="KL">Kuala Lumpur</option>
                  <option value="Selangor">Selangor</option>
                  <option value="Penang">Penang</option>
                  <option value="Johor">Johor</option>
                </select>
              </div>
              
              <Button type="submit" size="lg" className="h-14 rounded-xl md:rounded-full px-8 text-base font-semibold shadow-md">
                Search
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 -mt-10 relative z-20 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { name: "Food", color: "bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-100", icon: <UtensilsCrossed className="w-6 h-6" /> },
            { name: "Fashion", color: "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100", icon: <Shirt className="w-6 h-6" /> },
            { name: "Services", color: "bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-100", icon: <Sparkles className="w-6 h-6" /> },
            { name: "Groceries", color: "bg-green-50 text-green-600 hover:bg-green-100 border-green-100", icon: <Store className="w-6 h-6" /> }
          ].map((cat, i) => (
            <Link key={cat.name} href={`/products?category=${cat.name}`} className={`flex flex-col items-center justify-center p-6 rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 ${cat.color} group`}>
              <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <span className="font-semibold text-foreground">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sponsored/Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground font-serif">Market Highlights</h2>
            <p className="text-muted-foreground mt-2">Discover popular items from our community</p>
          </div>
          <Link href="/products" className="hidden md:flex items-center text-primary font-medium hover:underline gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isProductsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="w-full aspect-square rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {featuredProducts?.products.slice(0, 5).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild className="rounded-full w-full">
            <Link href="/products">View all products</Link>
          </Button>
        </div>
      </section>

      {/* Featured Sellers */}
      <section className="bg-muted/30 border-y border-border/50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground font-serif">Top Rated Sellers</h2>
              <p className="text-muted-foreground mt-2">Trustworthy businesses loved by the community</p>
            </div>
            <Link href="/sellers" className="hidden md:flex items-center text-primary font-medium hover:underline gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isSellersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-full h-64 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredSellers?.sellers.slice(0, 4).map((seller, i) => (
                <SellerCard key={seller.id} seller={seller} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to action */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl shadow-primary/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 md:w-2/3">
            <h2 className="text-3xl md:text-5xl font-bold text-white font-serif mb-4">Have something to sell?</h2>
            <p className="text-primary-foreground/90 text-lg mb-8 max-w-xl">
              Join hundreds of African businesses thriving in Malaysia. Set up your shop in minutes and reach thousands of buyers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild className="rounded-full font-bold text-secondary-foreground">
                <Link href="/become-seller">Open Your Store</Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-white border-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative z-10 md:w-1/3 flex justify-center">
            <div className="w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Store className="w-24 h-24 text-white" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
