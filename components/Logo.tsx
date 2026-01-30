'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { logoLetters } from './UI/Letters';

import { Doto } from 'next/font/google'
const doto = Doto({ subsets: ['latin'], weight: '900' })


gsap.registerPlugin(ScrollTrigger);

export default function Logo() {
  const [counter, setCounter] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a long scrollable area to enable endless scrolling
    if (!containerRef.current) return;

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=2520', // Long scroll distance
      scrub: true,
      markers: true, // Enable debug indicators
      onUpdate: (self) => {
        // Calculate counter based on scroll progress
        // self.progress goes from 0 to 1
        const newCounter = Math.round(((self.progress*300)%60))*6;
        setCounter(newCounter);
      },
    });

    return () => {
      scrollTriggerInstance.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-[2520px]">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        {/* <div className="text-8xl font-bold text-gray-900 dark:text-gray-100">
          {counter}
        </div> */}
        <div className="flex justify-center align-center">
          <pre className={`${doto.className} text-[5px]/[6px] md:text-[6px]/[6.5px]
            overflow-x-hidden 
            flex 
            justify-center 
            align-center 
            my-0 
            mx-auto
            pl-0`}>
            {logoLetters[counter]}
          </pre>
        </div>
      </div>
    </div>
  );
}
