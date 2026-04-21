import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, updateDoc, doc, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { UserProfile, ServiceRequest, Transaction } from '../../types';
import { Users, Briefcase, CreditCard, Shield, Settings, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => doc.data() as UserProfile));
    });

    const unsubServices = onSnapshot(collection(db, 'services'), (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceRequest)));
    });

    const unsubTrans = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
    });

    return () => {
      unsubUsers();
      unsubServices();
      unsubTrans();
    };
  }, []);

  const totalEarnings = transactions.reduce((acc, t) => acc + t.amount, 0);
  const platformCommission = totalEarnings * 0.15;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Panel de Control</h1>
          <p className="text-slate-500 text-lg">Supervisión operativa de DomestiApp.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-4 py-1.5 text-sm font-bold border-primary text-primary bg-primary/5">
            <Shield className="w-4 h-4 mr-2" />
            Admin Mode
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Usuarios', val: users.length, sub: `${users.filter(u => u.role === 'professional').length} profesionales`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Servicios', val: services.length, sub: `${services.filter(s => s.status === 'pending').length} pendientes`, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Volumen', val: `$${totalEarnings.toLocaleString()}`, sub: `${transactions.length} transacciones`, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Comisiones', val: `$${platformCommission.toLocaleString()}`, sub: 'Ingresos plataforma', icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardDescription className="font-medium">{stat.label}</CardDescription>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.val}</div>
              <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="users" className="rounded-lg px-6">Usuarios</TabsTrigger>
          <TabsTrigger value="services" className="rounded-lg px-6">Servicios</TabsTrigger>
          <TabsTrigger value="payouts" className="rounded-lg px-6">Finanzas</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card className="overflow-hidden border-none shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.uid} className="hover:bg-slate-50/50">
                    <TableCell className="font-semibold">{user.name}</TableCell>
                    <TableCell className="text-slate-500">{user.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.role === 'admin' ? 'destructive' : 'secondary'}
                        className="capitalize"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5">Gestionar</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <Card className="overflow-hidden border-none shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-semibold">{service.title}</TableCell>
                    <TableCell className="text-xs text-slate-500 font-mono">{service.clientId.slice(0, 8)}...</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-900">${service.price.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="mt-6">
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-lg">Reporte de Transacciones</CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto Bruto</TableHead>
                  <TableHead>Comisión (15%)</TableHead>
                  <TableHead>Neto Profesional</TableHead>
                  <TableHead className="text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id} className="hover:bg-slate-50/50">
                    <TableCell className="text-slate-500">
                      {t.createdAt?.toDate ? format(t.createdAt.toDate(), 'dd/MM/yyyy') : 'Reciente'}
                    </TableCell>
                    <TableCell className="font-medium">${t.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-orange-600 font-bold">${(t.amount * 0.15).toLocaleString()}</TableCell>
                    <TableCell className="text-emerald-600 font-bold">${(t.amount * 0.85).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Completado</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
