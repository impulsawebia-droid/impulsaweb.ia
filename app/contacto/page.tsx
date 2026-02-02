"use client";

import React from "react"

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from "lucide-react";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Contactanos
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Cuentanos sobre tu proyecto y te responderemos en menos de 24
                horas.
              </p>
            </div>

            <div className="mt-16 grid gap-12 lg:grid-cols-5">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Informacion de Contacto
                  </h2>
                  <div className="space-y-4">
                    <a
                      href="mailto:hola@impulsaweb.co"
                      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground">
                          hola@impulsaweb.co
                        </p>
                      </div>
                    </a>

                    <a
                      href="tel:+573001234567"
                      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Telefono</p>
                        <p className="font-medium text-foreground">
                          +57 300 123 4567
                        </p>
                      </div>
                    </a>

                    <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ubicacion</p>
                        <p className="font-medium text-foreground">
                          Bogota, Colombia
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Horario</p>
                        <p className="font-medium text-foreground">
                          Lun - Vie: 8am - 6pm
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-accent/10 border border-accent/20">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-accent" />
                    Respuesta Rapida
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Para una respuesta mas rapida, escribenos por WhatsApp.
                    Respondemos en minutos!
                  </p>
                  <a
                    href="https://wa.me/573001234567?text=Hola!%20Me%20interesa%20una%20pagina%20web%20para%20mi%20negocio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block"
                  >
                    <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                      <MessageCircle className="h-4 w-4" />
                      Escribir por WhatsApp
                    </Button>
                  </a>
                </div>
              </div>

              <Card className="lg:col-span-3">
                <CardContent className="p-8">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <Send className="h-8 w-8" />
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-foreground">
                        Mensaje Enviado!
                      </h3>
                      <p className="mt-2 text-muted-foreground">
                        Gracias por contactarnos. Te responderemos en menos de 24
                        horas.
                      </p>
                      <Button
                        className="mt-6 bg-transparent"
                        variant="outline"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            service: "",
                            message: "",
                          });
                        }}
                      >
                        Enviar otro mensaje
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre completo</Label>
                          <Input
                            id="name"
                            placeholder="Tu nombre"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefono / WhatsApp</Label>
                          <Input
                            id="phone"
                            placeholder="+57 300 000 0000"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="service">Servicio de interes</Label>
                          <Select
                            value={formData.service}
                            onValueChange={(value) =>
                              setFormData({ ...formData, service: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un servicio" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="landing">Landing Page</SelectItem>
                              <SelectItem value="profesional">
                                Web Profesional
                              </SelectItem>
                              <SelectItem value="ecommerce">
                                Tienda Online
                              </SelectItem>
                              <SelectItem value="otro">Otro / No estoy seguro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">
                          Cuentanos sobre tu proyecto
                        </Label>
                        <Textarea
                          id="message"
                          placeholder="Describe brevemente tu negocio y que tipo de pagina web necesitas..."
                          rows={5}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
