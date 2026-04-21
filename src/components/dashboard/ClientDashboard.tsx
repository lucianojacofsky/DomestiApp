import React, { useState, useEffect } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ServiceRequest, Transaction } from '../../types';
import { toast } from 'sonner';
import { Plus, ListFilter, CreditCard, User as UserIcon, MessageSquare, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function ClientDashboard() {
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // New Service Form
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    category: 'Limpieza',
    price: ''
  });

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, 'services'), where('clientId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceRequest));
      setServices(data.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
      setLoading(false);
    });

    const tq = query(collection(db, 'transactions'), where('clientId', '==', auth.currentUser.uid));
    const tUnsubscribe = onSnapshot(tq, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(data);
    });

    return () => {
      unsubscribe();
      tUnsubscribe();
    };
  }, []);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, 'services'), {
        ...newService,
        price: Number(newService.price),
        clientId: auth.currentUser.uid,
        status: 'pending',
        images: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Solicitud creada con éxito');
      setNewService({ title: '', description: '', category: 'Limpieza', price: '' });
    } catch (error: any) {
      toast.error('Error al crear solicitud: ' + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Pendiente</Badge>;
      case 'assigned': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Asignado</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completado</Badge>;
      case 'cancelled': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelado</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Dashboard</h1>
          <p className="text-slate-500 text-lg">Gestiona tus solicitudes de servicios domésticos.</p>
        </div>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-slate-100 rounded-xl">
          <TabsTrigger value="requests" className="py-3 rounded-lg flex items-center gap-2">
            <ListFilter className="w-4 h-4" />
            <span className="hidden sm:inline">Mis Solicitudes</span>
          </TabsTrigger>
          <TabsTrigger value="new" className="py-3 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Solicitud</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="py-3 rounded-lg flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Transacciones</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="py-3 rounded-lg flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-6 space-y-4">
          {services.length === 0 ? (
            <Card className="border-dashed border-2 bg-slate-50/50">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold">No tienes solicitudes aún</h3>
                <p className="text-slate-500 max-w-xs mt-2">Crea tu primera solicitud para empezar a recibir ofertas de profesionales.</p>
                <Button variant="outline" className="mt-6" onClick={() => document.querySelector('[value="new"]')?.dispatchEvent(new MouseEvent('click', {bubbles: true}))}>
                  Crear solicitud
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription>{service.category}</CardDescription>
                    </div>
                    {getStatusBadge(service.status)}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="text-lg font-bold text-primary">
                        ${service.price.toLocaleString()}
                      </div>
                      <Link to={`/service/${service.id}`}>
                        <Button variant="secondary" size="sm">Ver Detalles</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Nueva Solicitud de Servicio</CardTitle>
              <CardDescription>Describe lo que necesitas y los profesionales podrán postularse.</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateService}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del servicio</Label>
                  <Input 
                    id="title" 
                    placeholder="Ej: Limpieza profunda de departamento 2 ambientes" 
                    required 
                    value={newService.title}
                    onChange={(e) => setNewService({...newService, title: e.target.value})}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={newService.category} onValueChange={(v) => setNewService({...newService, category: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Limpieza', 'Plomería', 'Electricidad', 'Jardinería', 'Pintura', 'Carpintería', 'Mudanzas', 'Reparaciones'].map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Presupuesto estimado ($)</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      placeholder="5000" 
                      required 
                      value={newService.price}
                      onChange={(e) => setNewService({...newService, price: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción detallada</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe las tareas, el tamaño del lugar, si necesitas materiales, etc." 
                    className="min-h-[150px]"
                    required
                    value={newService.description}
                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                  />
                </div>
              </CardContent>
              <CardHeader className="pt-0">
                <Button type="submit" className="w-full py-6 text-lg">Publicar Solicitud</Button>
              </CardHeader>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Transacciones</CardTitle>
              <CardDescription>Tus pagos realizados y estados de facturación.</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-10 text-slate-500">No hay transacciones registradas.</div>
              ) : (
                <div className="space-y-4">
                  {transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Pago de Servicio</p>
                          <p className="text-xs text-slate-500">{t.createdAt?.toDate ? format(t.createdAt.toDate(), 'dd/MM/yyyy HH:mm') : 'Reciente'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${t.amount.toLocaleString()}</p>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completado</Badge>
                      </div>
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
              <CardTitle>Mi Perfil</CardTitle>
              <CardDescription>Gestiona tu información personal y preferencias.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-slate-400">
                  {auth.currentUser?.displayName?.charAt(0) || auth.currentUser?.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{auth.currentUser?.displayName || 'Usuario'}</h3>
                  <p className="text-slate-500">{auth.currentUser?.email}</p>
                  <Badge className="mt-2">Cliente</Badge>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <Input placeholder="+54 11 1234-5678" />
                </div>
                <div className="space-y-2">
                  <Label>Ubicación</Label>
                  <Input placeholder="Buenos Aires, Argentina" />
                </div>
              </div>
              <Button className="w-full">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
