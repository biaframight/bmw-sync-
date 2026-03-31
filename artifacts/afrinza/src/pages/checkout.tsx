import { useState } from "react";
import { useLocation } from "wouter";
import { 
  useGetCart, 
  getGetCartQueryKey,
  useCreateOrder
} from "@workspace/api-client-react";
import { getSessionId } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ChevronLeft, MapPin, Truck, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const checkoutSchema = z.object({
  buyerName: z.string().min(2, "Name must be at least 2 characters"),
  buyerPhone: z.string().min(8, "Valid phone number required"),
  buyerAddress: z.string().min(10, "Please provide full delivery address"),
  paymentMethod: z.string(),
  deliveryMethod: z.string(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const sessionId = getSessionId();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: cart, isLoading } = useGetCart(
    { sessionId },
    { query: { queryKey: getGetCartQueryKey({ sessionId }) } }
  );

  const createOrder = useCreateOrder();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      buyerName: "",
      buyerPhone: "",
      buyerAddress: "",
      paymentMethod: "Cash on Delivery",
      deliveryMethod: "Grab Delivery",
    },
  });

  const onSubmit = (data: CheckoutFormValues) => {
    createOrder.mutate({
      data: {
        sessionId,
        ...data
      }
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        // Clear cart cache
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
        window.scrollTo(0, 0);
      },
      onError: () => {
        toast.error("Failed to place order. Please try again.");
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold font-serif mb-4">Order Placed Successfully!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Thank you for shopping with Afrinza. Your order details have been sent to the sellers.
          They will contact you shortly via WhatsApp to confirm delivery.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => setLocation("/")} className="rounded-full px-8 h-12 text-base font-bold shadow-md">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || (!cart?.items.length && !createOrder.isPending)) {
    if (!isLoading && !cart?.items.length) {
      setLocation("/cart");
    }
    return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-muted/10 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/cart")} className="rounded-full bg-white shadow-sm border border-border">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold font-serif">Checkout</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8">
            
            {/* Form Section */}
            <div className="flex-1 space-y-8">
              {/* Delivery Details */}
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                  <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold">Delivery Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="buyerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="h-12 bg-muted/30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="buyerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+60 12-345 6789" className="h-12 bg-muted/30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="buyerAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Full Delivery Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Unit number, Building name, Street, Postcode, City" 
                            className="min-h-[100px] resize-none bg-muted/30"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Delivery & Payment Methods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Delivery */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                    <div className="bg-accent/10 p-2 rounded-full text-accent">
                      <Truck className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold">Delivery Method</h2>
                  </div>

                  <FormField
                    control={form.control}
                    name="deliveryMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border border-border p-4 bg-white hover:bg-muted/30 cursor-pointer transition-colors [&:has([data-state=checked])]:border-accent [&:has([data-state=checked])]:bg-accent/5">
                              <FormControl>
                                <RadioGroupItem value="Grab Delivery" />
                              </FormControl>
                              <div className="flex-1">
                                <FormLabel className="font-semibold cursor-pointer">Grab / Lalamove</FormLabel>
                                <p className="text-sm text-muted-foreground mt-1">Same day delivery (Buyer pays rider)</p>
                              </div>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border border-border p-4 bg-white hover:bg-muted/30 cursor-pointer transition-colors [&:has([data-state=checked])]:border-accent [&:has([data-state=checked])]:bg-accent/5">
                              <FormControl>
                                <RadioGroupItem value="Self Pickup" />
                              </FormControl>
                              <div className="flex-1">
                                <FormLabel className="font-semibold cursor-pointer">Self Pickup</FormLabel>
                                <p className="text-sm text-muted-foreground mt-1">Collect from seller location</p>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Payment */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-border shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
                    <div className="bg-secondary/20 p-2 rounded-full text-secondary-foreground">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold">Payment Method</h2>
                  </div>

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border border-border p-4 bg-white hover:bg-muted/30 cursor-pointer transition-colors [&:has([data-state=checked])]:border-secondary [&:has([data-state=checked])]:bg-secondary/5">
                              <FormControl>
                                <RadioGroupItem value="Touch n Go eWallet" />
                              </FormControl>
                              <div className="flex-1">
                                <FormLabel className="font-semibold cursor-pointer">Touch n Go eWallet</FormLabel>
                                <p className="text-sm text-muted-foreground mt-1">Transfer directly to seller</p>
                              </div>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border border-border p-4 bg-white hover:bg-muted/30 cursor-pointer transition-colors [&:has([data-state=checked])]:border-secondary [&:has([data-state=checked])]:bg-secondary/5">
                              <FormControl>
                                <RadioGroupItem value="Cash on Delivery" />
                              </FormControl>
                              <div className="flex-1">
                                <FormLabel className="font-semibold cursor-pointer">Cash on Delivery</FormLabel>
                                <p className="text-sm text-muted-foreground mt-1">Pay when you receive</p>
                              </div>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border border-border p-4 bg-white hover:bg-muted/30 cursor-pointer transition-colors [&:has([data-state=checked])]:border-secondary [&:has([data-state=checked])]:bg-secondary/5">
                              <FormControl>
                                <RadioGroupItem value="Bank Transfer" />
                              </FormControl>
                              <div className="flex-1">
                                <FormLabel className="font-semibold cursor-pointer">Bank Transfer</FormLabel>
                                <p className="text-sm text-muted-foreground mt-1">Direct transfer to seller's account</p>
                              </div>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="bg-white rounded-3xl border border-border shadow-sm p-6 md:p-8 sticky top-24">
                <h3 className="text-xl font-bold mb-6 font-serif border-b border-border/50 pb-4">Order Summary</h3>
                
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                  {cart?.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden shrink-0">
                        {item.product?.imageUrl && (
                          <img src={item.product.imageUrl} alt={item.product.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <p className="font-medium text-sm line-clamp-2 leading-tight">{item.product?.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-semibold text-sm">
                        RM {(parseFloat(String(item.product?.price || 0)) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 text-sm border-t border-border/50 pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({cart?.itemCount} items)</span>
                    <span className="font-medium">RM {parseFloat(String(cart?.total || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span className="font-medium">RM 0.00</span>
                  </div>
                  <div className="border-t border-border pt-4 mt-2 flex justify-between items-center">
                    <span className="font-bold text-base">Total to Pay</span>
                    <span className="font-bold text-3xl text-primary">RM {parseFloat(String(cart?.total || 0)).toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-full text-base font-bold shadow-md hover:shadow-lg transition-all mb-4"
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? "Processing..." : "Place Order via WhatsApp"}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground px-2">
                  By placing this order, you agree to contact the sellers directly to finalize payment and delivery.
                </p>
              </div>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}
