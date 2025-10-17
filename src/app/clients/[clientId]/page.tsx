"use client"

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Phone, Mail, Star, Zap } from 'lucide-react';

type DesignItem = {
  id: number;
  appointment: string;
  image: string;
};

type PortfolioItem = {
  id: number;
  title: string;
  image: string;
  style: string;
};

type CarouselProps = {
  items: DesignItem[] | PortfolioItem[];
  index: number;
  onNext: () => void;
  onPrev: () => void;
  isDesigns: boolean;
};

const DataClient = () => {
  // Mock user data
  const user = {
    name: "Carlos Mendoza",
    title: "Tatuador Premium",
    joinDate: "2021-03-15",
    avatar: "CM",
    rating: 4.9,
    reviewCount: 128,
    phone: "+57 300 123 4567",
    email: "carlos@tattoostudio.co",
    location: "Medellín, Antioquia",
    experience: "12 años",
    bio: "Especialista en tatuajes realistas y tribales. Cada línea cuenta una historia.",
  };

  const appointmentHistory = [
    {
      id: 1,
      clientName: "Juan Pérez",
      date: "2024-10-15",
      time: "14:30",
      design: "Águila",
      status: "COMPLETED",
      price: 450000,
      deposit: 150000,
    },
    {
      id: 2,
      clientName: "María García",
      date: "2024-10-08",
      time: "10:00",
      design: "Rosa Roja",
      status: "COMPLETED",
      price: 300000,
      deposit: 100000,
    },
    {
      id: 3,
      clientName: "Roberto López",
      date: "2024-09-30",
      time: "16:00",
      design: "Serpiente",
      status: "COMPLETED",
      price: 550000,
      deposit: 200000,
    },
  ];

  const designCarousel = [
    {
      id: 1,
      appointment: "Águila - Juan Pérez",
      image: "https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=500&h=500&fit=crop",
    },
    {
      id: 2,
      appointment: "Rosa Roja - María García",
      image: "https://images.unsplash.com/photo-1583220694380-b86b27bde660?w=500&h=500&fit=crop",
    },
    {
      id: 3,
      appointment: "Serpiente - Roberto López",
      image: "https://images.unsplash.com/photo-1618095440313-b961ff40f1e5?w=500&h=500&fit=crop",
    },
  ];

  const tattooPortfolio = [
    {
      id: 1,
      title: "Phoenix en Llamas",
      image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500&h=500&fit=crop",
      style: "Realista",
    },
    {
      id: 2,
      title: "Dragón Oriental",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop",
      style: "Tribal",
    },
    {
      id: 3,
      title: "Mandala Geometría",
      image: "https://images.unsplash.com/photo-1524634126442-357e0eac6dea?w=500&h=500&fit=crop",
      style: "Mandala",
    },
    {
      id: 4,
      title: "Lobo Naturalista",
      image: "https://images.unsplash.com/photo-1565446666747-19f4bcc1bafe?w=500&h=500&fit=crop",
      style: "Realista",
    },
  ];

  const [designIndex, setDesignIndex] = useState(0);
  const [portfolioIndex, setPortfolioIndex] = useState(0);

  const nextDesign = () => {
    setDesignIndex((prev) => (prev + 1) % designCarousel.length);
  };

  const prevDesign = () => {
    setDesignIndex((prev) => (prev - 1 + designCarousel.length) % designCarousel.length);
  };

  const nextPortfolio = () => {
    setPortfolioIndex((prev) => (prev + 1) % tattooPortfolio.length);
  };

  const prevPortfolio = () => {
    setPortfolioIndex((prev) => (prev - 1 + tattooPortfolio.length) % tattooPortfolio.length);
  };

  const Carousel: React.FC<CarouselProps> = ({ items, index, onNext, onPrev, isDesigns }) => (
    <div className="relative">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <img
          src={items[index].image}
          alt={isDesigns ? (items[index] as DesignItem).appointment : (items[index] as PortfolioItem).title}
          className="w-full aspect-square object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="w-full p-4">
            <p className="text-white font-semibold text-sm">
              {isDesigns ? (items[index] as DesignItem).appointment : (items[index] as PortfolioItem).title}
            </p>
            {!isDesigns && (
              <p className="text-white/80 text-xs mt-1">{(items[index] as PortfolioItem).style}</p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={onPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-all"
      >
        <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-white" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-all"
      >
        <ChevronRight className="w-5 h-5 text-gray-900 dark:text-white" />
      </button>

      <div className="flex items-center justify-center gap-2 mt-3">
        {items.map((_, i: number) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === index
                ? "bg-gray-900 dark:bg-white w-6"
                : "bg-gray-300 dark:bg-gray-600 w-1.5"
              }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* User Profile Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0">
            {user.avatar}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {user.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {user.location}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-center">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Experiencia</p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{user.experience}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Reseñas</p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{user.reviewCount}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-500">Desde</p>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {new Date(user.joinDate).toLocaleDateString('es-CO', { year: 'numeric' })}
              </p>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-gray-500 dark:text-gray-500">Estado</p>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 text-sm">Activo</p>
            </div>
          </div>
        </div>

        {/* Carousels Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 mt-6">
          {/* Designs Carousel */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              Diseños de Citas
            </h2>
            <Carousel
              items={designCarousel}
              index={designIndex}
              onNext={nextDesign}
              onPrev={prevDesign}
              isDesigns={true}
            />
          </div>

          {/* Portfolio Carousel */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              Portafolio de Tatuajes
            </h2>
            <Carousel
              items={tattooPortfolio}
              index={portfolioIndex}
              onNext={nextPortfolio}
              onPrev={prevPortfolio}
              isDesigns={false}
            />
          </div>
        </div>

        {/* Appointment History */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            Historial de Citas
          </h2>

          <div className="space-y-3">
            {appointmentHistory.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {appointment.clientName}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        Completada
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {appointment.design}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                      <span>{appointment.date}</span>
                      <span>•</span>
                      <span>{appointment.time}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:text-right gap-1">
                    <p className="font-bold text-gray-900 dark:text-white">
                      ${(appointment.price / 1000).toFixed(0)}k
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      ${(appointment.deposit / 1000).toFixed(0)}k depósito
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataClient;