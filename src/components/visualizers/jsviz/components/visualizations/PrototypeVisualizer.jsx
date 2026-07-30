'use client';
import React, { useEffect } from 'react';
import anime from 'animejs';

const PrototypeVisualizer = ({ chain }) => {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const animeFn = (anime && anime.default) || anime;
        if (typeof animeFn !== 'function') return;
        // Node entry
        animeFn({
            targets: '.proto-node',
            translateY: [50, 0],
            opacity: [0, 1],
            scale: [0.9, 1],
            delay: (animeFn.stagger || anime.stagger)(200),
            easing: 'easeOutElastic(1, .8)'
        });

        // Connector pulse
        animeFn({
            targets: '.proto-line',
            opacity: [0.2, 1],
            duration: 1000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutQuad',
            delay: (animeFn.stagger || anime.stagger)(200)
        });
    }, [chain]);

    return (
        <div className="h-full w-full p-8 flex flex-col items-center overflow-y-auto relative" style={{ backgroundColor: 'transparent' }}>
            <style>{`
                .proto-node {
                    background: var(--bg-surface);
                    border: 3px solid #14b8a6;
                    border-radius: 16px;
                    padding: 16px 32px;
                    min-width: 200px;
                    text-align: center;
                    position: relative;
                    z-index: 2;
                    box-shadow: 0 10px 20px rgba(20, 184, 166, 0.1);
                }
                .node-title {
                    font-family: 'JetBrains Mono', monospace;
                    font-weight: 900;
                    font-size: 14px;
                    color: var(--text-main);
                }
                .proto-line {
                    width: 4px;
                    height: 40px;
                    background: #14b8a6;
                    margin: -2px 0;
                    position: relative;
                    z-index: 1;
                }
                .proto-line::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 50%;
                    transform: translateX(-50%);
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-top: 10px solid #14b8a6;
                }
                .link-label {
                    position: absolute;
                    right: -110px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 9px;
                    font-family: monospace;
                    color: #14b8a6;
                    background: rgba(20, 184, 166, 0.05);
                    padding: 4px 10px;
                    border-radius: 99px;
                    border: 1px solid rgba(20, 184, 166, 0.2);
                    white-space: nowrap;
                }
            `}</style>

            <div className="self-start mb-12 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_10px_teal]"></div>
                <h3 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">Delegation_Chain_Mapper</h3>
            </div>

            <div className="flex flex-col items-center">
                {chain.map((level, i) => (
                    <React.Fragment key={i}>
                        <div className="proto-node">
                            <div className="node-title">{level}</div>
                            <div className="text-[8px] text-gray-400 mt-1 uppercase">[[Internal_Slot]]</div>
                            {i < chain.length - 1 && (
                                <div className="link-label">points_to_parent</div>
                            )}
                        </div>
                        {i < chain.length - 1 && <div className="proto-line"></div>}
                    </React.Fragment>
                ))}
            </div>

            <div className="mt-12 p-6 border-2 border-dashed border-teal-500/20 rounded-xl max-w-sm">
                <p className="text-[10px] font-mono text-gray-400 text-center leading-relaxed">
                    Property lookup walks UP the chain. If a key isn't found, the engine follows the link to the parent until it hits NULL.
                </p>
            </div>
        </div>
    );
};

export default PrototypeVisualizer;
