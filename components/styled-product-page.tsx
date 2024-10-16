'use client';

import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StarIcon, CheckIcon } from "lucide-react"
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function StyledProductPage() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClientSecret = async (): Promise<string> => {
    console.log('Fetching client secret...');
    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!data.clientSecret) {
        throw new Error('No client secret returned from the server');
      }
      
      return data.clientSecret;
    } catch (err) {
      console.error('Error fetching client secret:', err);
      setError('Failed to initiate checkout. Please try again.');
      throw err;
    }
  };

  const handleBuyClick = () => {
    setShowCheckout(true);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Amazing Product</h1>
      <Card className="max-w-4xl mx-auto">
        <div className="md:flex">
          <div className="md:w-1/2">
            <Image
              src="/mrgray.jpg"
              alt="Mr. Gray"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="text-3xl font-bold">Photo of Mr. Gray</CardTitle>
                  <Badge variant="secondary" className="text-sm font-semibold">New</Badge>
                </div>
                <CardDescription className="text-lg font-medium">
                  Get a photo of this amazing cat!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 fill-current text-yellow-500" />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground font-medium">(128 reviews)</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {['Cute', 'Nasty', 'Smart!'].map((feature, index) => (
                    <li key={index} className="flex items-center font-semibold">
                      <CheckIcon className="w-4 h-4 mr-2 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>
            <CardFooter className="flex justify-between items-center">
              <div className="text-3xl font-bold">$50</div>
              <Button size="lg" className="font-semibold" onClick={handleBuyClick}>Buy Now</Button>
            </CardFooter>
          </div>
        </div>
      </Card>

      {error && <p className="text-red-500 mt-4 mb-4">{error}</p>}

      {showCheckout && (
        <div id="checkout" className="mt-8 max-w-4xl mx-auto">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      )}
    </div>
  )
}
