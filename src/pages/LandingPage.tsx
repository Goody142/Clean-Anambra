import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bell, Users, Shield, ArrowRight, Leaf, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <MapPin className="h-5 w-5" />, title: 'Report Issues', desc: 'Pin sanitation problems on the map instantly' },
    { icon: <Bell className="h-5 w-5" />, title: 'Emergency Alerts', desc: 'Rapid response for critical situations' },
    { icon: <Users className="h-5 w-5" />, title: 'Team Coordination', desc: 'Connect residents with cleanup crews' },
    { icon: <Shield className="h-5 w-5" />, title: 'Track Progress', desc: 'Monitor resolution in real-time' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
      {/* Hero Section */}
      <div className="relative px-6 pt-12 pb-8">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          {/* Logo/Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground tracking-tight">3MTT CleanTrack</h1>
              <p className="text-xs text-muted-foreground font-medium">Anambra State</p>
            </div>
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl font-black text-foreground leading-tight mb-4">
            Keep Anambra{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
              Clean & Safe
            </span>
          </h2>
          
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Report sanitation issues, coordinate cleanup crews, and track environmental hazards in real-time. 
            Together, we're building a cleaner Onitsha and a healthier Anambra State.
          </p>

          {/* Stats */}
          <div className="flex gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-1 bg-card border border-border rounded-2xl p-4 text-center"
            >
              <p className="text-2xl font-black text-primary">500+</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Reports Resolved</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex-1 bg-card border border-border rounded-2xl p-4 text-center"
            >
              <p className="text-2xl font-black text-primary">24hr</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Response</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex-1 bg-card border border-border rounded-2xl p-4 text-center"
            >
              <p className="text-2xl font-black text-primary">15+</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Active Teams</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="font-bold text-sm text-foreground">How It Works</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="bg-card border border-border rounded-2xl p-4"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
                {feature.icon}
              </div>
              <h4 className="font-bold text-sm text-card-foreground mb-1">{feature.title}</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Problem Statement */}
      <div className="px-6 mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-primary/10 to-emerald-500/10 border border-primary/20 rounded-2xl p-5"
        >
          <h3 className="font-bold text-sm text-foreground mb-2">🎯 Our Mission</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Urban sanitation challenges affect millions of Nigerians daily—from blocked drainages causing floods, 
            to delayed waste pickups creating health hazards. CleanTrack connects residents directly with 
            sanitation authorities for faster, accountable environmental response.
          </p>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="px-6 pb-8">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/home')}
          className="w-full bg-gradient-to-r from-primary to-emerald-600 text-primary-foreground py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-primary/30"
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </motion.button>
        
        <p className="text-center text-[10px] text-muted-foreground mt-4">
          A 3MTT Innovation Project • Powered by Civic Technology
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
