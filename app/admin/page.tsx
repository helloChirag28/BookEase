'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar as CalendarIcon, 
  DollarSign, 
  Users, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

// Mock data
const stats = [
  { title: 'Today\'s Bookings', value: '24', change: '+12%', icon: CalendarIcon, color: 'text-blue-600' },
  { title: 'Revenue Today', value: '$1,680', change: '+8%', icon: DollarSign, color: 'text-green-600' },
  { title: 'Total Customers', value: '342', change: '+24%', icon: Users, color: 'text-purple-600' },
  { title: 'Avg. Rating', value: '4.8', change: '+0.2', icon: TrendingUp, color: 'text-yellow-600' }
];

const recentBookings = [
  { id: 'BE-001', customer: 'John Doe', service: 'Haircut & Styling', time: '10:00 AM', status: 'confirmed', amount: 45 },
  { id: 'BE-002', customer: 'Jane Smith', service: 'Personal Training', time: '2:00 PM', status: 'completed', amount: 65 },
  { id: 'BE-003', customer: 'Mike Johnson', service: 'Swedish Massage', time: '4:30 PM', status: 'pending', amount: 90 },
  { id: 'BE-004', customer: 'Sarah Wilson', service: 'Yoga Class', time: '6:00 PM', status: 'confirmed', amount: 30 },
  { id: 'BE-005', customer: 'Tom Brown', service: 'Hair Coloring', time: '11:00 AM', status: 'completed', amount: 85 }
];

const services = [
  { id: 1, name: 'Haircut & Styling', duration: 60, price: 45, category: 'Hair Salon', bookings: 156 },
  { id: 2, name: 'Hair Coloring', duration: 120, price: 85, category: 'Hair Salon', bookings: 89 },
  { id: 3, name: 'Personal Training', duration: 60, price: 65, category: 'Fitness', bookings: 234 },
  { id: 4, name: 'Group Fitness Class', duration: 45, price: 25, category: 'Fitness', bookings: 445 },
  { id: 5, name: 'Swedish Massage', duration: 90, price: 90, category: 'Spa', bookings: 178 },
  { id: 6, name: 'Deep Tissue Massage', duration: 60, price: 80, category: 'Spa', bookings: 124 }
];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAddService, setShowAddService] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple demo authentication
    if (email === 'admin@bookease.com' && password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials. Try admin@bookease.com / admin123');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Access your BookEase dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bookease.com"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Login
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-slate-600">
              <p>Demo credentials:</p>
              <p>admin@bookease.com / admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              BookEase Admin
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome back! Here&apos;s what&apos;s happening with your business today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-sm text-green-600 font-medium">{stat.change} from yesterday</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-slate-100 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border shadow-sm">
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4" />
              <span>Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Services</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Bookings
                  <Badge variant="secondary">{recentBookings.length} today</Badge>
                </CardTitle>
                <CardDescription>
                  Manage and view all customer bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                        <TableCell className="font-medium">{booking.customer}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{booking.time}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === 'completed' ? 'default' :
                              booking.status === 'confirmed' ? 'secondary' :
                              'outline'
                            }
                            className={
                              booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {booking.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {booking.status === 'confirmed' && <CalendarIcon className="w-3 h-3 mr-1" />}
                            {booking.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">${booking.amount}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <XCircle className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Services Management
                  <Dialog open={showAddService} onOpenChange={setShowAddService}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                        <DialogDescription>
                          Create a new service for your business
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="serviceName">Service Name</Label>
                          <Input id="serviceName" placeholder="e.g., Haircut & Styling" className="mt-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input id="duration" type="number" placeholder="60" className="mt-2" />
                          </div>
                          <div>
                            <Label htmlFor="price">Price ($)</Label>
                            <Input id="price" type="number" placeholder="45" className="mt-2" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Input id="category" placeholder="e.g., Hair Salon" className="mt-2" />
                        </div>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          Create Service
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
                <CardDescription>
                  Manage your service offerings and pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total Bookings</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{service.category}</Badge>
                        </TableCell>
                        <TableCell>{service.duration} min</TableCell>
                        <TableCell className="font-semibold">${service.price}</TableCell>
                        <TableCell>{service.bookings}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">Revenue chart would appear here</p>
                      <p className="text-sm text-slate-500">Integration with charting library needed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Popular Services</CardTitle>
                  <CardDescription>Top performing services this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.slice(0, 5).map((service, index) => (
                      <div key={service.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-slate-600">{service.bookings} bookings</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${service.price * service.bookings}</p>
                          <p className="text-sm text-slate-600">revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}