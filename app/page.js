"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import { faqsData, featuresData, howItWorksData, testimonialsData } from "@/data/landing.js";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import Lenis from 'lenis';

export default function Home() {

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    // Fetch the visit count on page load
    fetch('/api/visits', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => setVisitCount(data.visits));

    // Increment the visit count
    fetch('/api/visits', { method: 'POST' }).catch((err) => console.error(err));
  }, []);

  // const [showKFormat, setShowKFormat] = useState(false);
  const [showMFormat, setShowMFormat] = useState(false);
  const [showPercent, setShowPercent] = useState(false);
  const [showRating, setShowRating] = useState(false);

  const { ref: refV, inView: inViewV } = useInView({ triggerOnce: true });
  // const { ref: refK, inView: inViewK } = useInView({ triggerOnce: true });
  const { ref: refM, inView: inViewM } = useInView({ triggerOnce: true });
  const { ref: refUptime, inView: inViewUptime } = useInView({ triggerOnce: true });
  const { ref: refRating, inView: inViewRating } = useInView({ triggerOnce: true });

  return (<div className="mt-40">
    <Hero />
    <section className="py-20 bg-background_secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div ref={refV} className="text-center">
            <div className="text-4xl font-bold text-main mb-2">
              {inViewV && (<CountUp start={0} end={visitCount} duration={3} />)}
            </div>
            <div className="text-subtext">Times Visited</div>
          </div>
          {/* <div ref={refK} className="text-center">
            <div className="text-4xl font-bold text-main mb-2">
              {inViewK && !showKFormat ? (<CountUp end={51234} duration={3} onEnd={() => setShowKFormat(true)} />) : (showKFormat && "50K+")}
            </div>
            <div className="text-subtext">Active Users</div>
          </div> */}
          <div ref={refM} className="text-center">
            <div className="text-4xl font-bold text-main mb-2">
              {inViewM && !showMFormat ? (<CountUp className="md:text-4xl text-3xl" start={0} end={2001234} duration={6} prefix="₹" separator="," onEnd={() => setShowMFormat(true)} />) : (showMFormat && "₹2M+")}
            </div>
            <div className="text-subtext">Transactions Tracked</div>
          </div>
          <div ref={refUptime} className="text-center">
            <div className="text-4xl font-bold text-main mb-2">
              {inViewUptime && !showPercent ? (<CountUp start={0} end={99.9} decimals={1} suffix="%" duration={3} onEnd={() => setShowPercent(true)} />) : (showPercent && "99.9%")}
            </div>
            <div className="text-subtext">Uptime</div>
          </div>
          <div ref={refRating} className="text-center">
            <div className="text-4xl font-bold text-main mb-2">
              {inViewRating && !showRating ? (<CountUp start={0} end={4.9} decimals={1} suffix="/5" duration={3} onEnd={() => setShowRating(true)} />) : (showRating && "4.9/5")}
            </div>
            <div className="text-subtext">User Rating</div>
          </div>
        </div>
      </div>
    </section>
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text-small">Everything you need to manage your finances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{featuresData.map((feature, index) =>
          feature.title === "Multi-Currency" ? (
            <Card key={index} className='p-6 bg-background_secondary border-util_color'>
              <CardContent className='space-y-4 pt-4'>
                <div className="w-16 h-16 bg-util_color_2 rounded-full flex items-center justify-center mx-auto mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-main">{feature.title}</h3>
                <p className="text-subtext">{feature.description}</p>
                <div className="flex justify-end">
                  <div className="flex flex-row gap-1 items-center bg-background_secondary border-[1.75px] border-background text-background text-[12px] font-bold py-1.5 px-4 rounded-full uppercase tracking-wide">
                    <Image src="/coming_soon.svg" alt="Coming soon" height={20} width={20} />
                    <span>Coming Soon</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) :
            (<Card key={index} className='p-6 bg-background_secondary border-util_color'>
              <CardContent className='space-y-4 pt-4'>
                <div className="w-16 h-16 bg-util_color_2 rounded-full flex items-center justify-center mx-auto mb-6">{feature.icon}</div>
                <h3 className="text-xl text-center font-semibold text-main">{feature.title}</h3>
                <p className="text-subtext text-left">{feature.description}</p>
              </CardContent>
            </Card>
            ))}
        </div>
      </div>
    </section>
    <section className="py-20 bg-background_secondary" id="how-it-works">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text-small">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{howItWorksData.map((step, index) => (
          <div key={index} className="text-center">
            <div className="w-16 h-16 bg-util_color_2 rounded-full flex items-center justify-center mx-auto mb-6">{step.icon}</div>
            <h3 className="text-xl font-semibold text-main mb-4">{step.title}</h3>
            <p className="text-subtext">{step.description}</p>
          </div>
        ))}
        </div>
      </div>
    </section>
    {/* <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="gradient-text-small text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{testimonialsData.map((testimonial, index) => (
          <Card key={index} className='p-6 bg-background_secondary border-util_color'>
            <CardContent className='pt-4'>
              <div className="flex items-center mb-4">
                <Image src={testimonial.image} alt={testimonial.name} width={40} height={40} className="rounded-full" />
                <div className="ml-4">
                  <div className="font-semibold text-main">{testimonial.name}</div>
                  <div className="text-sm text-subtext">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-subtext">{testimonial.quote}</p>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>
    </section> */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="gradient-text-small text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div>
          <Accordion type="single" collapsible className="flex flex-col gap-6 mx-10">
            {faqsData.map((faq, index) => (
              <div className="py-2 p-10 border border-util_color rounded-2xl w-full" key={index}>
                <AccordionItem value={faq.number}>
                  <AccordionTrigger className='text-main/80 font-semibold text-[20px] leading-[28px]'>{faq.question}</AccordionTrigger>
                  <AccordionContent className='text-subtext text-[16px] leading-[24px] font-normal'>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
    <section className="py-20 bg-background_secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-center gradient-text-small mb-4">Ready to Take Control of Your Finances?</h2>
        <p className="text-subtext mb-8 max-w-2xl mx-auto">Whether you&apos;re organizing your budget or planning for the future, FinSync brings everything together to help you stay financially on track.</p>
        <Link href="/dashboard">
          <Button size="lg" variant="outline" className="text-main border-util_color hover:bg-main hover:text-background hover:border-background animate-bounce">Start Free Trial</Button>
        </Link>
      </div>
    </section>
  </div>);
}
