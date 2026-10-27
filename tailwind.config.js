import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                midnight: "var(--bg)",
                surface: "var(--card-bg)",
                glass: "var(--card-border)",
                'body-text': "var(--text-primary)",
                'muted-text': "var(--text-secondary)",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                    border: "var(--card-border, hsl(var(--border)))",
                },
                redis: {
                    light: '#FF4438',
                    DEFAULT: '#D82C20',
                    dark: '#A51D14',
                },
                react: {
                    light: '#61dafb',
                    DEFAULT: '#00d8ff',
                    dark: '#01579b',
                },
                space: {
                    950: '#050507',
                    900: '#0a0a0c',
                    800: '#111114',
                    700: '#1b1b1f',
                },
                mongo: {
                    green: '#00ED64',
                    grassy: '#00ED64',
                    dark: '#001E2B',
                    slate: '#00684A',
                    charcoal: '#3F4F5A'
                },
                syntax: {
                    key: '#E06C75',
                    string: '#98C379',
                    number: '#D19A66',
                    boolean: '#56B6C2'
                },
                brand: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                },
                evm: {
                    stack: '#38bdf8',
                    memory: '#34d399',
                    storage: '#fbbf24',
                    calldata: '#a78bfa',
                    success: '#10b981',
                    error: '#ef4444',
                    // FS-85: the EvmInternals engine styles itself with these. The
                    // `/ <alpha-value>` placeholder is load-bearing: Tailwind 3 leaves
                    // an opacity modifier such as `bg-evm-accent/10` with *no rule at
                    // all* when the colour is a bare `hsl(var(--x))`, which is how all
                    // 79 of this engine's palette classes shipped dead. The custom
                    // properties are HSL triples defined in src/index.css (:root and
                    // .dark). `accent` is the bright fill (near-black text sits on
                    // it); `accent-text` is the readable text role on white / tints.
                    accent: 'hsl(var(--evm-accent) / <alpha-value>)',
                    'accent-text': 'hsl(var(--evm-accent-text) / <alpha-value>)',
                    gas: 'hsl(var(--evm-gas) / <alpha-value>)',
                    bg: 'hsl(var(--evm-bg) / <alpha-value>)',
                },
            },
            boxShadow: {
                glow: 'var(--shadow-glow)',
                glass: 'var(--shadow-surface)',
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                'gradient-move': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                'gradient-move': 'gradient-move 16s ease infinite',
            },
        },
    },
    // FS-51: 62 `animate-in` / `animate-out` utilities were already written across 40 files
    // (including the shared `ui/dropdown-menu` primitive) but emitted nothing, because the
    // plugin that defines them was never installed. This plugin adds only utilities — no base
    // or global styles — so nothing that did not already ask for one of these classes can
    // change. `@tailwindcss/typography` (`prose`, 22 usages in 9 engines) is deliberately
    // still absent: it *does* set its own text colours, so it needs a contrast pass rather
    // than an install, and it is recorded as such in the audit.
    plugins: [tailwindcssAnimate],
}
