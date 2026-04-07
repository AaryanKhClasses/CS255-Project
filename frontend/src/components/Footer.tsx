import { motion } from 'framer-motion'

export default function Footer() {
    return <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-6 mt-12 text-center"
    >
        <a
            href="https://github.com/AaryanKhClasses"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#ffffff80] hover:text-[#ffffffcc] transition-colors duration-200"
        >&copy; 2026 AaryanKh. All rights reserved.</a>
    </motion.div>
}
