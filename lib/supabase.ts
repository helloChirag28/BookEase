import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  stripe_payment_intent_id?: string;
  created_at: string;
  service?: Service;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  booking_id?: string;
}

// Service functions
export const getServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('name');
  
  if (error) throw error;
  return data || [];
};

export const createService = async (service: Omit<Service, 'id' | 'created_at'>): Promise<Service> => {
  const { data, error } = await supabase
    .from('services')
    .insert([service])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Booking functions
export const getBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      service:services(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const getBookingsByDate = async (date: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_date', date)
    .neq('status', 'cancelled');
  
  if (error) throw error;
  return data || [];
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateBookingStatus = async (id: string, status: Booking['status']): Promise<void> => {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id);
  
  if (error) throw error;
};

// Time slot availability
export const getAvailableSlots = async (date: string, serviceId: string): Promise<TimeSlot[]> => {
  const bookings = await getBookingsByDate(date);
  const bookedTimes = bookings.map(booking => booking.booking_time);
  
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const isBooked = bookedTimes.includes(time);
      
      slots.push({
        time,
        available: !isBooked,
        booking_id: isBooked ? bookings.find(b => b.booking_time === time)?.id : undefined
      });
    }
  }
  
  return slots;
};

// Analytics
export const getDashboardStats = async () => {
  const today = new Date().toISOString().split('T')[0];
  
  // Today's bookings
  const { data: todayBookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('booking_date', today);
  
  // Today's revenue
  const todayRevenue = todayBookings?.reduce((sum, booking) => sum + booking.amount, 0) || 0;
  
  // Total customers (unique emails)
  const { data: allBookings } = await supabase
    .from('bookings')
    .select('customer_email');
  
  const uniqueCustomers = new Set(allBookings?.map(b => b.customer_email)).size;
  
  return {
    todayBookings: todayBookings?.length || 0,
    todayRevenue,
    totalCustomers: uniqueCustomers,
    avgRating: 4.8 // Mock rating for now
  };
};