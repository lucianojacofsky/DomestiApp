export type UserRole = 'client' | 'professional' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  photoURL?: string;
  phone?: string;
  location?: string;
  professionalInfo?: {
    bio: string;
    specialties: string[];
    rating: number;
  };
}

export type ServiceStatus = 'pending' | 'assigned' | 'completed' | 'cancelled';

export interface ServiceRequest {
  id: string;
  clientId: string;
  professionalId?: string;
  title: string;
  description: string;
  status: ServiceStatus;
  price: number;
  category: string;
  images: string[];
  createdAt: any;
  updatedAt: any;
}

export interface ChatRoom {
  id: string;
  serviceId: string;
  participants: string[];
  lastMessage?: string;
  updatedAt: any;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: any;
}

export interface Transaction {
  id: string;
  serviceId: string;
  clientId: string;
  professionalId?: string;
  amount: number;
  status: 'pending' | 'completed';
  provider: 'mercadopago' | 'simulated';
  createdAt: any;
}

export interface Review {
  id: string;
  serviceId: string;
  clientId: string;
  professionalId: string;
  rating: number;
  comment: string;
  clientName: string;
  createdAt: any;
}
