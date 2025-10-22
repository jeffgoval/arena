"use client";

import { useEffect } from "react";

export function AnimationObserver() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    const fadeElements = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right");
    fadeElements.forEach((el) => observer.observe(el));

    // Hero parallax effect
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector(".hero-bg") as HTMLElement;
      if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.05}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      fadeElements.forEach((el) => observer.unobserve(el));
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
