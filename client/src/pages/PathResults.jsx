import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import dataService from '../services/dataService';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Phone, Heart, Home, ArrowRight, HandHeart } from 'lucide-react';
import { motion } from 'framer-motion';
import DonationSuccessModal from '../components/DonationSuccessModal';
import CommunityGoals from '../components/CommunityGoals';
import VideoEmbed from '../components/VideoEmbed';
import { API_URL } from '../config';
import { createGuestDonor } from '../utils/guestDonor';

const PATH_CONFIG = {
  WISDOM: {
    icon: Phone,
    color: 'from-highlight to-secondary',
    bgColor: 'bg-highlight/15',
    borderColor: 'border-highlight/40',
    textColor: 'text-highlight',
    videoId: 'PY6ls0v6hu4',
  },
  COURAGE: {
    icon: Heart,
    color: 'from-muted to-primary',
    bgColor: 'bg-muted/15',
    borderColor: 'border-muted/40',
    textColor: 'text-muted',
    videoId: 'HFqvJ_e_emw',
  },
  PROTECTION: {
    icon: Home,
    color: 'from-secondary to-primary-dark',
    bgColor: 'bg-secondary/15',
    borderColor: 'border-secondary/40',
    textColor: 'text-secondary',
    videoId: '7eZvuWHRBKQ',
  },
  SERVICE : {
    icon: HandHeart,
    color: 'from-accent to-primary',
    bgColor: 'bg-accent/15',
    borderColor: 'border-accent/40',
    textColor: 'text-accent',
    videoId: 'gawZBbcaA1M',
  }
};

export default function PathResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const path = (searchParams.get('path') || 'WISDOM').toUpperCase();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastDonation, setLastDonation] = useState(null);
  const [pendingDonation, setPendingDonation] = useState(null); // { item, customAmount }
  const [donations, setDonations] = useState([]);
  const [customAmount, setCustomAmount] = useState('');

  const config = PATH_CONFIG[path] || PATH_CONFIG.WISDOM;
  const Icon = config.icon;
  const impactItems = dataService.getImpactItems().filter((item) => item.path === path);
  const pathGoals = dataService.getGoals(true).filter((g) => g.path === path);


  const handleDonate = useCallback(
    async (item, customAmount = null, options = {}) => {
      const normalizedOptions =
        typeof options === "boolean" ? { triggeredAfterLogin: options } : options;
      const {
        triggeredAfterLogin = false,
        donorOverride = null,
      } = normalizedOptions;
      const actingDonor = donorOverride || user;

      if (!actingDonor && !triggeredAfterLogin) {
        setPendingDonation({ item, customAmount });
        window.dispatchEvent(new CustomEvent("open-login-modal"));
        return;
      }

      if (!actingDonor) {
        console.warn("Donation attempted without donor context.");
        return;
      }

      const amount = customAmount || item.suggested_amount;
      let points = amount;
      if (path === "PROTECTION") points = Math.floor(amount * 1.5);
      else if (path === "COURAGE") points = Math.floor(amount * 1.2);

      try {
        try {
          await fetch(`${API_URL}/donate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              amount,
              path,
              uuid: actingDonor.id,
              impact: points,
            }),
          });
        } catch (err) {
          console.error("Backend donation error:", err);
        }

        const createdDonation = dataService.createDonation({
          user_id: actingDonor.id,
          user_name:
            actingDonor.full_name ||
            (actingDonor.is_guest ? "Guest Supporter" : "Anonymous"),
          path: path,
          amount: amount,
          points_awarded: points,
          impact_item_id: item.id,
          impact_item_title: language === "fr" ? item.title_fr : item.title_en,
        });

        // Optimistically update local donations list so totals refresh immediately
        setDonations((prev) => [...prev, createdDonation]);

        if (!actingDonor.is_guest) {
          const newPoints = (actingDonor.total_points || 0) + points;
          dataService.updateUser(actingDonor.id, {
            total_points: newPoints,
            primary_path: actingDonor.primary_path || path,
          });
        }

        setLastDonation({
          amount,
          path: path,
          points_awarded: points,
        });
        setShowSuccessModal(true);

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("donation-recorded", {
              detail: {
                amount,
                path,
                timestamp: new Date().toISOString(),
                source: "path-results",
              },
            })
          );
        }
      } catch (error) {
        console.error("Donation error:", error);
        alert("Unable to process donation. Please try again.");
      }
    },
    [user, path, language]
  );

  useEffect(() => {
    const handler = () => {
      if (pendingDonation) {
        const { item, customAmount } = pendingDonation;
        setPendingDonation(null);
        handleDonate(item, customAmount, true);
      }
    };

    window.addEventListener("login-success", handler);
    return () => window.removeEventListener("login-success", handler);
  }, [pendingDonation, handleDonate]);

  useEffect(() => {
    const handler = () => {
      if (!pendingDonation) {
        console.warn("Guest donation requested with no pending donation context.");
        return;
      }
      const { item, customAmount } = pendingDonation;
      setPendingDonation(null);
      handleDonate(item, customAmount, {
        donorOverride: createGuestDonor(),
        triggeredAfterLogin: true,
      });
    };

    window.addEventListener("guest-donation-request", handler);
    return () => window.removeEventListener("guest-donation-request", handler);
  }, [pendingDonation, handleDonate]);

  // Load donations for this path from backend, with a fallback to local dataService
  useEffect(() => {
    let cancelled = false;

    async function loadDonationsForPath() {
      try {
        const qs = path ? `?path=${path}` : '';
        const res = await fetch(`http://localhost:8000/donations${qs}`, {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to load donations for path');
        }

        const data = await res.json();
        if (!cancelled) {
          setDonations(data.donations || []);
        }
      } catch (err) {
        console.error('Failed to load donations for path from backend; falling back to local dataService', err);
        const local = dataService.getDonations({ path }) || [];
        if (!cancelled) {
          setDonations(local);
        }
      }
    }

    loadDonationsForPath();

    return () => {
      cancelled = true;
    };
  }, [path]);

  const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalDonations = donations.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 py-12">
      <DonationSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        donation={lastDonation}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${config.color} mb-6`}>
            <Icon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t(`paths.${path.toLowerCase()}.name`)}{' '}
            {language === 'fr' ? 'Parcours' : 'Path'}
          </h1>
          <p className="text-xl text-foreground/70 max-w-3xl leading-relaxed">
            {t(`paths.${path.toLowerCase()}.desc`)}
          </p>
        </motion.div>

        {/* Summary cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className={`${config.bgColor} border-2 ${config.borderColor}`}>
            <CardContent className="pt-7 pb-6 px-6 text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {path === 'SERVICE' ? '45' : `$${totalAmount.toLocaleString()}`}
              </div>
              <div className="text-sm text-foreground/70">
                {path === 'SERVICE' 
                  ? (language === 'fr' ? 'Bénévoles Actifs' : 'Active Volunteers')
                  : (language === 'fr' ? 'Total Collecté' : 'Total Raised')}
              </div>
            </CardContent>
          </Card>

          <Card className={`${config.bgColor} border-2 ${config.borderColor}`}>
            <CardContent className="pt-7 pb-6 px-6 text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {path === 'SERVICE' ? '120' : totalDonations}
              </div>
              <div className="text-sm text-foreground/70">
                {path === 'SERVICE' 
                  ? (language === 'fr' ? 'Heures de Bénévolat' : 'Volunteer Hours')
                  : (language === 'fr' ? 'Dons Totaux' : 'Total Donations')}
              </div>
            </CardContent>
          </Card>

          <Card className={`${config.bgColor} border-2 ${config.borderColor}`}>
            <CardContent className="pt-7 pb-6 px-6 text-center">
              <div className="text-3xl font-bold text-foreground mb-1">
                {path === 'SERVICE' ? '8' : impactItems.length}
              </div>
              <div className="text-sm text-foreground/70">
                {path === 'SERVICE' 
                  ? (language === 'fr' ? 'Opportunités Disponibles' : 'Available Opportunities')
                  : (language === 'fr' ? 'Options de Don' : 'Donation Options')}
              </div>
            </CardContent>
          </Card>
        </div>

{/* VIDEOS */}

        {config.videoId && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {language === 'fr'
                ? 'Découvrez ce parcours'
                : 'Learn about this path'}
            </h2>
            <VideoEmbed videoId={config.videoId} />
          </div>
        )}

        {/* How you can help */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            {language === 'fr'
              ? 'Comment Vous Pouvez Aider'
              : 'How You Can Help'}
          </h2>
          
          {path === 'SERVICE' ? (
            /* Volunteer Opportunities for SERVICE path */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Crisis Line Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all">
                  <CardContent className="pt-7 pb-6 px-6 h-full flex flex-col">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      {language === 'fr' ? 'Support Téléphonique' : 'Crisis Line Support'}
                    </h3>
                    <p className="text-sm text-foreground/70 mb-4 leading-relaxed flex-grow">
                      {language === 'fr' 
                        ? 'Offrez un soutien émotionnel aux femmes en crise par téléphone'
                        : 'Provide emotional support to women in crisis over the phone'}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-foreground">
                        4-6h
                      </span>
                      <span className="text-sm text-foreground/60">
                        {language === 'fr' ? 'par semaine' : 'per week'}
                      </span>
                    </div>
                    <Button
                      onClick={() => navigate('/volunteer-schedule')}
                      className={`w-full bg-gradient-to-r ${config.color} hover:brightness-110 hover:shadow-md text-white transition-all duration-200 mt-auto`}
                    >
                      {language === 'fr' ? 'Devenir Bénévole' : 'Become Volunteer'}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Community Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all">
                  <CardContent className="pt-7 pb-6 px-6 h-full flex flex-col">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      {language === 'fr' ? 'Événements Communautaires' : 'Community Events'}
                    </h3>
                    <p className="text-sm text-foreground/70 mb-4 leading-relaxed flex-grow">
                      {language === 'fr' 
                        ? 'Aidez à organiser et gérer des événements de sensibilisation'
                        : 'Help organize and manage awareness events'}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-foreground">
                        2-4h
                      </span>
                      <span className="text-sm text-foreground/60">
                        {language === 'fr' ? 'par événement' : 'per event'}
                      </span>
                    </div>
                    <Button
                      onClick={() => navigate('/volunteer-schedule')}
                      className={`w-full bg-gradient-to-r ${config.color} hover:brightness-110 hover:shadow-md text-white transition-all duration-200 mt-auto`}
                    >
                      {language === 'fr' ? 'Devenir Bénévole' : 'Become Volunteer'}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Administrative Support */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all">
                  <CardContent className="pt-7 pb-6 px-6 h-full flex flex-col">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      {language === 'fr' ? 'Support Administratif' : 'Administrative Support'}
                    </h3>
                    <p className="text-sm text-foreground/70 mb-4 leading-relaxed flex-grow">
                      {language === 'fr' 
                        ? 'Assistez avec la paperasse, les dossiers et les tâches de bureau'
                        : 'Assist with paperwork, filing, and office tasks'}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-foreground">
                        3-5h
                      </span>
                      <span className="text-sm text-foreground/60">
                        {language === 'fr' ? 'par semaine' : 'per week'}
                      </span>
                    </div>
                    <Button
                      onClick={() => navigate('/volunteer-schedule')}
                      className={`w-full bg-gradient-to-r ${config.color} hover:brightness-110 hover:shadow-md text-white transition-all duration-200 mt-auto`}
                    >
                      {language === 'fr' ? 'Devenir Bénévole' : 'Become Volunteer'}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          ) : (
            /* Donation Cards for other paths */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {impactItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all">
                    <CardContent className="pt-7 pb-6 px-6 h-full flex flex-col">
                      <h3 className="font-bold text-lg text-foreground mb-2">
                        {language === 'fr' ? item.title_fr : item.title_en}
                      </h3>
                      <p className="text-sm text-foreground/70 mb-4 leading-relaxed flex-grow">
                        {language === 'fr'
                          ? item.description_fr
                          : item.description_en}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-foreground">
                          ${item.suggested_amount}
                        </span>
                        <span className="text-sm text-foreground/60">
                          {item.impact_unit}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleDonate(item)}
                        className={`w-full bg-gradient-to-r ${config.color} hover:brightness-110 hover:shadow-md text-white transition-all duration-200 mt-auto`}
                      >
                        {language === 'fr' ? 'Donner Maintenant' : 'Donate Now'}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              {/* Custom Amount Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: impactItems.length * 0.1 }}
              >
                <Card className={`h-full ${config.bgColor} border-2 ${config.borderColor}`}>
                  <CardContent className="pt-7 pb-6 px-6 h-full flex flex-col">
                    <h3 className="font-bold text-lg text-foreground mb-2">
                      {language === 'fr' ? 'Montant Personnalisé' : 'Custom Amount'}
                    </h3>
                    <p className="text-sm text-foreground/70 mb-4 leading-relaxed flex-grow">
                      {language === 'fr' 
                        ? 'Choisissez votre propre montant pour soutenir cette cause'
                        : 'Choose your own amount to support this cause'}
                    </p>
                    <div className="mb-4">
                      <label className="text-sm font-medium text-foreground/80 block mb-2">
                        {language === 'fr' ? 'Montant ($)' : 'Amount ($)'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">$</span>
                        <Input
                          type="number"
                          placeholder="0"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="pl-7 border-foreground/20 focus:border-primary focus:ring-primary/30"
                          min="1"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        if (customAmount && impactItems[0]) {
                          handleDonate(impactItems[0], parseInt(customAmount));
                          setCustomAmount('');
                        }
                      }}
                      disabled={!customAmount || parseInt(customAmount) < 1}
                      className={`w-full bg-gradient-to-r ${config.color} hover:brightness-110 hover:shadow-md text-white transition-all duration-200 mt-auto`}
                    >
                      {language === 'fr' ? 'Donner maintenant' : 'Donate now'}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </div>

        {/* Community goals (same path) */}
        {pathGoals.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              {language === 'fr'
                ? 'Objectifs Communautaires'
                : 'Community Goals'}
            </h2>
            <CommunityGoals
              onDonate={(goal) => {
                const firstItem = impactItems[0];
                if (firstItem) handleDonate(firstItem);
              }}
            />
          </div>
        )}

        {/* Closing CTA */}
        <Card className={`${config.bgColor} border-2 ${config.borderColor}`}>
          <CardContent className="pt-8 pb-8 px-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {language === 'fr'
                ? 'Votre Soutien Fait la Différence'
                : 'Your Support Makes a Difference'}
            </h3>
            <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
              {language === 'fr'
                ? "Chaque don contribue directement à aider les femmes et les enfants à trouver la sécurité, la guérison et l'espoir. Merci de faire partie de cette mission."
                : 'Every donation directly helps women and children find safety, healing, and hope. Thank you for being part of this mission.'}
            </p>
            {/* <Button
              onClick={() =>
                document
                  .getElementById('ways-to-help')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className={`bg-gradient-to-r ${config.color} hover:brightness-110 hover:shadow-md text-white transition-all duration-200`}
              size="lg"
            >
              {language === 'fr' ? 'Faire un Don' : 'Make a Donation'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
