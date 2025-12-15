import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Scale,
  GraduationCap,
  Heart,
  ShoppingBag,
  Mail,
  ExternalLink,
} from "lucide-react";

const socialLinks = [
  {
    name: "Facebook",
    handle: "@theshieldofathena",
    href: "https://www.facebook.com/theshieldofathena",
    icon: Facebook,
    bg: "bg-[#1877F2]/10",
    accent: "hover:bg-[#1877F2]",
    description: "Daily updates & community news",
  },
  {
    name: "Instagram",
    handle: "@shieldofathena",
    href: "https://www.instagram.com/shieldofathena/",
    icon: Instagram,
    bg: "bg-[#E4405F]/10",
    accent: "hover:bg-gradient-to-r hover:from-[#E4405F] hover:via-[#F77737] hover:to-[#FCAF45]",
    description: "Stories from Athena’s kitchen & shelter",
  },
  {
    name: "X (Twitter)",
    handle: "@ShieldMontreal",
    href: "https://x.com/ShieldMontreal",
    icon: Twitter,
    bg: "bg-black/10",
    accent: "hover:bg-black",
    description: "Advocacy alerts & live event coverage",
  },
  {
    name: "YouTube",
    handle: "Shield of Athena",
    href: "https://www.youtube.com/channel/UCkIb-Y9aqujlXrGmF2xY_TQ",
    icon: Youtube,
    bg: "bg-[#FF0000]/10",
    accent: "hover:bg-[#FF0000]",
    description: "Campaign videos & survivor stories",
  },
  {
    name: "Athena Legal Info",
    handle: "Legal Resource Hub",
    href: "https://athenalegalinfo.com/fr/",
    icon: Scale,
    bg: "bg-highlight/15",
    accent: "hover:bg-highlight/40",
    description: "Know your rights, in 10+ languages",
  },
  {
    name: "Formation VBH",
    handle: "Violence Basée sur l'Honneur",
    href: "https://formationvbh.com/",
    icon: GraduationCap,
    bg: "bg-secondary/15",
    accent: "hover:bg-secondary/40",
    description: "Training to prevent honour-based violence",
  },
];

export default function CommunityConnectSection() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing! We'll keep you updated.");
    setEmail("");
  };

  return (
    <section className="bg-gradient-to-b from-background via-primary/5 to-primary/10 py-16 md:py-24">
      <div className="max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-foreground/60 mb-3">
            Follow us on our socials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Stay connected with Shield of Athena
          </h2>
          <p className="text-foreground/70">
            Every post, story, video, guide, and shop purchase helps us amplify survivor voices and sustain essential services. Join our digital village:
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-4 rounded-2xl border border-foreground/10 px-4 py-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-xl hover:shadow-black/10 ${link.bg} ${link.accent}`}
                aria-label={`Visit ${link.name}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="p-3 rounded-xl bg-white/10 text-white group-hover:bg-white/20">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-foreground font-semibold">{link.name}</p>
                      <p className="text-xs text-foreground/70">{link.handle}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-foreground/50 group-hover:text-foreground" />
                  </div>
                  <p className="text-sm text-foreground/70 mt-2">
                    {link.description}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-primary/10"
          >
            <h3 className="text-2xl font-semibold mb-2 text-foreground">Ways to Support</h3>
            <p className="text-foreground/70 mb-6">
              Whatever your capacity, there’s a meaningful way to fuel safety and healing.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <a
                href="https://www.canadahelps.org/en/dn/27709"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-4 bg-highlight/10 rounded-xl hover:bg-highlight/20 transition-colors text-center"
              >
                <Heart className="w-6 h-6 text-highlight" />
                <div>
                  <p className="font-semibold text-foreground">Donate</p>
                  <p className="text-xs text-foreground/70">Canada Helps</p>
                </div>
              </a>
              <a
                href="https://shield-of-athenas-art-sale-more.myshopify.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-4 bg-accent/10 rounded-xl hover:bg-accent/20 transition-colors text-center"
              >
                <ShoppingBag className="w-6 h-6 text-accent" />
                <div>
                  <p className="font-semibold text-foreground">Shopify</p>
                  <p className="text-xs text-foreground/70">Art & cookbooks</p>
                </div>
              </a>
              <LinkCard />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-primary/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-highlight" />
              <h3 className="text-2xl font-semibold text-foreground">Stay Updated</h3>
            </div>
            <p className="text-foreground/70 mb-6">
              Subscribe for survivor stories, urgent calls to action, and impact highlights.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-background/40 border-primary/20 focus:border-highlight"
              />
              <Button
                type="submit"
                className="bg-highlight text-foreground hover:bg-highlight/90 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function LinkCard() {
  return (
    <a
      href="/membership"
      className="flex flex-col items-center gap-3 p-4 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors text-center"
    >
      <Heart className="w-6 h-6 text-primary" />
      <div>
        <p className="font-semibold text-foreground">Membership</p>
        <p className="text-xs text-foreground/70">Annual supporters</p>
      </div>
    </a>
  );
}

