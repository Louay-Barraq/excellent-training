import { motion } from 'framer-motion';

const pageVariants = {
    initial: { opacity: 0, y: 10 },
    enter: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.18, ease: [0.61, 1, 0.88, 1] },
    },
};

// key is provided by the parent (App.jsx) to force full remount on navigation
const AnimatedPage = ({ children }) => (
    <motion.div
        variants={pageVariants}
        initial="initial"
        animate="enter"
        className="w-full h-full"
    >
        {children}
    </motion.div>
);

export default AnimatedPage;
