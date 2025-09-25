'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedCounter({ end, duration = 2, suffix = '', prefix = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const startCount = 0;
      
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(startCount + (end - startCount) * easeOutQuart);
        
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

interface StatCardProps {
  number: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

function StatCard({ number, suffix = '', prefix = '', label, description, icon, delay = 0 }: StatCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="stat-card"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      <div className="stat-icon">
        {icon}
      </div>
      
      <div className="stat-number">
        <AnimatedCounter 
          end={number} 
          suffix={suffix} 
          prefix={prefix}
          duration={2.5}
        />
      </div>
      
      <h3 className="stat-label">{label}</h3>
      <p className="stat-description">{description}</p>
    </motion.div>
  );
}

export function Stats() {
  const stats = [
    {
      number: 500,
      suffix: '+',
      label: 'Tour Operators',
      description: 'Trusted partners worldwide',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      delay: 0
    },
    {
      number: 10000,
      suffix: '+',
      label: 'Travel Agents',
      description: 'Active professionals',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      delay: 0.2
    },
    {
      number: 2000000,
      prefix: '$',
      suffix: '+',
      label: 'Revenue Generated',
      description: 'For our partners',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      delay: 0.4
    }
  ];

  return (
    <section id="stats" className="landing-stats">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">
            Trusted by Industry Leaders
          </h2>
          <p className="section-description">
            Join thousands of travel professionals who have transformed their business with our platform
          </p>
        </motion.div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              number={stat.number}
              suffix={stat.suffix}
              prefix={stat.prefix}
              label={stat.label}
              description={stat.description}
              icon={stat.icon}
              delay={stat.delay}
            />
          ))}
        </div>

        {/* Additional Stats Row */}
        <motion.div 
          className="mini-stats"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="mini-stat">
            <div className="mini-stat-number blue">
              <AnimatedCounter end={150} suffix="+" duration={2} />
            </div>
            <div className="mini-stat-label">Countries</div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat-number purple">
              <AnimatedCounter end={50} suffix="K+" duration={2} />
            </div>
            <div className="mini-stat-label">Bookings</div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat-number green">
              <AnimatedCounter end={99} suffix="%" duration={2} />
            </div>
            <div className="mini-stat-label">Satisfaction</div>
          </div>
          <div className="mini-stat">
            <div className="mini-stat-number orange">
              <AnimatedCounter end={24} suffix="/7" duration={2} />
            </div>
            <div className="mini-stat-label">Support</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}