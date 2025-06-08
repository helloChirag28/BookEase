'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  Users,
  DollarSign,
  CheckCircle,
  Bot
} from 'lucide-react';
import Link from 'next/link';
import { format, addDays, isSameDay } from 'date-fns';
import { toast } from 'sonner';
import { AIAssistant } from '@/components/booking/ai-assistant';

const services = [
  { id: 1, name: 'Haircut & Styling', duration: 60, price: 45, category: 'Hair Salon' },
  { id: 2, name: 'Hair Coloring', duration: 120, price: 85, category: 'Hair Salon' },
  { id: 3, name: 'Personal Training', duration: 60, price: 65, category: 'Fitness' },
  { id: 4, name: 'Group Fitness Class', duration: 45, price: 25, category: 'Fitness' },
  { id: 5, name: 'Swedish Massage', duration: 90, price: 90, category: 'Spa' },
  { id: 6, name: 'Deep Tissue Massage', duration: 60, price: 80, category: 'Spa' },
  { id: 7, name: 'Yoga Class', duration: 75, price: 30, category: 'Wellness' },
  { id: 8, name: 'Meditation Session', duration: 45, price: 35, category: 'Wellness' }
];

const generateTimeSlots = (date: Date) => {
  const slots = [];
  const start = 9; // 9 AM
  const end = 18; // 6 PM
  
  for (let hour = start; hour < end; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const isAvailable = Math.random() > 0.3; // 70% availability simulation
      slots.push({
        time,
        available: isAvailable,
        popular: Math.random() > 0.7
      });
    }
  }
  
  return slots;
};

type BookingStep = 'service' | 'datetime' | 'details' | 'payment' | 'confirmation';

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('service');
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots(selectedDate));
    }
  }, [selectedDate]);

  const nextStep = () => {
    const steps: BookingStep[] = ['service', 'datetime', 'details', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: BookingStep[] = ['service', 'datetime', 'details', 'payment', 'confirmation'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleBooking = () => {
    // Simulate payment processing
    toast.success('Payment processed successfully!');
    nextStep();
  };

  const handleAISuggestion = (suggestion: { time: string; reason: string }) => {
    setSelectedTime(suggestion.time);
    setShowAIAssistant(false);
    toast.success(`AI suggested ${suggestion.time} - ${suggestion.reason}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BookEase
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Step {['service', 'datetime', 'details', 'payment', 'confirmation'].indexOf(currentStep) + 1} of 5
            </Badge>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {['Service', 'Date & Time', 'Details', 'Payment', 'Confirmation'].map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center ${
                    index <= ['service', 'datetime', 'details', 'payment', 'confirmation'].indexOf(currentStep)
                      ? 'text-blue-600'
                      : 'text-slate-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                      index <= ['service', 'datetime', 'details', 'payment', 'confirmation'].indexOf(currentStep)
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white text-slate-400'
                    }`}
                  >
                    {index < ['service', 'datetime', 'details', 'payment', 'confirmation'].indexOf(currentStep) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="ml-2 text-sm font-medium hidden sm:block">{step}</span>
                </div>
              ))}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${((['service', 'datetime', 'details', 'payment', 'confirmation'].indexOf(currentStep) + 1) / 5) * 100}%`
                }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Service Selection */}
            {currentStep === 'service' && (
              <motion.div
                key="service"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Choose Your Service</CardTitle>
                    <CardDescription>
                      Select the service you'd like to book
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <motion.div
                          key={service.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer border-2 transition-all duration-200 ${
                              selectedService?.id === service.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-slate-200 hover:border-blue-300'
                            }`}
                            onClick={() => setSelectedService(service)}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">{service.name}</CardTitle>
                                <Badge variant="secondary">{service.category}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center text-slate-600">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {service.duration} min
                                </div>
                                <div className="flex items-center font-semibold">
                                  <DollarSign className="w-4 h-4" />
                                  {service.price}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={nextStep}
                        disabled={!selectedService}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Date & Time Selection */}
            {currentStep === 'datetime' && (
              <motion.div
                key="datetime"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Select Date & Time</CardTitle>
                    <CardDescription>
                      Choose your preferred appointment slot
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Calendar */}
                      <div>
                        <h3 className="font-semibold mb-4">Select Date</h3>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                          className="rounded-lg border shadow-sm"
                        />
                      </div>

                      {/* Time Slots */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">Available Times</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAIAssistant(true)}
                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                          >
                            <Bot className="w-4 h-4 mr-2" />
                            AI Suggest
                          </Button>
                        </div>
                        
                        {selectedDate && (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {timeSlots.map((slot) => (
                              <Button
                                key={slot.time}
                                variant={selectedTime === slot.time ? "default" : "outline"}
                                className={`w-full justify-between ${
                                  !slot.available
                                    ? 'opacity-50 cursor-not-allowed'
                                    : selectedTime === slot.time
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                                    : slot.popular
                                    ? 'border-yellow-300 bg-yellow-50'
                                    : ''
                                }`}
                                onClick={() => slot.available && setSelectedTime(slot.time)}
                                disabled={!slot.available}
                              >
                                <span>{slot.time}</span>
                                <div className="flex items-center space-x-2">
                                  {slot.popular && (
                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                                      Popular
                                    </Badge>
                                  )}
                                  {!slot.available && (
                                    <Badge variant="destructive" className="text-xs">
                                      Booked
                                    </Badge>
                                  )}
                                </div>
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={prevStep}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={nextStep}
                        disabled={!selectedDate || !selectedTime}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Booking Details */}
            {currentStep === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Your Details</CardTitle>
                    <CardDescription>
                      Please provide your contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={bookingDetails.name}
                            onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                            placeholder="John Doe"
                            className="mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={bookingDetails.email}
                            onChange={(e) => setBookingDetails({ ...bookingDetails, email: e.target.value })}
                            placeholder="john@example.com"
                            className="mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={bookingDetails.phone}
                            onChange={(e) => setBookingDetails({ ...bookingDetails, phone: e.target.value })}
                            placeholder="+1 (555) 123-4567"
                            className="mt-2"
                          />
                        </div>
                      </div>
                      
                      {/* Booking Summary */}
                      <div className="bg-slate-50 p-6 rounded-lg">
                        <h3 className="font-semibold mb-4">Booking Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Service:</span>
                            <span className="font-medium">{selectedService?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Date:</span>
                            <span className="font-medium">
                              {selectedDate && format(selectedDate, 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Time:</span>
                            <span className="font-medium">{selectedTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Duration:</span>
                            <span className="font-medium">{selectedService?.duration} min</span>
                          </div>
                          <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                            <span>Total:</span>
                            <span>${selectedService?.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={prevStep}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={nextStep}
                        disabled={!bookingDetails.name || !bookingDetails.email || !bookingDetails.phone}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Continue to Payment
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Payment */}
            {currentStep === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Payment</CardTitle>
                    <CardDescription>
                      Complete your booking with secure payment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Payment Form */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="card">Card Number</Label>
                          <Input
                            id="card"
                            placeholder="1234 5678 9012 3456"
                            className="mt-2"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              className="mt-2"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="cardholder">Cardholder Name</Label>
                          <Input
                            id="cardholder"
                            placeholder="John Doe"
                            className="mt-2"
                          />
                        </div>
                      </div>
                      
                      {/* Final Summary */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-100">
                        <h3 className="font-semibold mb-4 text-blue-900">Final Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Service:</span>
                            <span className="font-medium">{selectedService?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Date:</span>
                            <span className="font-medium">
                              {selectedDate && format(selectedDate, 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Time:</span>
                            <span className="font-medium">{selectedTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Customer:</span>
                            <span className="font-medium">{bookingDetails.name}</span>
                          </div>
                          <div className="border-t pt-3 flex justify-between text-xl font-bold text-blue-900">
                            <span>Total:</span>
                            <span>${selectedService?.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <Button variant="outline" onClick={prevStep}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={handleBooking}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Complete Booking
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Confirmation */}
            {currentStep === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-lg text-center">
                  <CardContent className="pt-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </motion.div>
                    
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                      Booking Confirmed!
                    </h2>
                    
                    <p className="text-lg text-slate-600 mb-8">
                      Your appointment has been successfully booked. You'll receive a confirmation email shortly.
                    </p>
                    
                    <div className="bg-slate-50 p-6 rounded-lg mb-8 text-left max-w-md mx-auto">
                      <h3 className="font-semibold mb-4">Booking Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Booking ID:</span>
                          <span className="font-mono text-sm">BE-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Service:</span>
                          <span className="font-medium">{selectedService?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Date & Time:</span>
                          <span className="font-medium">
                            {selectedDate && format(selectedDate, 'MMM dd')} at {selectedTime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Amount Paid:</span>
                          <span className="font-medium">${selectedService?.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/booking">
                        <Button variant="outline">
                          Book Another Service
                        </Button>
                      </Link>
                      <Link href="/">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          Back to Home
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <Dialog open={showAIAssistant} onOpenChange={setShowAIAssistant}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
              AI Time Suggestions
            </DialogTitle>
            <DialogDescription>
              Let our AI help you find the perfect time slot based on your preferences.
            </DialogDescription>
          </DialogHeader>
          <AIAssistant
            availableSlots={timeSlots.filter(slot => slot.available)}
            onSuggestion={handleAISuggestion}
            selectedDate={selectedDate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}