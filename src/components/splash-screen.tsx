
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const title = "INNOVATIVE ENTERPRISES";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 100,
    },
  },
};

const splashScreenVariants = {
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: {
            duration: 0.5,
            ease: "easeIn"
        }
    }
}

export function SplashScreen({ onFinished }: { onFinished: () => void }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, 2500); // Wait for animation to mostly finish
        const finalTimer = setTimeout(onFinished, 3000); // Call onFinished after fade out
        
        return () => {
            clearTimeout(timer);
            clearTimeout(finalTimer);
        };
    }, [onFinished]);

    return (
        <AnimatePresence>
        {show && (
             <motion.div 
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
                variants={splashScreenVariants}
                exit="exit"
             >
                <motion.div
                    className="flex items-center gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Image src="/icon.png" alt="Logo" width={64} height={64} className="w-16 h-16" />
                    <motion.h1
                        className="text-2xl md:text-4xl font-bold tracking-wider text-primary"
                        aria-label={title}
                    >
                        {title.split("").map((char, index) => (
                        <motion.span
                            key={index}
                            variants={letterVariants}
                            className="inline-block"
                        >
                            {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                        ))}
                    </motion.h1>
                </motion.div>
                <motion.div
                    className="absolute bottom-10 text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                >
                    Loading AI Ecosystem...
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
}
