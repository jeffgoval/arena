/**
 * Resource Hints Component
 * Preload, prefetch, and preconnect for performance
 */

import { useEffect } from "react";

interface ResourceHintsProps {
  fonts?: string[];
  images?: string[];
  scripts?: string[];
  preconnect?: string[];
  prefetch?: string[];
}

/**
 * Add resource hints to document head
 */
export function ResourceHints({
  fonts = [],
  images = [],
  scripts = [],
  preconnect = [],
  prefetch = [],
}: ResourceHintsProps) {
  useEffect(() => {
    const head = document.head;
    const links: HTMLLinkElement[] = [];

    // Preconnect to external domains
    preconnect.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = url;
      link.crossOrigin = "anonymous";
      head.appendChild(link);
      links.push(link);
    });

    // Preload fonts
    fonts.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "font";
      link.type = "font/woff2";
      link.href = url;
      link.crossOrigin = "anonymous";
      head.appendChild(link);
      links.push(link);
    });

    // Preload critical images
    images.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = url;
      head.appendChild(link);
      links.push(link);
    });

    // Preload scripts
    scripts.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "script";
      link.href = url;
      head.appendChild(link);
      links.push(link);
    });

    // Prefetch resources
    prefetch.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = url;
      head.appendChild(link);
      links.push(link);
    });

    // Cleanup
    return () => {
      links.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [fonts, images, scripts, preconnect, prefetch]);

  return null;
}

/**
 * DNS Prefetch for external domains
 */
export function DNSPrefetch({ domains }: { domains: string[] }) {
  useEffect(() => {
    const head = document.head;
    const links: HTMLLinkElement[] = [];

    domains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = domain;
      head.appendChild(link);
      links.push(link);
    });

    return () => {
      links.forEach((link) => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      });
    };
  }, [domains]);

  return null;
}

/**
 * Preload critical CSS
 */
export function PreloadCSS({ href }: { href: string }) {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "style";
    link.href = href;
    document.head.appendChild(link);

    // Convert to stylesheet after load
    link.onload = () => {
      link.rel = "stylesheet";
    };

    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, [href]);

  return null;
}
