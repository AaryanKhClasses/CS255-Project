import { motion } from 'framer-motion'

type HeroProps = {
    isAuthenticated: boolean
}

export default function Hero({ isAuthenticated }: HeroProps) {
    return <div id="hero" className="flex flex-col justify-center text-center h-screen w-[60vw] mx-auto">
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="text-[2rem] font-semibold lg:w-[50%] md:w-[60%] sm:w-[70%] self-center pb-5"
        >A Website to Track Your Expenses Efficiently!</motion.h2>
        <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="text-[1.2rem] md:w-[60%] sm:w-[80%] self-center text-[#ffffffef]"
        >
            {isAuthenticated
                ? 'Welcome! Start tracking your expenses and gain insights into your spending habits.'
                : 'Sign up or login to start tracking your expenses securely. All your data is encrypted and never compromised.'}
        </motion.p>
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="border rounded-xl bg-white text-black cursor-pointer mt-6 p-2 w-[50%] self-center transition-colors ease-in-out"
            onClick={() => document.getElementById(isAuthenticated ? 'add' : 'auth')!.scrollIntoView({ behavior: 'smooth' })}
        >Get Started!</motion.button>
    </div>
}
