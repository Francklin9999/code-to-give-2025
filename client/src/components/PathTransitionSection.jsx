import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/Button";
import { Phone, Heart, Shield, HandHeart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EventBanner from "./EventBanner";
import ShopBanner from "./ShopBanner";

import wisdomImg from "../assets/hero_wisdom.jpg";
import protectionImg from "../assets/hero_protection.jpg";
import courageImg from "../assets/hero_courage.jpeg";

const PATHS = [
  {
    id: "WISDOM",
    label: "Wisdom",
    color: "bg-highlight",
    textColor: "text-highlight/80",
    icon: Phone,
    description:
      "Support first contact, crisis information, outreach, and guidance.",
  },
  {
    id: "COURAGE",
    label: "Courage",
    color: "bg-muted",
    textColor: "text-muted/80",
    icon: Heart,
    description:
      "Help survivors rebuild through counseling and long-term support.",
  },
  {
    id: "PROTECTION",
    label: "Protection",
    color: "bg-secondary",
    textColor: "text-secondary/80",
    icon: Shield,
    description:
      "Fund emergency shelter nights and safe housing for families.",
  },
  {
    id: "SERVICE",
    label: "Service",
    color: "bg-accent",
    textColor: "text-accent/80",
    icon: HandHeart,
    description:
      "Volunteer your time to support shelters, events, and families.",
  },
];

export default function PathTransitionSection({ onAboutClick }) {
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const handlePathClick = (path) => {
      navigate(`/path-results?path=${path}`);
  };

  // Triangles fade + move down as you scroll past hero
  const trianglesOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const trianglesY = useTransform(scrollYProgress, [0, 0.8], [0, 80]);

  // Stripes fade + slide in, then stay visible
  const stripesOpacity = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  const stripesX       = useTransform(scrollYProgress, [0.2, 0.8], [-20, 0]);

  // Stripes grow and then keep full height
  const stripe1Height = useTransform(scrollYProgress, [0.2, 0.8], [16, 80]);
  const stripe2Height = useTransform(scrollYProgress, [0.2, 0.8], [16, 80]);
  const stripe3Height = useTransform(scrollYProgress, [0.2, 0.8], [16, 80]);
  const stripe4Height = useTransform(scrollYProgress, [0.2, 0.8], [16, 80]);
  const stripeHeights = [stripe1Height, stripe2Height, stripe3Height, stripe4Height];


  const scrollToWaysToHelp = () => {
    const el = document.getElementById("ways-to-help");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] flex flex-col items-center bg-white overflow-hidden pt-24 pb-16"
    >
      {/* Mobile stacked banners */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[min(95%,20rem)] z-20 md:hidden">
        <div className="flex flex-col gap-4">
          <EventBanner />
          <ShopBanner />
        </div>
      </div>

      {/* Desktop split banners */}
      <div className="hidden md:block">
        <div className="absolute top-4 left-4 z-20 max-w-md w-[min(100%,24rem)]">
          <EventBanner />
        </div>
        <div className="absolute top-4 right-4 z-20 max-w-md w-[min(100%,24rem)] flex justify-end">
          <ShopBanner />
        </div>
      </div>

      {/* TEXT + CTA */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 pt-32 md:pt-0">
        {/* Source: https://www.canadahelps.org/fr/organismesdebienfaisance/le-bouclier-dathena-the-shield-of-athena/impact/view/ */}
        <h1 className="text-4xl max-w-2xl md:text-5xl font-bold text-gray-900 mb-3">
          Supporting Women and Children Affected by Family Violence
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          The Shield of Athena is a non-profit organization offering culturally and linguistically adapted professional support, intervention, and prevention services to women victims of family violence and their children, as well as members of ethnocultural communities.
          {/* Source: https://www.canadahelps.org/fr/organismesdebienfaisance/le-bouclier-dathena-the-shield-of-athena/impact/view/ - "Le Bouclier d'Athéna Services familiaux est un organisme communautaire sans but lucratif qui offre des services professionnels de soutien, d'intervention et de prévention culturellement et linguistiquement adaptés aux besoins des femmes victimes de violence familiale et leurs enfants ainsi qu'aux membres des communautés ethnoculturelles." */}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button
            size="lg"
            variant="unstyled"
            onClick={scrollToWaysToHelp}
            className="bg-highlight/70 hover:bg-highlight/90 text-white px-8 py-5 rounded-full shadow-lg flex items-center gap-2 shadow-highlight-glow hover:shadow-highlight-glow-strong"
          >
            Donate
          </Button>
          {onAboutClick && (
            <Button
              size="lg"
              variant="unstyled"
              onClick={onAboutClick}
              className="bg-primary/70 hover:bg-primary/90 text-white px-8 py-5 rounded-full shadow-lg flex items-center gap-2 shadow-primary-glow hover:shadow-primary-glow-strong"
            >
              Learn More About Us
            </Button>
          )}
        </div>
      </div>

      {/* MINIMIZED TRIANGLES (mobile only) */}
      <div className="md:hidden relative w-full px-4 mt-8 -mb-8">
        <div className="flex items-center justify-center -space-x-10">
          {/* Wisdom - Small Triangle */}
          <div
            onClick={() => handlePathClick("WISDOM")}
            className="relative w-40 h-40 cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
            style={{
              clipPath: "polygon(0% 30%, 21% 0, 100% 100%, 4% 75%)",
              backgroundImage: `url(${wisdomImg})`,
              backgroundSize: "cover",
              backgroundPosition: "40% center",
            }}
          >
            <div className="absolute inset-0 bg-highlight/20" />
            <div className="absolute inset-0 flex items-center justify-start ml-6">
              <Phone className="w-6 h-6 text-white drop-shadow-md" />
            </div>
          </div>

          {/* Courage - Small Triangle */}
          <div
            onClick={() => handlePathClick("COURAGE")}
            className="relative w-40 h-40 cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 z-10"
            style={{
              clipPath: "polygon(16% 0%, 84% 0%, 100% 24%, 50% 100%, 2% 24%)",
              backgroundImage: `url(${courageImg})`,
              backgroundSize: "cover",
              backgroundPosition: "60% center",
            }}
          >
            <div className="absolute inset-0 bg-muted/20" />
            <div className="absolute inset-0 flex items-start justify-center mt-4">
              <Heart className="w-6 h-6 text-white drop-shadow-md" />
            </div>
          </div>

          {/* Protection - Small Triangle */}
          <div
            onClick={() => handlePathClick("PROTECTION")}
            className="relative w-40 h-40 cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
            style={{
              clipPath: "polygon(100% 30%, 79% 0, 0% 100%, 96% 75%)",
              backgroundImage: `url(${protectionImg})`,
              backgroundSize: "cover",
              backgroundPosition: "15% center",
            }}
          >
            <div className="absolute inset-0 bg-secondary/20" />
            <div className="absolute inset-0 flex items-center justify-end mr-7">
              <Shield className="w-6 h-6 text-white drop-shadow-md" />
            </div>
          </div>
        </div>
        
        {/* Path Labels */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <span className="text-xs font-medium text-highlight">Wisdom</span>
          <span className="text-xs font-medium text-muted">Courage</span>
          <span className="text-xs font-medium text-secondary">Protection</span>
        </div>
      </div>

      {/* TRIANGLES (desktop only) */}
      <motion.div
        style={{ opacity: trianglesOpacity, y: trianglesY }}
        className="
          hidden md:flex
          relative w-full -mt-56
          items-end justify-center -gap-[1vw]
        "
      >
        {/* Mobile view implemented with cards above - triangles are desktop-only now */}
        {/* LEFT – Wisdom */}
        <div
            onClick={() => handlePathClick("WISDOM")}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handlePathClick("WISDOM");
            }}
            role="button"
            tabIndex={0}
            aria-label="View Wisdom path"
            className="relative w-[24rem] md:w-[130rem] h-[30rem] md:h-[45rem] shadow-2xl origin-bottom translate-x-[100px] translate-y-[-40px] cursor-pointer transition-transform duration-300 hover:scale-105"
            style={{
                clipPath: "polygon(0% 30%, 21% 0, 100% 100%, 4% 75%)",
                backgroundImage: `url(${wisdomImg})`,
                backgroundSize: "cover",
                backgroundPosition: "40% center",
            }}
            >
            <div className="absolute inset-x-0 top-8 flex flex-col items-center gap-3 -translate-x-[20px] translate-y-[430px]">
            {/* Icon circle */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 shadow-sm">
                <Phone className="w-7 h-7 text-highlight" />
            </div>

            {/* Text box */}
            <div className="px-4 py-1 rounded-full bg-white/90 shadow-sm">
                <span className="text-sm font-semibold text-highlight">
                Wisdom
                </span>
            </div>
            </div>
        </div>

        {/* MIDDLE – Courage */}
        <div
            onClick={() => handlePathClick("COURAGE")}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handlePathClick("COURAGE");
            }}
            role="button"
            tabIndex={0}
            aria-label="View Courage path"
            className="relative w-[18rem] md:w-[110rem] h-[24rem] md:h-[28rem] shadow-2xl origin-bottom z-10 cursor-pointer transition-transform duration-300 hover:scale-105"
            style={{
                clipPath: "polygon(16% 0%, 84% 0%, 100% 24%, 50% 100%, 2% 24%)",
                backgroundImage: `url(${courageImg})`,
                backgroundSize: "cover",
                backgroundPosition: "60% center",
            }}           
        >
            <div className="absolute inset-x-0 top-8 flex flex-col items-center gap-3">
            {/* Icon circle */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 shadow-sm">
                <Heart className="w-7 h-7 text-muted" />
            </div>

            {/* Text box */}
            <div className="px-4 py-1 rounded-full bg-white/90 shadow-sm">
                <span className="text-sm font-semibold text-muted">
                Courage
                </span>
            </div>
            </div>

        </div>

        {/* RIGHT – Protection */}
        <div
            onClick={() => handlePathClick("PROTECTION")}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handlePathClick("PROTECTION");
            }}
            role="button"
            tabIndex={0}
            aria-label="View Protection path"
            className="relative w-[24rem] md:w-[130rem] h-[30rem] md:h-[45rem] shadow-2xl origin-bottom translate-x-[-100px] translate-y-[-40px] cursor-pointer transition-transform duration-300 hover:scale-105"
            style={{
                clipPath: "polygon(100% 30%, 79% 0, 0% 100%, 96% 75%)",
                backgroundImage: `url(${protectionImg})`,
                backgroundSize: "cover",
                backgroundPosition: "15% center",
                }}
            >
            <div className="absolute inset-x-0 top-8 flex flex-col items-center gap-3 translate-x-[20px] translate-y-[430px]">
            {/* Icon circle */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 shadow-sm">
                <Shield className="w-7 h-7 text-secondary" />
            </div>

            {/* Text box */}
            <div className="px-4 py-1 rounded-full bg-white/90 shadow-sm">
                <span className="text-sm font-semibold text-secondary">
                Protection
                </span>
            </div>
            </div>
        </div>
      </motion.div>

        {/* STRIPES + HOVER CARDS (desktop only) */}
        <motion.div
        style={{ opacity: stripesOpacity, x: stripesX }}
        className="hidden md:block fixed left-6 top-1/3 z-10"
        >
        <div className="flex flex-col gap-3">
            {PATHS.map((path, index) => (
            <div
                key={path.id}
                className="group relative cursor-pointer"
                onClick={() => handlePathClick(path.id)}   
            >
                {/* The stripe itself */}
                <motion.div
                className={`
                    w-2 rounded-full
                    transition-all duration-200
                    group-hover:w-3
                    ${path.color}
                `}
                style={{ height: stripeHeights[index] }}
                />

                {/* The extended card that appears on hover */}
                <div
                className="
                    absolute left-4 top-1/2 -translate-y-1/2
                    opacity-0 translate-x-[-8px]
                    group-hover:opacity-100 group-hover:translate-x-0
                    transition-all duration-200
                    bg-white/95 rounded-xl shadow-lg border border-gray-100
                    px-3 py-2 w-52
                "
                >
                <div className="flex items-center gap-2">
                <path.icon className={`w-4 h-4 ${path.textColor}`} />
                <p className={`text-xs font-semibold ${path.textColor}`}>
                    {path.label}
                </p>
                </div>

                <p className="mt-1 text-[13px] text-gray-600 leading-snug">
                    {path.description}
                </p>
                <p className="mt-2 text-[13px] font-medium text-foreground">
                    Click to view this path →
                </p>
                </div>
            </div>
            ))}
        </div>
        </motion.div>

    </section>
  );
}
