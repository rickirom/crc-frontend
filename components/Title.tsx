'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
//  GSAP Stuff
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitText from "gsap/SplitText";

gsap.registerPlugin(useGSAP);

export default function Header() {
  const title = useRef<HTMLDivElement>(null);

  return (
    <div className="">
    
    </div>
  )
}