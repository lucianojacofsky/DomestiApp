import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { doc, onSnapshot, updateDoc, collection, query, where, addDoc, serverTimestamp, orderBy, getDoc, getDocs } from 'firebase/firestore';
import { ServiceRequest, ChatMessage, UserProfile, Review } from '../types';
import { useAuth } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { MessageSquare, Send, CreditCard, CheckCircle2, Clock, User as UserIcon, ArrowLeft, Star } from 'lucide-react';
import { format } from 'date-fns';

export default function ServiceDetails() {
  const { id } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceRequest | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    const unsubService = onSnapshot(doc(db, 'services', id), async (snapshot) => {
      if (snapshot.exists()) {
        const data = { id: snapshot.id, ...snapshot.data() } as ServiceRequest;
        setService(data);

        // Fetch other user info
        const otherId = profile?.role === 'client' ? data.professionalId : data.clientId;
        if (otherId) {
          const uDoc = await getDoc(doc(db, 'users', otherId));
          if (uDoc.exists()) setOtherUser(uDoc.data() as UserProfile);
        }

        // Check for review
        const q = query(collection(db, 'reviews'), where('serviceId', '==', id));
        const reviewSnap = await getDocs(q);
        if (!reviewSnap.empty) {
          setReview({ id: reviewSnap.docs[0].id, ...reviewSnap.docs[0].data() } as Review);
        }
      }
      setLoading(false);
    });

    // Chat logic
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', id),
      orderBy('createdAt', 'asc')
    );
    const unsubMessages = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage)));
    });

    return () => {
      unsubService();
      unsubMessages();
    };
  }, [id, profile]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !id || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'messages'), {
        chatId: id,
        senderId: auth.currentUser.uid,
        text: newMessage,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (error: any) {
      toast.error('Error al enviar mensaje');
    }
  };

  const handleCompleteService = async () => {
    if (!id) return;
    try {
      await updateDoc(doc(db, 'services', id), {
        status: 'completed',
        updatedAt: serverTimestamp()
      });
      toast.success('Servicio marcado como completado');
    } catch (error: any) {
      toast.error('Error al actualizar estado');
    }
  };

  const handlePayment = async () => {
    if (!service) return;
    
    try {
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: service.title,
          price: service.price,
          quantity: 1,
          serviceId: service.id
        })
      });

      const data = await response.json();

      if (data.id) {
        // In a real app, redirect to MP
        // window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.id}`;
        
        // Simulated success for demo
        await addDoc(collection(db, 'transactions'), {
          serviceId: service.id,
          clientId: service.clientId,
          professionalId: service.professionalId,
          amount: service.price,
          status: 'completed',
          provider: 'mercadopago',
          createdAt: serverTimestamp()
        });
        toast.success('Pago procesado con éxito (Simulado)');
      } else {
        // Fallback simulated payment
        await addDoc(collection(db, 'transactions'), {
          serviceId: service.id,
          clientId: service.clientId,
          professionalId: service.professionalId,
          amount: service.price,
          status: 'completed',
          provider: 'simulated',
          createdAt: serverTimestamp()
        });
        toast.success('Pago simulado completado');
      }
    } catch (error) {
      toast.error('Error al procesar el pago');
    }
  };

  const handleSubmitReview = async () => {
    if (!service || !profile || !id) return;
    setIsSubmittingReview(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        serviceId: id,
        clientId: profile.uid,
        professionalId: service.professionalId,
        rating,
        comment,
        clientName: profile.name,
        createdAt: serverTimestamp()
      });

      // Update professional's rating (simplified)
      // In a real app, this should be a cloud function to ensure consistency
      if (service.professionalId) {
        const profRef = doc(db, 'users', service.professionalId);
        const profDoc = await getDoc(profRef);
        if (profDoc.exists()) {
          const profData = profDoc.data() as UserProfile;
          const currentRating = profData.professionalInfo?.rating || 5;
          // Very simple average logic for demo
          const newRating = (currentRating + rating) / 2;
          await updateDoc(profRef, {
            'professionalInfo.rating': Number(newRating.toFixed(1))
          });
        }
      }

      toast.success('¡Gracias por tu reseña!');
      setComment('');
    } catch (error) {
      toast.error('Error al enviar la reseña');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) return <div className="py-20 text-center">Cargando...</div>;
  if (!service) return <div className="py-20 text-center">Servicio no encontrado</div>;

  const isAssigned = service.status === 'assigned';
  const isCompleted = service.status === 'completed';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Dashboard
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Service Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline">{service.category}</Badge>
                <Badge>{service.status}</Badge>
              </div>
              <CardTitle className="text-2xl">{service.title}</CardTitle>
              <CardDescription>
                Publicado el {service.createdAt?.toDate ? format(service.createdAt.toDate(), 'dd/MM/yyyy') : 'Reciente'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-primary">
                ${service.price.toLocaleString()}
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-500">Descripción</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
              </div>
              
              {otherUser && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-slate-500">
                      {profile?.role === 'client' ? 'Profesional Asignado' : 'Cliente'}
                    </h4>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border">
                        <UserIcon className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{otherUser.name}</p>
                        <p className="text-xs text-slate-500">{otherUser.email}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 space-y-2">
                {profile?.role === 'professional' && isAssigned && (
                  <Button className="w-full" onClick={handleCompleteService}>
                    Marcar como Completado
                  </Button>
                )}
                {profile?.role === 'client' && isCompleted && (
                  <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handlePayment}>
                    <CreditCard className="w-4 h-4 mr-2" /> Pagar Servicio
                  </Button>
                )}
              </div>

              {profile?.role === 'client' && isCompleted && !review && (
                <div className="pt-6 border-t space-y-4">
                  <h4 className="font-bold text-slate-900">Califica al profesional</h4>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => setRating(s)}
                        className={`p-1 transition-colors ${rating >= s ? 'text-yellow-400' : 'text-slate-200'}`}
                      >
                        <Star className={`w-6 h-6 ${rating >= s ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                  <Input
                    placeholder="Escribe un comentario opcional..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="text-sm"
                  />
                  <Button 
                    className="w-full" 
                    variant="outline" 
                    onClick={handleSubmitReview}
                    disabled={isSubmittingReview}
                  >
                    Enviar Reseña
                  </Button>
                </div>
              )}

              {review && (
                <div className="pt-6 border-t space-y-2">
                  <h4 className="font-bold text-slate-900">Tu Reseña</h4>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-4 h-4 ${review.rating >= s ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 italic">"{review.comment}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Chat */}
        <div className="md:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b py-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Chat del Servicio</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
              {!isAssigned && !isCompleted ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
                  <Clock className="w-12 h-12 mb-4 opacity-20" />
                  <p>El chat se habilitará una vez que un profesional acepte el trabajo.</p>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => {
                        const isMe = msg.senderId === auth.currentUser?.uid;
                        return (
                          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                              isMe ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-slate-100 text-slate-900 rounded-tl-none'
                            }`}>
                              <p>{msg.text}</p>
                              <p className={`text-[10px] mt-1 opacity-70 ${isMe ? 'text-right' : 'text-left'}`}>
                                {msg.createdAt?.toDate ? format(msg.createdAt.toDate(), 'HH:mm') : ''}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={scrollRef} />
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input 
                        placeholder="Escribe un mensaje..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" size="icon">
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
