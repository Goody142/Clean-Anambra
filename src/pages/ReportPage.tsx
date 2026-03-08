import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ReportCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@/data/types';
import { ArrowLeft, Camera, Send } from 'lucide-react';
import { toast } from 'sonner';
import { LocationPicker } from '@/components/LocationPicker';
import { motion } from 'framer-motion';

const categories: ReportCategory[] = [
  'garbage_heap', 'blocked_drainage', 'delayed_pickup',
  'illegal_dumping', 'environmental_hazard', 'emergency_corpse',
];

const ReportPage = () => {
  const { currentUser, addReport } = useApp();
  const navigate = useNavigate();
  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [description, setDescription] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string; lat: number; lng: number; area: string;
  } | null>(null);

  const handleSubmit = () => {
    if (!category || !description.trim()) {
      toast.error('Please select a category and add a description.');
      return;
    }
    if (!selectedLocation) {
      toast.error('Please select a location on the map.');
      return;
    }

    const isEmergency = category === 'emergency_corpse';
    addReport({
      reporterId: currentUser.id,
      category,
      description,
      location: selectedLocation,
      priority: isEmergency ? 'emergency' : category === 'blocked_drainage' || category === 'illegal_dumping' ? 'high' : 'normal',
    });

    toast.success(isEmergency ? '🚨 Emergency alert sent!' : 'Report submitted successfully!');
    navigate('/reports');
  };

  return (
    <div className="pb-20 min-h-screen">
      <div className="bg-gradient-to-br from-primary via-primary to-emerald-700 px-4 pt-8 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary-foreground/70 text-sm mb-3 relative z-10">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-primary-foreground text-2xl font-extrabold relative z-10">Report Issue</h1>
        <p className="text-primary-foreground/70 text-sm relative z-10">Help keep Anambra clean & safe</p>
      </div>

      <div className="px-4 mt-5 space-y-5">
        {/* Category Selection */}
        <div>
          <label className="text-sm font-bold text-foreground mb-2.5 block">What's the issue?</label>
          <div className="grid grid-cols-2 gap-2.5">
            {categories.map((cat, idx) => {
              const isEmergency = cat === 'emergency_corpse';
              const isSelected = category === cat;
              return (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setCategory(cat)}
                  className={`p-3.5 rounded-2xl border-2 text-left text-sm transition-all ${
                    isSelected
                      ? isEmergency
                        ? 'border-emergency bg-emergency/10 shadow-lg shadow-emergency/10'
                        : 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                      : 'border-border bg-card hover:border-primary/30 hover:shadow-sm'
                  }`}
                >
                  <span className="text-xl block mb-1.5">{CATEGORY_ICONS[cat]}</span>
                  <span className={`font-semibold text-xs ${isSelected ? (isEmergency ? 'text-emergency' : 'text-primary') : 'text-card-foreground'}`}>
                    {CATEGORY_LABELS[cat]}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-bold text-foreground mb-2.5 block">Tell us more</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            rows={4}
            className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 resize-none transition-all"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-bold text-foreground mb-2.5 block">Where is it?</label>
          <LocationPicker selected={selectedLocation} onSelect={setSelectedLocation} />
        </div>

        {/* Photo */}
        <div>
          <label className="text-sm font-bold text-foreground mb-2.5 block">Photo (optional)</label>
          <button className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground hover:border-primary/30 hover:bg-accent/30 w-full justify-center transition-all">
            <Camera className="h-5 w-5" />
            <span className="text-sm font-medium">Tap to capture photo</span>
          </button>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all ${
            category === 'emergency_corpse'
              ? 'bg-gradient-to-r from-emergency to-red-600 text-emergency-foreground shadow-emergency/30'
              : 'bg-gradient-to-r from-primary to-emerald-600 text-primary-foreground shadow-primary/30'
          }`}
        >
          <Send className="h-4 w-4" />
          {category === 'emergency_corpse' ? '🚨 Send Emergency Alert' : 'Submit Report'}
        </motion.button>
      </div>
    </div>
  );
};

export default ReportPage;
