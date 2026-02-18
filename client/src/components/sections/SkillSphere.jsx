import React, { useRef, useEffect, useState, useCallback } from 'react';

function getInitialPositions(count) {
    const positions = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < count; i++) {
        const theta = Math.acos(1 - (2 * (i + 0.5)) / count);
        const phi = (2 * Math.PI * i) / goldenRatio;
        positions.push({
            x: Math.sin(theta) * Math.cos(phi),
            y: Math.sin(theta) * Math.sin(phi),
            z: Math.cos(theta),
        });
    }
    return positions;
}

function rotateX(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
}
function rotateY(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

const SkillSphere = ({ skills }) => {
    const animFrameRef = useRef(null);
    const rotationRef = useRef({ x: 0.4, y: 0 });
    const velocityRef = useRef({ x: 0, y: 0 });
    const isDraggingRef = useRef(false);
    const lastMouseRef = useRef({ x: 0, y: 0 });
    const basePositions = useRef(getInitialPositions(skills.length));
    const [positions, setPositions] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [radius, setRadius] = useState(240);

    // Responsive radius
    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            if (w < 400) setRadius(140);
            else if (w < 640) setRadius(170);
            else if (w < 768) setRadius(200);
            else setRadius(260);
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const computePositions = useCallback(() => {
        const { x: rx, y: ry } = rotationRef.current;
        return basePositions.current.map((p) => rotateY(rotateX(p, rx), ry));
    }, []);

    useEffect(() => {
        let last = performance.now();
        const animate = (now) => {
            const dt = Math.min((now - last) / 16, 3);
            last = now;
            if (!isDraggingRef.current) {
                rotationRef.current.y += 0.004 * dt;
                rotationRef.current.x += velocityRef.current.x;
                rotationRef.current.y += velocityRef.current.y;
                velocityRef.current.x *= 0.90;
                velocityRef.current.y *= 0.90;
            }
            setPositions(computePositions());
            animFrameRef.current = requestAnimationFrame(animate);
        };
        animFrameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, [computePositions]);

    const onPointerDown = (e) => {
        isDraggingRef.current = true;
        velocityRef.current = { x: 0, y: 0 };
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerMove = useCallback((e) => {
        if (!isDraggingRef.current) return;
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        velocityRef.current = { x: dy * 0.004, y: dx * 0.004 };
        rotationRef.current.x += dy * 0.004;
        rotationRef.current.y += dx * 0.004;
        lastMouseRef.current = { x: e.clientX, y: e.clientY };
    }, []);
    const onPointerUp = () => { isDraggingRef.current = false; };

    useEffect(() => {
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };
    }, [onPointerMove]);

    const size = radius * 2 + 100;
    const isMobile = radius < 200;

    return (
        <div
            className="relative select-none cursor-grab active:cursor-grabbing mx-auto"
            style={{ width: size, height: size, maxWidth: '100%' }}
            onPointerDown={onPointerDown}
        >
            {/* Glow */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.18) 0%, rgba(0,212,255,0.07) 45%, transparent 68%)',
                    filter: 'blur(2px)',
                }}
            />
            {/* Wireframe ring */}
            <div className="absolute inset-[25px] rounded-full pointer-events-none"
                style={{
                    border: '1px solid rgba(124,58,237,0.08)',
                    boxShadow: '0 0 60px rgba(124,58,237,0.08) inset',
                }}
            />

            {skills.map((skill, i) => {
                const pt = positions[i];
                if (!pt) return null;

                const depth = (pt.z + 1) / 2;
                const scale = 0.45 + depth * 0.65;
                const opacity = 0.2 + depth * 0.8;
                const zIndex = Math.round(depth * 100);

                const cx = size / 2;
                const cy = size / 2;
                const x = cx + pt.x * radius;
                const y = cy + pt.y * radius;

                const isHovered = hoveredIndex === i;
                const isFront = pt.z > 0.3;

                // Smaller icons on mobile
                const baseSize = isMobile ? 36 : 48;
                const maxSize = isMobile ? 52 : 68;
                const iconContainerSize = isHovered ? maxSize : Math.round(baseSize + depth * (maxSize - baseSize));
                const iconImgSize = Math.round(iconContainerSize * 0.62);

                return (
                    <div
                        key={skill.name}
                        className="absolute flex flex-col items-center gap-1 pointer-events-auto"
                        style={{
                            left: x,
                            top: y,
                            transform: `translate(-50%, -50%) scale(${isHovered ? 1.25 : scale})`,
                            opacity: isHovered ? 1 : opacity,
                            zIndex: isHovered ? 999 : zIndex,
                            transition: 'opacity 0.05s linear',
                            willChange: 'transform, opacity',
                        }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div
                            style={{
                                width: iconContainerSize,
                                height: iconContainerSize,
                                borderRadius: isMobile ? 12 : 18,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isHovered
                                    ? 'rgba(124,58,237,0.28)'
                                    : isFront
                                        ? 'rgba(255,255,255,0.07)'
                                        : 'rgba(255,255,255,0.03)',
                                border: isHovered
                                    ? '1.5px solid rgba(124,58,237,0.7)'
                                    : isFront
                                        ? '1px solid rgba(255,255,255,0.12)'
                                        : '1px solid rgba(255,255,255,0.05)',
                                boxShadow: isHovered
                                    ? '0 0 20px rgba(124,58,237,0.5), 0 0 40px rgba(0,212,255,0.15)'
                                    : isFront ? '0 4px 12px rgba(0,0,0,0.4)' : 'none',
                                backdropFilter: 'blur(6px)',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <img
                                src={skill.icon}
                                alt={skill.name}
                                draggable={false}
                                style={{
                                    width: iconImgSize,
                                    height: iconImgSize,
                                    objectFit: 'contain',
                                    filter: isFront ? 'none' : 'grayscale(40%) brightness(0.7)',
                                }}
                            />
                        </div>

                        {isHovered && (
                            <div
                                className="text-xs font-bold text-white whitespace-nowrap px-2 py-0.5 rounded-lg"
                                style={{
                                    background: 'rgba(124,58,237,0.5)',
                                    border: '1px solid rgba(124,58,237,0.6)',
                                    backdropFilter: 'blur(8px)',
                                    marginTop: 4,
                                }}
                            >
                                {skill.name}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SkillSphere;
