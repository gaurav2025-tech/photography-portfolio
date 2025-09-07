import React from 'react';
import { Award, Users, Camera, Heart } from 'lucide-react';

export default function AboutSection() {
  const stats = [
    { icon: Camera, value: '500+', label: 'Projects Completed' },
    { icon: Users, value: '300+', label: 'Happy Clients' },
    { icon: Award, value: '15+', label: 'Awards Won' },
    { icon: Heart, value: '10+', label: 'Years Experience' },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              About Dreams Photography
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                We are passionate storytellers who believe every moment deserves to be captured beautifully. 
                With over a decade of experience in photography and videography, we specialize in creating 
                timeless memories that you'll treasure forever.
              </p>
              <p>
                Our team combines technical expertise with artistic vision to deliver exceptional results. 
                Whether it's your wedding day, a corporate event, or a personal portrait session, we approach 
                each project with creativity, professionalism, and attention to detail.
              </p>
              <p>
                We use state-of-the-art equipment and cutting-edge techniques to ensure every image and video 
                meets the highest standards of quality. Our goal is not just to capture moments, but to tell 
                your unique story in the most compelling way possible.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1554048612-b6a482b224d1?w=600&h=800&fit=crop"
                alt="Photographer at work"
                className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
