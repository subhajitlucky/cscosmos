import React from 'react';
import { notFound } from 'next/navigation';
import { Layout } from '@/components/visualizers/websecureviz/components/Layout';
import Home from '@/components/visualizers/websecureviz/pages/Home';
import BrowserSecurity from '@/components/visualizers/websecureviz/pages/BrowserSecurity';
import Cors from '@/components/visualizers/websecureviz/pages/Cors';
import Xss from '@/components/visualizers/websecureviz/pages/Xss';
import Csrf from '@/components/visualizers/websecureviz/pages/Csrf';
import Csp from '@/components/visualizers/websecureviz/pages/Csp';
import Exercises from '@/components/visualizers/websecureviz/pages/Exercises';
import Simulations from '@/components/visualizers/websecureviz/pages/Simulations';
import About from '@/components/visualizers/websecureviz/pages/About';

export function generateStaticParams() {
    return [
        { slug: [] },
        { slug: ['browser-security'] },
        { slug: ['cors'] },
        { slug: ['xss'] },
        { slug: ['csrf'] },
        { slug: ['csp'] },
        { slug: ['exercises'] },
        { slug: ['simulations'] },
        { slug: ['about'] },
    ];
}

export default async function WebSecurityPage({ params }: { params: Promise<{ slug?: string[] }> }) {
    const { slug } = await params;
    const subRoute = slug && slug.length > 0 ? slug[0] : '';

    let content = <Home />;

    if (subRoute === 'browser-security') {
        content = <BrowserSecurity />;
    } else if (subRoute === 'cors') {
        content = <Cors />;
    } else if (subRoute === 'xss') {
        content = <Xss />;
    } else if (subRoute === 'csrf') {
        content = <Csrf />;
    } else if (subRoute === 'csp') {
        content = <Csp />;
    } else if (subRoute === 'exercises') {
        content = <Exercises />;
    } else if (subRoute === 'simulations') {
        content = <Simulations />;
    } else if (subRoute === 'about') {
        content = <About />;
    } else if (subRoute !== '') {
        notFound();
    }

    return (
        <Layout>
            {content}
        </Layout>
    );
}
