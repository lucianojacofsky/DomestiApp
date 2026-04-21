import React, { useState, useEffect } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, serverTimestamp, or, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { ServiceRequest, Transaction, Review, UserProfile } from '../../types';
import { toast } from 'sonner';
import { Briefcase, ListFilter, CreditCard, User as UserIcon, Clock, CheckCircle2, MapPin, DollarSign, Star } from 'lucide-react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function ProfessionalDashboard() {
  const [availableServices, setAvailableServices] = useState<ServiceRequest[]>([]);
  const [myServices, setMyServices] = useState<ServiceRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Profile info
    const unsubProfile = onSnapshot(doc(db, 'users', auth.currentUser.uid), (snapshot) => {
      if (snapshot.exists()) setProfile(snapshot.id ? { uid: snapshot.id, ...snapshot.data() } as UserProfile : null);
    });

    // Available services (pending)
    const qAvailable = query(collection(db, 'services'), where('status', '==', 'pending'));
    const unsubAvailable = onSnapshot(qAvailable, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceRequest));
      setAvailableServices(data);
    });

    // My services (assigned to me)
    const qMy = query(collection(db, 'services'), where('professionalId', '==', auth.currentUser.uid));
    const unsubMy = onSnapshot(qMy, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceRequest));
      setMyServices(data);
      setLoading(false);
    });

    // My transactions
    const qTrans = query(collection(db, 'transactions'), where('professionalId', '==', auth.currentUser.uid));
    const unsubTrans = onSnapshot(qTrans, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(data);
    });

    // My reviews
    const qReviews = query(collection(db, 'reviews'), where('professionalId', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'));
    const unsubReviews = onSnapshot(qReviews, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
      setReviews(data);
    });

    return () => {
      unsubProfile();
      unsubAvailable();
      unsubMy();
      unsubTrans();
      unsubReviews();
    };
  }, []);

  const handleAcceptService = async (serviceId: string) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, 'services', serviceId), {
        professionalId: auth.currentUser.uid,
        status: 'assigned',
        updatedAt: serverTimestamp()
      });
      toast.success('Trabajo aceptado con éxito');
    } catch (error: any) {
      toast.error('Error al aceptar trabajo: ' + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Disponible</Badge>;
      case 'assigned': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En Progreso</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completado</Badge>;
      case 'cancelled': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel Profesional</h1>
        <p className="text-slate-500 text-lg">Encuentra trabajos y gestiona tus servicios asignados.</p>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-slate-100 rounded-xl">
          <TabsTrigger value="available" className="py-3 rounded-lg flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">Disponibles</span>
          </TabsTrigger>
          <TabsTrigger value="my-jobs" className="py-3 rounded-lg flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Mis Trabajos</span>
          </TabsTrigger>
          <TabsTrigger value="earnings" className="py-3 rounded-lg flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Ganancias</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="py-3 rounded-lg flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span className="hidden sm:inline">Reseñas</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="py-3 rounded-lg flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6 space-y-4">
          {availableServices.length === 0 ? (
            <Card className="border-dashed border-2 bg-slate-50/50">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold">No hay trabajos disponibles</h3>
                <p className="text-slate-500 max-w-xs mt-2">Vuelve más tarde para ver nuevas solicitudes en tu zona.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {availableServices.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription>{service.category}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold">
                      ${service.price.toLocaleString()}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600 line-clamp-3">{service.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>Ubicación pendiente</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{service.createdAt?.toDate ? format(service.createdAt.toDate(), 'dd/MM/yyyy') : 'Hoy'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-slate-100">
                      <Button className="flex-1" onClick={() => handleAcceptService(service.id)}>Aceptar Trabajo</Button>
                      <Link to={`/service/${service.id}`}>
                        <Button variant="outline">Detalles</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-jobs" className="mt-6 space-y-4">
          {myServices.length === 0 ? (
            <div className="text-center py-20 text-slate-500">No tienes trabajos asignados actualmente.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {myServices.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription>{service.category}</CardDescription>
                    </div>
                    {getStatusBadge(service.status)}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="text-lg font-bold text-primary">
                        ${service.price.toLocaleString()}
                      </div>
                      <Link to={`/service/${service.id}`}>
                        <Button variant="secondary" size="sm">Ir al Servicio</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="earnings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Ganancias</CardTitle>
              <CardDescription>Historial de cobros por servicios completados.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-6 bg-slate-50 rounded-2xl">
                  <p className="text-sm text-slate-500 font-medium">Total Ganado</p>
                  <p className="text-3xl font-bold text-primary mt-1">
                    ${transactions.reduce((acc, t) => acc + t.amount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl">
                  <p className="text-sm text-slate-500 font-medium">Trabajos Pagados</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{transactions.length}</p>
                </div>
              </div>
              <div className="space-y-4">
                {transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Cobro de Servicio</p>
                      <p className="text-xs text-slate-500">{t.createdAt?.toDate ? format(t.createdAt.toDate(), 'dd/MM/yyyy') : 'Reciente'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">+${t.amount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Mis Reseñas</CardTitle>
              <CardDescription>Lo que dicen tus clientes sobre tu trabajo.</CardDescription>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <div className="text-center py-10 text-slate-500">Aún no has recibido reseñas.</div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 border rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-slate-900">{rev.clientName}</p>
                        <div className="flex gap-1 text-yellow-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-4 h-4 ${rev.rating >= s ? 'fill-current' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                      <p className="text-[10px] text-slate-400">
                        {rev.createdAt?.toDate ? format(rev.createdAt.toDate(), 'dd/MM/yyyy') : 'Reciente'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Perfil Profesional</CardTitle>
              <CardDescription>Esta información será visible para tus clientes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-3xl font-bold text-primary">
                  {auth.currentUser?.displayName?.charAt(0) || auth.currentUser?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{auth.currentUser?.displayName || profile?.name || 'Profesional'}</h3>
                  <p className="text-slate-500">{auth.currentUser?.email}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold">{profile?.professionalInfo?.rating || 'S/Q'}</span>
                    <span className="text-slate-400 text-sm">({reviews.length} reseñas)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Bio / Presentación</Label>
                  <Textarea defaultValue={profile?.professionalInfo?.bio} placeholder="Cuéntale a tus clientes sobre tu experiencia y servicios..." className="min-h-[100px]" />
                </div>
                <div className="space-y-2">
                  <Label>Especialidades (separadas por coma)</Label>
                  <Input defaultValue={profile?.professionalInfo?.specialties?.join(', ')} placeholder="Plomería, Gasista, Reparaciones generales" />
                </div>
              </div>
              <Button className="w-full">Actualizar Perfil</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
