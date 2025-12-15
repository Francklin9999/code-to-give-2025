import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Calendar,
  Newspaper,
  Award,
  Users,
  Heart,
  ArrowRight,
  Clock,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Import local news images
import img2018InternationalWomensDay from '../assets/news/2018-international-womens-day-showcase.jpg';
import img2018InternationalWomensDayGallery1 from '../assets/news/2018-international-womens-day-gallery-1.jpg';
import img2018InternationalWomensDayGallery2 from '../assets/news/2018-international-womens-day-gallery-2.jpg';
import img2018InternationalWomensDayGallery3 from '../assets/news/2018-international-womens-day-gallery-3.jpg';
import img2018UnitedNationsDelegation from '../assets/news/2018-united-nations-delegation.jpg';
import img2018UnitedNationsDelegationGallery1 from '../assets/news/2018-united-nations-delegation-gallery-1.jpg';
import img2018VolunteerTraining from '../assets/news/2018-volunteer-training.jpg';
import img2018VolunteerTrainingGallery1 from '../assets/news/2018-volunteer-training-gallery-1.jpg';
import img2018VolunteerTrainingGallery2 from '../assets/news/2018-volunteer-training-gallery-2.jpg';
import img2018VolunteerTrainingGallery3 from '../assets/news/2018-volunteer-training-gallery-3.jpg';
import img2018VolunteerTrainingGallery4 from '../assets/news/2018-volunteer-training-gallery-4.jpg';
import img2017AnnualArtAuction from '../assets/news/2017-annual-art-auction.jpg';
import img2017MontrealAlouettes from '../assets/news/2017-montreal-alouettes.jpg';
import img2017CityOfLavalDonation from '../assets/news/2017-city-of-laval-donation.jpg';
import img2017SwingIntoSpring from '../assets/news/2017-swing-into-spring.jpg';
import img2017AvonCanadaDonation from '../assets/news/2017-avon-canada-donation.jpg';

const newsItems = [
  {
    id: '2018-international-womens-day-showcase',
    type: 'event',
    title: 'International Women\'s Day Creative Art Showcase',
    date: 'March 22, 2018',
    category: 'Community Event',
    description:
      'The Shield of Athena Family Services would like to invite you to our event in honour of International Women\'s Day that will be held on the 22nd of March. The event will showcase the art of women victims of conjugal and family violence that has been done in creative art therapy groups. There will also be a presentation of work done by participants in various women\'s centers such as, Le Centre dynamique des femmes de Laval, l\'Association du troisieme age Filia and others. It would be lovely to see you there. As space is limited please RSVP with the number of people coming.',
    image: img2018InternationalWomensDay,
    gallery: [
      img2018InternationalWomensDayGallery1,
      img2018InternationalWomensDayGallery2,
      img2018InternationalWomensDayGallery3
    ]
  },
  {
    id: '2018-united-nations-delegation',
    type: 'recognition',
    title: 'Canadian Women\'s Delegation Presents at the UN',
    date: 'March 14, 2018',
    category: 'Recognition',
    description:
      'We are so proud of our Executive Director, Melpa Kamateros, and Co-ordinator, Maud Pontel, for being part of the Canadian Women\'s Delegation and presenting on "Equality for Rural & remote Women in Canada" for the sixty-second session of the Commission on the Status of Women taking place at the United Nations Headquarters in New York from 12 to 23 March 2018.',
    image: img2018UnitedNationsDelegation,
    gallery: [img2018UnitedNationsDelegationGallery1]
  },
  {
    id: '2018-volunteer-training',
    type: 'news',
    title: 'Volunteer Training Workshop',
    date: 'February 08, 2018',
    category: 'Community Support',
    description:
      'Thank you to all the participants of this year volunteer training workshop and your enthusiasm to volunteer your time and help out for the benefit of women and children victims of abuse.',
    image: img2018VolunteerTraining,
    gallery: [
      img2018VolunteerTrainingGallery1,
      img2018VolunteerTrainingGallery2,
      img2018VolunteerTrainingGallery3,
      img2018VolunteerTrainingGallery4
    ]
  },
  {
    id: '2017-annual-art-auction',
    type: 'event',
    title: '23rd Annual Art Auction Thanks to Supporters',
    date: 'November 13, 2017',
    category: 'Fundraising',
    description:
      'We would like to thank Madame Sophie Gregoire Trudeau for her ongoing support and for the lovely wishes she sent us for our 23rd Annual Art auction. Thank you to Elias Makos and Breakfast Television, Global Television, and The Suburban for their support of our cause. The Shield\'s 23rd Annual Art Auction was a great event for a great cause. Thank you to everyone who supports us!',
    image: img2017AnnualArtAuction
  },
  {
    id: '2017-montreal-alouettes',
    type: 'news',
    title: 'Montreal Alouettes Workplace Presentation',
    date: 'October 31, 2017',
    category: 'Community Outreach',
    description:
      'Thank you to the Montreal Alouettes for inviting us to speak about family violence and its consequences even in the workplace. It was great to also present again with CFL player J.R. Larose.',
    image: img2017MontrealAlouettes
  },
  {
    id: '2017-city-of-laval-donation',
    type: 'news',
    title: 'City of Laval Donates $200,000',
    date: 'June 09, 2017',
    category: 'Partnership',
    description:
      'Thank you to the city of Laval for their amazing support and donation of $200,000 for the establishment of a 2nd step shelter for victims of family violence.',
    image: img2017CityOfLavalDonation,
    link: 'http://www.lechodelaval.ca/actualites/politique/314672/200000$-de-soutien-pour-projet-le-bouclier-dathena'
  },
  {
    id: '2017-swing-into-spring',
    type: 'event',
    title: '"Swing into Spring" at the Rialto Theatre',
    date: 'May 19, 2017',
    category: 'Campaign Launch',
    description:
      'Close to 240 people were gathered at the Shield of Athena\'s "Swing into Spring" event at the historic Rialto Theatre. The fabulous show, coordinated by Sheldon Kagan and replete with a Las Vegas dance, song, and musical revue, launched the beginning of the Capital Campaign for the new Second Step Resource for women and children in Laval.',
    image: img2017SwingIntoSpring,
    link: 'https://www.youtube.com/watch?v=gUE3mZEhjp8&feature=youtu.be'
  },
  {
    id: '2017-avon-canada-donation',
    type: 'news',
    title: 'Avon Canada Helps Replace Stolen Van',
    date: 'April 14, 2017',
    category: 'Partnership',
    description:
      'A special thank you to the Avon Team once again for their generosity, in particular Goran Petrovic, Natalie Laurence, and Elizabeth Munro. This was truly an unforgettable day as Avon Canada helped the Shield of Athena secure a new van for services to women and children.',
    image: img2017AvonCanadaDonation
  }
];

export default function News() {
  const [activeTab, setActiveTab] = useState('all');

  const upcomingEvents = [];

  const sortedItems = [...newsItems].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const filteredItems = sortedItems.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'events') return item.type === 'event';
    if (activeTab === 'news') return item.type === 'news';
    if (activeTab === 'recognition') return item.type === 'recognition';
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-dark via-primary to-secondary py-20 md:py-24">
        <div className="max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/90 mb-6 shadow-lg">
              <Newspaper className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              News & Events
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Stay updated with our latest achievements, upcoming events, and community news
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-40 bg-background border-b border-foreground/10 shadow-sm">
        <div className="max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto py-4">
            {[
              { id: 'all', label: 'All', icon: Newspaper },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'news', label: 'Updates', icon: Users },
              { id: 'recognition', label: 'Recognition', icon: Award }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-md'
                      : 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Sidebar Cards - At the top */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="p-6 text-center pt-3">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Our Impact
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-2xl text-foreground">1,229</p>
                    <p className="text-sm text-foreground/70">
                      Clients helped annually
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-2xl text-foreground">34</p>
                    <p className="text-sm text-foreground/70">
                      Years of service
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events Summary */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <CardContent className="p-6 text-center pt-3">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Upcoming Events
                </h3>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Link key={event.id} to={event.link || '#'}>
                    <div className="bg-purple-200 hover:bg-purple-300 p-3 rounded-lg transition-colors cursor-pointer border border-purple-300">
                      <p className="font-semibold text-foreground text-sm mb-1">{event.title}</p>
                      <p className="text-xs text-foreground/70">{event.date}</p>
                    </div>
                  </Link>
                ))}
                {upcomingEvents.length === 0 && (
                  <p className="text-sm text-foreground/60">
                    No upcoming events
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Newsletter Signup */}
          <Card className="bg-gradient-to-br from-primary to-secondary text-white">
            <CardContent className="p-6 text-center pt-3">
              <h3 className="text-lg font-bold mb-2">
                Stay Updated
              </h3>
              <p className="text-white/80 text-sm mb-4">
                Subscribe to our newsletter for the latest news and events
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-center"
                />
                <Button className="w-full bg-white !text-gray-900 hover:bg-gray-100 font-semibold">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => {
            const isFeatured = idx === 0 && activeTab === 'all';
            const Icon =
              item.type === 'event'
                ? Calendar
                : item.type === 'recognition'
                ? Award
                : Newspaper;
            const isEvent = item.type === 'event';
            const isRecognition = item.type === 'recognition';

            const isInternalLink = item.link && item.link.startsWith('/');
            const CardWrapper = isInternalLink ? Link : 'div';
            const cardProps = isInternalLink && item.link ? { to: item.link } : {};

            const badgeClasses = isEvent
              ? 'bg-primary text-white'
              : isRecognition
              ? 'bg-yellow-100 text-yellow-900'
              : 'bg-white/90 text-primary';
            const badgeIconColor = isEvent
              ? 'text-white'
              : isRecognition
              ? 'text-yellow-800'
              : 'text-primary';

            const handleExternalNav = (e) => {
              if (isInternalLink || !item.link) {
                return;
              }
              if (e) {
                e.preventDefault();
              }
              if (typeof window !== 'undefined') {
                window.open(item.link, '_blank', 'noopener,noreferrer');
              }
            };

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={isFeatured ? 'md:col-span-2 lg:col-span-2 m-3' : ''}
              >
                <CardWrapper {...cardProps}>
                  <Card
                    className={`overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group ${
                      item.link ? 'cursor-pointer' : ''
                    } ${isEvent ? 'border-2 border-primary/40 bg-primary/5' : ''}`}
                    onClick={handleExternalNav}
                  >
                    {item.image && (
                      <div 
                        className="relative h-48 md:h-56 overflow-hidden bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                        style={{ backgroundImage: `url(${item.image})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <div className={`flex items-center gap-2 px-3 py-1.5 backdrop-blur-sm rounded-full ${badgeClasses}`}>
                            <Icon className={`w-4 h-4 ${badgeIconColor}`} />
                            <span className="text-xs font-semibold">
                              {item.category || 'Event'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex-1 pt-4">
                        <div className="flex items-center gap-2 mb-3 text-sm text-foreground/60">
                          <Clock className="w-4 h-4" />
                          <span>{item.date}</span>
                        </div>
                        <h3 className={`font-bold text-foreground mb-3 group-hover:text-primary transition-colors ${isFeatured ? 'text-2xl' : 'text-xl'}`}>
                          {item.title}
                        </h3>
                        <p className={`text-foreground/70 leading-relaxed mb-4 ${isFeatured ? 'text-base' : 'text-sm'} line-clamp-3`}>
                          {item.description}
                        </p>
                      </div>
                      {item.link && (
                        <Button 
                          variant="outline" 
                          className={`w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors ${
                            isEvent ? 'border-primary text-primary hover:bg-primary hover:text-white' : ''
                          }`}
                          onClick={handleExternalNav}
                        >
                          Learn More
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </CardWrapper>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-gradient-to-r from-primary-dark via-primary to-secondary">
        <div className="max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get Involved
          </h2>
          <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
            Join us in supporting women and children affected by family violence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/find-your-path">
              <Button
                size="lg"
                className="bg-highlight text-foreground hover:bg-highlight/95 flex items-center gap-2 shadow-primary-dark-glow hover:shadow-primary-dark-glow border-2 border-primary-dark hover:scale-[1.02] transition-all"
              >
                Find Your Path
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/services">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 flex items-center gap-2"
              >
                Learn About Our Services
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

