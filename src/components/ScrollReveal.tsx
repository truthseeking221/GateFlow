import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function ScrollReveal({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)', scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
}
