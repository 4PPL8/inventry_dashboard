import { useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({
    showSpinner: false,
    trickleSpeed: 200,
    minimum: 0.08,
    easing: 'ease',
    speed: 500
});

const LoadingBar = () => {
    useEffect(() => {
        // Start loading bar on mount
        NProgress.start();

        // Complete loading bar on unmount
        return () => {
            NProgress.done();
        };
    }, []);

    return null;
};

// Export functions for manual control
export const startLoading = () => NProgress.start();
export const stopLoading = () => NProgress.done();
export const incrementLoading = () => NProgress.inc();

export default LoadingBar;
