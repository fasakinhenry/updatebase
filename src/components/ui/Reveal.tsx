import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  stagger?: number;
  as?: "div" | "ul";
  id?: string;
}

export function Reveal({ children, className, y = 24, delay = 0, stagger = 0.08, as = "div", id }: RevealProps) {
  const ref = useRef<HTMLDivElement | HTMLUListElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = node.children.length > 0 ? Array.from(node.children) : node;

    if (prefersReducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: node,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, node);

    return () => ctx.revert();
  }, [y, delay, stagger]);

  const Tag = as;
  return (
    <Tag ref={ref as never} className={className} id={id}>
      {children}
    </Tag>
  );
}
