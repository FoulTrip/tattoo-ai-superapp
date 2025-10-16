"use client"

import { useState } from "react";
import { Star, Calendar, ChevronLeft, ChevronRight, X, Search, SlidersHorizontal, Palette, Image as ImageIcon, Compass, Mountain, Waves, Circle, Droplet, Minus, Grid3x3, Sparkles, Cog, User, Type, Feather, Flower2, Brush, Eye, Zap, Aperture, Ghost, Heart, Scissors } from "lucide-react";

interface TattooArtist {
  id: number;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  images: string[];
}

// Data
const filters = [
  { id: 'all', label: 'Todos los estilos', icon: Palette },
  { id: 'traditional', label: 'Tradicional', icon: Heart },
  { id: 'realism', label: 'Realismo', icon: ImageIcon },
  { id: 'blackwork', label: 'Blackwork', icon: Circle },
  { id: 'tribal', label: 'Tribal', icon: Mountain },
  { id: 'japanese', label: 'Japonés (Irezumi)', icon: Waves },
  { id: 'geometric', label: 'Geométrico', icon: Grid3x3 },
  { id: 'watercolor', label: 'Acuarela', icon: Droplet },
  { id: 'minimalist', label: 'Minimalista', icon: Minus },
  { id: 'dotwork', label: 'Dotwork', icon: Aperture },
  { id: 'neotraditional', label: 'Neo-tradicional', icon: Sparkles },
  { id: 'biomechanical', label: 'Biomecánico', icon: Cog },
  { id: 'portrait', label: 'Retrato', icon: User },
  { id: 'fine-line', label: 'Línea fina', icon: Feather },
  { id: 'ornamental', label: 'Ornamental', icon: Flower2 },
  { id: 'lettering', label: 'Lettering', icon: Type },
  { id: 'chicano', label: 'Chicano', icon: Compass },
  { id: 'sketch', label: 'Sketch', icon: Brush },
  { id: 'blackgrey', label: 'Blanco y negro', icon: Circle },
  { id: 'color', label: 'Color', icon: Palette },
  { id: 'illustrative', label: 'Ilustrativo', icon: Brush },
  { id: 'abstract', label: 'Abstracto', icon: Zap },
  { id: 'surrealism', label: 'Surrealismo', icon: Eye },
  { id: 'newschool', label: 'New School', icon: Sparkles },
  { id: 'anime', label: 'Anime/Manga', icon: Star },
  { id: 'horror', label: 'Horror', icon: Ghost },
  { id: 'coverup', label: 'Cover-up', icon: Scissors }
];

const sortOptions = [
  { id: 'popular', label: 'Más populares' },
  { id: 'rating', label: 'Mejor valorados' },
  { id: 'recent', label: 'Más recientes' },
  { id: 'price-low', label: 'Precio: menor a mayor' },
  { id: 'price-high', label: 'Precio: mayor a menor' }
];

const tatuadores = [
  {
    id: 1,
    name: "María González",
    description: "Especialista en realismo y retratos. 10+ años de experiencia.",
    rating: 4.9,
    reviews: 127,
    images: [
      "https://images.unsplash.com/photo-1590246814883-57c511e56f9a?w=400",
      "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=400",
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=400"
    ]
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    description: "Experto en tatuajes japoneses tradicionales e irezumi.",
    rating: 4.8,
    reviews: 98,
    images: [
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400",
      "https://images.unsplash.com/photo-1568515387631-c5e6c6c4e1b5?w=400",
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=400"
    ]
  },
  {
    id: 3,
    name: "Ana Martínez",
    description: "Diseños minimalistas y línea fina. Arte delicado y elegante.",
    rating: 5.0,
    reviews: 156,
    images: [
      "https://images.unsplash.com/photo-1562962230-16c88a43469f?w=400",
      "https://images.unsplash.com/photo-1590246814883-57c511e56f9a?w=400",
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400"
    ]
  },
  {
    id: 4,
    name: "Diego López",
    description: "Blackwork y geometría. Diseños audaces y modernos.",
    rating: 4.7,
    reviews: 84,
    images: [
      "https://images.unsplash.com/photo-1568515387631-c5e6c6c4e1b5?w=400",
      "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=400",
      "https://images.unsplash.com/photo-1562962230-16c88a43469f?w=400"
    ]
  },
  {
    id: 5,
    name: "Laura Fernández",
    description: "Acuarela y estilos ilustrativos. Colores vibrantes únicos.",
    rating: 4.9,
    reviews: 142,
    images: [
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=400",
      "https://images.unsplash.com/photo-1590246814883-57c511e56f9a?w=400",
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400"
    ]
  },
  {
    id: 6,
    name: "Roberto Sánchez",
    description: "Chicano y lettering. Tradición y estilo clásico americano.",
    rating: 4.8,
    reviews: 91,
    images: [
      "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=400",
      "https://images.unsplash.com/photo-1568515387631-c5e6c6c4e1b5?w=400",
      "https://images.unsplash.com/photo-1562962230-16c88a43469f?w=400"
    ]
  }
];

// Floating Sidebar Component
function FloatingSidebar({ activeFilter, setActiveFilter, sidebarOpen, setSidebarOpen }: { activeFilter: string; setActiveFilter: (filter: string) => void; sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  return (
    <aside className={`
      fixed top-20 left-4 sm:left-33 bottom-4 w-72
      bg-white dark:bg-neutral-900
      border border-neutral-200 dark:border-neutral-800
      rounded-xl shadow-xl overflow-hidden
      transition-all duration-300 z-10
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1rem)]'}
      lg:translate-x-0 lg:top-20 lg:bottom-4
    `}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
            Filtros
          </h3>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
          >
            <X className="w-4 h-4 text-neutral-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wide">
              Ordenar por
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 text-neutral-900 dark:text-neutral-100"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wide">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tatuador..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wide">
              Estilos de tatuaje
            </label>
            <div className="space-y-1">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      activeFilter === filter.id
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{filter.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Tattoo Artist Card Component
function TattooArtistCard({ artist }: { artist: TattooArtist }) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % artist.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + artist.images.length) % artist.images.length);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-800">
        <img
          src={artist.images[currentImage]}
          alt={`${artist.name} trabajo ${currentImage + 1}`}
          className="w-full h-full object-cover"
        />
        
        {artist.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900 rounded-full shadow-lg transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900 rounded-full shadow-lg transition-all"
            >
              <ChevronRight className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {artist.images.map((_, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImage
                      ? 'bg-white w-4'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
            {artist.name}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {artist.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              {artist.rating}
            </span>
          </div>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            ({artist.reviews} reseñas)
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          <button className="flex-1 px-4 py-2.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4" />
            Agendar
          </button>
          <button className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm font-medium rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            Ver perfil
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component
function MarketplacePage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pl-80">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Encuentra tu tatuador
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Explora los mejores artistas del tatuaje
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg flex items-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Filtros</span>
          </button>
        </div>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {tatuadores.map((artist) => (
              <TattooArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      </div>

      <FloatingSidebar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </main>
  );
}

export default MarketplacePage;