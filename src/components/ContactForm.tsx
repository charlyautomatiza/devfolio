import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isContactEnabled, setIsContactEnabled] = useState(false);
  const sectionRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sections = ['home', 'portfolio', 'cv'];
    if (process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ENABLED === 'true') {
      sections.push('contact');
      setIsContactEnabled(true);
    } else {
      setIsContactEnabled(false);
    }
    sections.forEach((section) => {
      sectionRefs.current[section] = React.createRef<HTMLDivElement>();
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL!, {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <Card className="w-full max-w-md p-8 bg-white dark:bg-[#121212]">
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-[#2F3E44] dark:text-white">
        Get in Touch
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-[#2F3E44] dark:text-white">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-[#C7D8D9] dark:bg-[#151E21] rounded-md focus:outline-none focus:ring-2 focus:ring-[#56B281] text-[#2F3E44] dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-[#2F3E44] dark:text-white">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-[#C7D8D9] dark:bg-[#151E21] rounded-md focus:outline-none focus:ring-2 focus:ring-[#56B281] text-[#2F3E44] dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-[#2F3E44] dark:text-white">
            Message
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 bg-[#C7D8D9] dark:bg-[#151E21] rounded-md focus:outline-none focus:ring-2 focus:ring-[#56B281] text-[#2F3E44] dark:text-white"
          ></textarea>
        </div>
        <Button type="submit" className="w-full bg-[#56B281] hover:bg-[#56B281]/90 text-white" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
      {submitStatus === 'success' && <p className="mt-4 text-green-600">Message sent successfully!</p>}
      {submitStatus === 'error' && <p className="mt-4 text-red-600">An error occurred. Please try again.</p>}
    </Card>
  );
}
