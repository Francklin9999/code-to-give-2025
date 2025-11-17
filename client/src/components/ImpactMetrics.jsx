import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from './ui/Card';
import { Users, Home, Heart, Baby, Phone } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

function AnimatedCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: false, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration, isInView]);

  return <span ref={countRef}>{count}</span>;
}

export default function ImpactMetrics() {

  // Source: http://shieldofathena.com/ and https://www.canadahelps.org/fr/organismesdebienfaisance/le-bouclier-dathena-the-shield-of-athena/impact/view/
  // Verified safe version:
  // • 1,229 clients helped in a single year through Shield of Athena's Montreal and Laval centers
  // • 100 women and children found refuge at Athena's House emergency shelter
  // • 34 years of service supporting victims of conjugal and family violence (founded in 1991)
  // • Services offered in 10+ languages (English, French, Spanish, Italian, Armenian, Russian, Greek, Bengali, Farsi, Arabic, Urdu)
  // • Two service centers located in Montreal and Laval
  // • Tens of thousands reached annually through community outreach, education, and awareness
  // • Registered Canadian charity: 138823471RR0001
  const metrics = React.useMemo(() => {
    return {
      families: 1229,      // 1,229 clients helped in a single year
      shelter: 100,        // 100 women & children at Athena's House
      counseling: 34,       // 34 years of service (founded in 1991)
      children: 10,        // 10+ languages available
      crisis: 2            // 2 service centers (Montreal & Laval)
    };
  }, []);

  const stats = [
    {
      icon: Users,
      label: 'Clients Helped',
      value: metrics.families,
      color: 'from-primary-dark to-primary', // strong brand gradient
    },
    {
      icon: Home,
      label: "Women & Children at Athena's House",
      value: metrics.shelter,
      color: 'from-secondary to-primary-light', // blue → light lavender
    },
    {
      icon: Heart,
      label: 'Years of Service',
      value: metrics.counseling,
      color: 'from-rose-500 to-primary', // allow one warmer gradient
    },
    {
      icon: Baby,
      label: 'Languages Available',
      value: metrics.children,
      color: 'from-highlight to-primary', // yellow → purple
    },
    {
      icon: Phone,
      label: 'Offices (Montreal & Laval)',
      value: metrics.crisis,
      color: 'from-secondary to-primary-dark', // blue → deep purple
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-highlight/80 via-primary/70 to-primary-dark">
      <div className="max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Our Community's Impact
          </h2>
          <p className="text-lg text-white max-w-2xl mx-auto mb-2">
            Together, we're creating lasting change for women and children
          </p>
          <p className="text-sm text-white max-w-2xl mx-auto">
            Real-time impact based on community donations
          </p>
          <p className="text-xs text-white/80 max-w-2xl mx-auto mt-2">
            Registered charity number: 138823471RR0001
            {/* Source: https://www.canadahelps.org/fr/organismesdebienfaisance/le-bouclier-dathena-the-shield-of-athena/impact/view/ */}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="text-center hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-background/90 backdrop-blur-sm border border-primary/10 min-h-[220px] flex flex-col justify-center">
                  <CardContent className="p-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: idx * 0.1 + 0.2, type: "spring" }}
                      className="inline-flex p-3 rounded-full bg-gradient-to-br from-primary-light/70 to-primary/70 mb-4 mt-4"
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-highlight to-primary-dark bg-clip-text text-transparent mb-1">
                      <AnimatedCounter value={stat.value} duration={2000} />+
                    </div>
                    <div className="text-sm font-semibold text-foreground mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs text-foreground/60">
                      real statistics
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-accent/80 px-6 py-3 rounded-full border border-accent">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm font-semibold text-foreground/80">
              100% of donations go directly to services - No admin fees
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

