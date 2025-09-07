import React from 'react';
import { Camera, Video, Users, Building, User, Sparkles } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      icon: Camera,
      title: 'Wedding Photography',
      description: 'Capture every precious moment of your special day with our romantic and timeless wedding photography.',
      features: ['Pre-wedding shoots', 'Ceremony coverage', 'Reception photography', 'Edited gallery delivery'],
    },
    {
      icon: Video,
      title: 'Wedding Videography',
      description: 'Cinematic wedding films that tell your love story in the most beautiful and emotional way.',
      features: ['Highlight reels', 'Full ceremony videos', 'Drone footage', 'Same-day edits'],
    },
    {
      icon: Users,
      title: 'Event Photography',
      description: 'Professional event coverage for corporate functions, parties, and special celebrations.',
      features: ['Corporate events', 'Birthday parties', 'Anniversaries', 'Live event streaming'],
    },
    {
      icon: Building,
      title: 'Commercial Photography',
      description: 'High-quality commercial photography for businesses, products, and marketing campaigns.',
      features: ['Product photography', 'Corporate headshots', 'Brand photography', 'Marketing materials'],
    },
    {
      icon: User,
      title: 'Portrait Sessions',
      description: 'Professional portrait photography for individuals, families, and couples.',
      features: ['Individual portraits', 'Family sessions', 'Couple photography', 'Professional headshots'],
    },
    {
      icon: Sparkles,
      title: 'Special Occasions',
      description: 'Capturing the magic of life\'s special moments with creativity and style.',
      features: ['Maternity shoots', 'Baby photography', 'Graduation photos', 'Achievement celebrations'],
    },
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We offer a comprehensive range of photography and videography services to capture every important moment in your life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 group hover:scale-105"
            >
              <div className="bg-primary/10 rounded-2xl p-4 w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {service.description}
              </p>
              
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
