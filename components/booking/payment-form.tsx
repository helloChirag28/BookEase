'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onBack: () => void;
  bookingDetails: {
    serviceName: string;
    date: string;
    time: string;
    customerName: string;
  };
}

export function PaymentForm({ amount, onSuccess, onBack, bookingDetails }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  useEffect(() => {
    // Create payment intent when component mounts
    createPaymentIntent();
  }, [amount]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          metadata: {
            service: bookingDetails.serviceName,
            date: bookingDetails.date,
            time: bookingDetails.time,
            customer: bookingDetails.customerName
          }
        })
      });

      if (!response.ok) throw new Error('Failed to create payment intent');

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      toast.error('Failed to initialize payment. Please try again.');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientSecret) {
      toast.error('Payment not initialized. Please refresh and try again.');
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing (replace with actual Stripe Elements integration)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would use Stripe Elements here
      // For demo purposes, we'll simulate a successful payment
      const paymentIntentId = clientSecret.split('_secret')[0];
      
      toast.success('Payment successful!');
      onSuccess(paymentIntentId);
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add space every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="grid lg:grid-cols-2 gap-8"
    >
      {/* Payment Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({
                  ...cardDetails,
                  number: formatCardNumber(e.target.value)
                })}
                maxLength={19}
                className="mt-2"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({
                    ...cardDetails,
                    expiry: formatExpiry(e.target.value)
                  })}
                  maxLength={5}
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({
                    ...cardDetails,
                    cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                  })}
                  maxLength={4}
                  className="mt-2"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({
                  ...cardDetails,
                  name: e.target.value
                })}
                className="mt-2"
                required
              />
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2 text-sm text-slate-600 mb-4">
                <Lock className="w-4 h-4" />
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={loading}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !clientSecret}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay $${amount}`
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Service:</span>
                <span className="font-medium">{bookingDetails.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Date:</span>
                <span className="font-medium">{bookingDetails.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Time:</span>
                <span className="font-medium">{bookingDetails.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Customer:</span>
                <span className="font-medium">{bookingDetails.customerName}</span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold text-blue-900">
                <span>Total:</span>
                <span>${amount}</span>
              </div>
            </div>

            <div className="bg-white/50 p-3 rounded-lg text-sm text-slate-600">
              <p className="font-medium mb-1">What's included:</p>
              <ul className="space-y-1 text-xs">
                <li>• Professional service</li>
                <li>• Free cancellation up to 24h before</li>
                <li>• Email confirmation & reminders</li>
                <li>• Customer support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}