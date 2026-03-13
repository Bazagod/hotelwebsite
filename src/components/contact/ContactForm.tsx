"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <p className="font-serif text-2xl text-luxury-gold mb-2">
          Message sent
        </p>
        <p className="text-cream/80">
          We will get back to you within 24 hours.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className="glass-dark border-white/20 overflow-hidden">
        <CardHeader className="border-b border-white/10">
          <h3 className="font-serif text-xl text-cream">Get in touch</h3>
          <p className="text-cream/70 text-sm">
            Reservations, events, or general enquiries—we&apos;re here to help.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-cream/80 mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-cream/80 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-cream/80 mb-2">
                Subject
              </label>
              <Input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm text-cream/80 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message..."
                rows={5}
                required
                className="flex w-full rounded-sm border border-white/20 bg-white/5 px-4 py-3 text-base text-cream placeholder:text-cream/50 focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
            <Button type="submit" size="lg">
              Send message
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
