import type { ReactNode, FC } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
    children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <div className="blockviz-theme min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
};