import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { ReportCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@/data/types';
import { ArrowLeft, Camera, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

const categories: ReportCategory[] = [
  'garbage_heap', 'blocked_drainage', 'delayed_pickup',
  'illegal_dumping', 'environmental_hazard', 'emergency_corpse',
];

const mockLocations = [
  { address: '15 Modebe Avenue, Onitsha', lat: 6.1460, lng: 6.7890, area: 'GRA Onitsha' },
  { address: 'Ochanja Market Road', lat: 6.1380, lng: 6.7830, area: 'Ochanja' },
  { address: 'Ogbunike Junction, Onitsha', lat: 6.1520, lng: 6.7950, area: 'Ogbunike' },
];

const ReportPage = () => {
  const { currentUser, addReport } = useApp();
  const navigate = useNavigate();
  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [description, setDescription] = useState('');
  const [locationIdx] = useState(Math.floor(Math.random() * mockLocations.length));

  const handleSubmit = () => {
    if (!category || !description.trim()) {
      toast.error('Please select a category and add a description.');
      return;
    }

    const isEmergency = category === 'emergency_corpse';
    addReport({
      reporterId: currentUser.id,
      category,
      description,
      location: mockLocations[locationIdx],
      priority: isEmergency ? 'emergency' : category === 'blocked_drainage' || category === 'illegal_dumping' ? 'high' : 'normal',
    });

    toast.success(isEmergency ? '🚨 Emergency alert sent!' : 'Report submitted successfully!');
    navigate('/reports');
  };

  return (
    <div className="pb-20 min-h-screen">
      <div className="bg-primary px-4 pt-8 pb-6 rounded-b-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary-foreground/70 text-sm mb-3">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-primary-foreground text-xl font-bold">Report Issue</h1>
        <p className="text-primary-foreground/70 text-sm">Help keep Anambra clean</p>
      </div>

      <div className="px-4 mt-5 space-y-5">
        {/* Category Selection */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Issue Category</label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => {
              const isEmergency = cat === 'emergency_corpse';
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-3 rounded-xl border text-left text-sm transition-all ${
                    category === cat
                      ? isEmergency
                        ? 'border-emergency bg-emergency/10 text-emergency'
                        : 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-card-foreground hover:border-primary/30'
                  }`}
                >
                  <span className="text-lg block mb-1">{CATEGORY_ICONS[cat]}</span>
                  <span className="font-medium text-xs">{CATEGORY_LABELS[cat]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            rows={4}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Location</label>
          <div className="flex items-center gap-2 p-3 rounded-xl border border-border bg-card">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm text-card-foreground">{mockLocations[locationIdx].address}</span>
          </div>
        </div>

        {/* Photo */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-2 block">Photo (optional)</label>
          <button className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-border bg-muted/50 text-muted-foreground hover:border-primary/30 w-full justify-center">
            <Camera className="h-4 w-4" />
            <span className="text-sm">Tap to capture photo</span>
          </button>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm shadow-lg transition-colors ${
            category === 'emergency_corpse'
              ? 'bg-emergency text-emergency-foreground shadow-emergency/25 hover:bg-emergency/90'
              : 'bg-primary text-primary-foreground shadow-primary/25 hover:bg-primary/90'
          }`}
        >
          <Send className="h-4 w-4" />
          {category === 'emergency_corpse' ? '🚨 Send Emergency Alert' : 'Submit Report'}
        </button>
      </div>
    </div>
  );
};

export default ReportPage;
