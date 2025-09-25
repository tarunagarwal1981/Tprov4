'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  delay?: number;
  gradient: string;
}

function FeatureCard({ title, description, icon, features, delay = 0, gradient }: FeatureCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="feature-card"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      <div className="feature-icon">
        {icon}
      </div>
      
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
      
      <ul className="feature-list">
        {features.map((feature, index) => (
          <motion.li 
            key={index}
            className="feature-item"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.4, delay: delay + 0.2 + (index * 0.1) }}
          >
            <svg className="feature-check" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{feature}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Features() {
  const features = [
    {
      title: 'AI Lead Generation',
      description: 'Harness the power of artificial intelligence to automatically identify and qualify potential customers, increasing your conversion rates by up to 300%.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      features: [
        'Smart customer profiling',
        'Automated lead scoring',
        'Predictive analytics',
        'Real-time insights',
        'Custom AI models'
      ],
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
      delay: 0
    },
    {
      title: 'Package Management',
      description: 'Streamline your tour operations with our comprehensive package management system. Create, edit, and optimize packages with ease.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      features: [
        'Dynamic pricing engine',
        'Inventory management',
        'Multi-language support',
        'Photo & video galleries',
        'Booking automation'
      ],
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
      delay: 0.2
    },
    {
      title: 'Global Network',
      description: 'Connect with a worldwide network of travel professionals. Access exclusive deals, partnerships, and collaborative opportunities.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      features: [
        'Worldwide partnerships',
        'Cross-border payments',
        'Multi-currency support',
        'Local expertise access',
        'Collaborative tools'
      ],
      gradient: 'bg-gradient-to-br from-green-500 to-green-600',
      delay: 0.4
    }
  ];

  return (
    <section id="features" className="landing-features">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">
            Powerful Features for Modern Travel Professionals
          </h2>
          <p className="section-description">
            Everything you need to grow your travel business, powered by cutting-edge technology and industry expertise
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              features={feature.features}
              gradient={feature.gradient}
              delay={feature.delay}
            />
          ))}
        </div>

        {/* Additional Features Grid */}
        <motion.div 
          className="mini-features"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="mini-feature">
            <div className="mini-feature-icon blue">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h4 className="mini-feature-title">Secure Payments</h4>
            <p className="mini-feature-description">Bank-level security</p>
          </div>

          <div className="mini-feature">
            <div className="mini-feature-icon green">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="mini-feature-title">Real-time Sync</h4>
            <p className="mini-feature-description">Instant updates</p>
          </div>

          <div className="mini-feature">
            <div className="mini-feature-icon purple">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="mini-feature-title">Analytics</h4>
            <p className="mini-feature-description">Deep insights</p>
          </div>

          <div className="mini-feature">
            <div className="mini-feature-icon orange">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
              </svg>
            </div>
            <h4 className="mini-feature-title">24/7 Support</h4>
            <p className="mini-feature-description">Always available</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
