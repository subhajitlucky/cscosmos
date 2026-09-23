import { ImageResponse } from 'next/og';

export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

const STEP_TITLES: Record<string, string> = {
    'what-is-a-program': 'What Is a Program?',
    'cpu-basics': 'CPU Basics',
    'instruction-cycle': 'Instruction Execution Cycle',
    'memory-basics': 'Memory Basics',
    'memory-layout': 'Program Memory Layout',
    'io-basics': 'Input / Output (I/O)',
    'execution-summary': 'Complete Program Execution',
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const step = searchParams.get('step') ?? '';
    const stepTitle = STEP_TITLES[step];

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '80px',
                    background: 'linear-gradient(135deg, #020617 0%, #0f172a 55%, #1e3a8a 100%)',
                    color: '#f8fafc',
                    fontFamily: 'sans-serif',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 12,
                            background: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 28,
                            fontWeight: 700,
                        }}
                    >
                        PV
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 600, color: '#94a3b8' }}>ProgramViz</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 48 }}>
                    <div style={{ fontSize: stepTitle ? 40 : 72, fontWeight: 800, lineHeight: 1.15 }}>
                        {stepTitle ?? 'How Programs Execute'}
                    </div>
                    {!stepTitle && (
                        <div style={{ fontSize: 36, fontWeight: 700, color: '#60a5fa', marginTop: 8 }}>
                            CPU · Memory · I/O
                        </div>
                    )}
                    <div style={{ fontSize: 26, color: '#94a3b8', marginTop: 24, maxWidth: 900 }}>
                        {stepTitle
                            ? 'An interactive step of the program execution learning path.'
                            : 'A visual, step-by-step guide from source code to CPU instructions, memory, and I/O.'}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto', fontSize: 24, color: '#64748b' }}>
                    <span style={{ color: '#60a5fa', fontWeight: 700 }}>CSCosmos</span>
                    <span>·</span>
                    <span>Interactive CS Visualizers</span>
                </div>
            </div>
        ),
        size
    );
}
