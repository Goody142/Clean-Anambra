import { useState } from 'react';
import { MapPin, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Location {
  address: string;
  lat: number;
  lng: number;
  area: string;
}

const ANAMBRA_LOCATIONS: Location[] = [
  { address: '15 Modebe Avenue, Onitsha', lat: 6.1460, lng: 6.7890, area: 'GRA Onitsha' },
  { address: 'Ochanja Market Road, Onitsha', lat: 6.1380, lng: 6.7830, area: 'Ochanja' },
  { address: 'Ogbunike Junction, Onitsha', lat: 6.1520, lng: 6.7950, area: 'Ogbunike' },
  { address: '12 Iweka Road, Onitsha', lat: 6.1453, lng: 6.7876, area: 'Upper Iweka' },
  { address: 'Fegge Market Junction, Onitsha', lat: 6.1390, lng: 6.7850, area: 'Fegge' },
  { address: 'Awka Road Bridge, Onitsha', lat: 6.1500, lng: 6.7920, area: 'Awka Road' },
  { address: 'Niger Bridge Approach, Onitsha', lat: 6.1650, lng: 6.7740, area: 'Bridge Head' },
  { address: 'Nkpor Junction, Idemili North', lat: 6.1580, lng: 6.8100, area: 'Nkpor' },
  { address: 'Nnewi Main Market, Nnewi', lat: 6.0190, lng: 6.9170, area: 'Nnewi' },
  { address: 'Aroma Junction, Awka', lat: 6.2100, lng: 7.0700, area: 'Awka' },
  { address: 'Unizik Junction, Awka', lat: 6.2460, lng: 7.1180, area: 'Awka South' },
  { address: 'Ekwulobia Town Center', lat: 6.0360, lng: 7.0720, area: 'Aguata' },
];

// Simplified SVG path coordinates for Anambra map regions
const MAP_PINS: { location: Location; x: number; y: number }[] = ANAMBRA_LOCATIONS.map(loc => ({
  location: loc,
  // Normalize lat/lng to map coordinates (0-100 range)
  x: ((loc.lng - 6.70) / 0.50) * 80 + 10,
  y: 100 - ((loc.lat - 5.95) / 0.40) * 80 - 10,
}));

interface LocationPickerProps {
  selected: Location | null;
  onSelect: (loc: Location) => void;
}

export const LocationPicker = ({ selected, onSelect }: LocationPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 border-dashed border-primary/30 bg-accent/30 hover:border-primary/60 hover:bg-accent/50 transition-all group"
      >
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <MapPin className="h-5 w-5 text-primary" />
        </div>
        {selected ? (
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-card-foreground">{selected.area}</p>
            <p className="text-xs text-muted-foreground">{selected.address}</p>
          </div>
        ) : (
          <div className="text-left flex-1">
            <p className="text-sm font-semibold text-primary">Tap to select location</p>
            <p className="text-xs text-muted-foreground">Choose from the Anambra map</p>
          </div>
        )}
        {selected && <Check className="h-5 w-5 text-success" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-card w-full max-w-lg rounded-t-3xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-bold text-foreground text-lg">Select Location</h3>
                <button onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* Map */}
              <div className="p-4">
                <div className="relative bg-accent/40 rounded-2xl border border-border overflow-hidden" style={{ height: 280 }}>
                  {/* Grid */}
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'linear-gradient(hsl(152 55% 33% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(152 55% 33% / 0.4) 1px, transparent 1px)',
                      backgroundSize: '25px 25px',
                    }}
                  />
                  {/* Anambra shape outline (simplified) */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                    <path
                      d="M25,15 L45,8 L65,12 L80,25 L85,45 L78,65 L70,80 L55,88 L35,85 L20,70 L15,50 L18,30 Z"
                      fill="hsl(152 55% 33% / 0.08)"
                      stroke="hsl(152 55% 33% / 0.3)"
                      strokeWidth="0.8"
                    />
                  </svg>

                  {/* Pins */}
                  {MAP_PINS.map(pin => {
                    const isSelected = selected?.address === pin.location.address;
                    const isHovered = hoveredPin === pin.location.address;
                    return (
                      <button
                        key={pin.location.address}
                        className="absolute z-10 group"
                        style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -100%)' }}
                        onClick={() => {
                          onSelect(pin.location);
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => setHoveredPin(pin.location.address)}
                        onMouseLeave={() => setHoveredPin(null)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.3 }}
                          whileTap={{ scale: 0.9 }}
                          className={`relative`}
                        >
                          <MapPin className={`h-6 w-6 drop-shadow-lg ${
                            isSelected ? 'text-primary fill-primary/30' : 'text-emergency fill-emergency/20'
                          }`} />
                          {isSelected && (
                            <motion.div
                              layoutId="selectedRing"
                              className="absolute -inset-1 rounded-full border-2 border-primary"
                            />
                          )}
                        </motion.div>
                        {/* Tooltip */}
                        <AnimatePresence>
                          {(isHovered || isSelected) && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-card rounded-lg px-2.5 py-1.5 shadow-xl border border-border whitespace-nowrap z-30"
                            >
                              <p className="text-[11px] font-bold text-card-foreground">{pin.location.area}</p>
                              <p className="text-[9px] text-muted-foreground">{pin.location.address}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    );
                  })}

                  <div className="absolute bottom-2 left-2 bg-card/90 backdrop-blur rounded-lg px-2.5 py-1.5 text-[10px] text-muted-foreground font-medium">
                    📍 Anambra State, Nigeria
                  </div>
                </div>
              </div>

              {/* Quick list */}
              <div className="px-4 pb-6 max-h-48 overflow-y-auto">
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Or pick from list</p>
                <div className="space-y-1">
                  {ANAMBRA_LOCATIONS.map(loc => (
                    <button
                      key={loc.address}
                      onClick={() => { onSelect(loc); setIsOpen(false); }}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                        selected?.address === loc.address
                          ? 'bg-primary/10 border border-primary/30'
                          : 'hover:bg-accent/50'
                      }`}
                    >
                      <MapPin className={`h-4 w-4 ${selected?.address === loc.address ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{loc.area}</p>
                        <p className="text-[11px] text-muted-foreground">{loc.address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
