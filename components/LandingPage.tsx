import React, { useEffect, useState, useRef } from 'react';
import {
    GraduationCap,
    Calendar,
    Users,
    BarChart3,
    TrendingUp,
    Award,
    Zap,
    ChevronDown,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Activity,
    Target
} from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);

    // Track mouse position for parallax effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (window.innerWidth > 768) {
                setMousePosition({
                    x: (e.clientX / window.innerWidth - 0.5) * 20,
                    y: (e.clientY / window.innerHeight - 0.5) * 20
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Track scroll position
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen" style={{ background: 'var(--color-bg-primary)', position: 'relative', zIndex: 2 }}>

            {/* Navigation */}
            <nav
                className="fixed top-0 left-0 right-0 z-50 glass-dark-strong"
                style={{
                    borderBottom: '1px solid rgba(99, 102, 241, 0.1)'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3 animate-fade-in-down">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center glow-indigo"
                                style={{
                                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                                }}
                            >
                                <GraduationCap className="text-white" size={26} />
                            </div>
                            <span
                                className="text-2xl font-black tracking-tight"
                                style={{ color: 'var(--color-text-primary)' }}
                            >
                                NexLink SA
                            </span>
                        </div>

                        <button
                            onClick={onGetStarted}
                            className="magnetic-hover animate-fade-in-down delay-200"
                            style={{
                                padding: '12px 32px',
                                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                color: 'white',
                                borderRadius: '16px',
                                fontWeight: '700',
                                fontSize: '15px',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)',
                                transition: 'all 0.3s var(--ease-smooth)'
                            }}
                        >
                            Experience the System
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Fullscreen Immersive */}
            <section
                ref={heroRef}
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
                style={{ paddingTop: '80px' }}
            >
                {/* Animated Background */}
                <div
                    className="absolute inset-0 animate-liquid"
                    style={{
                        background: 'linear-gradient(135deg, #0B0D10, #1a1d35, #0f1628, #0B0D10)',
                        opacity: 0.9
                    }}
                />

                {/* Floating Orbs */}
                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse-gentle"
                    style={{
                        background: 'radial-gradient(circle, #6366F1, transparent)',
                        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
                    }}
                />
                <div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse-gentle delay-500"
                    style={{
                        background: 'radial-gradient(circle, #06B6D4, transparent)',
                        transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`
                    }}
                />

                {/* Floating Dashboard Fragments */}
                <div
                    className="absolute top-20 right-10 glass-dark p-4 rounded-2xl animate-float will-animate hidden md:block"
                    style={{
                        transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                            <TrendingUp size={20} style={{ color: 'var(--color-emerald-bright)' }} />
                        </div>
                        <div>
                            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Attendance</div>
                            <div className="text-lg font-black" style={{ color: 'var(--color-emerald-bright)' }}>94.2%</div>
                        </div>
                    </div>
                </div>

                <div
                    className="absolute bottom-32 left-10 glass-dark p-4 rounded-2xl animate-float-delayed will-animate hidden md:block"
                    style={{
                        transform: `translate(${-mousePosition.x * 0.3}px, ${-mousePosition.y * 0.3}px)`,
                        border: '1px solid rgba(6, 182, 212, 0.2)'
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(6, 182, 212, 0.2)' }}>
                            <Activity size={20} style={{ color: 'var(--color-cyan-bright)' }} />
                        </div>
                        <div>
                            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Active Users</div>
                            <div className="text-lg font-black" style={{ color: 'var(--color-cyan-bright)' }}>1,247</div>
                        </div>
                    </div>
                </div>

                <div
                    className="absolute top-1/3 right-1/4 glass-dark p-3 rounded-xl animate-float will-animate hidden lg:block"
                    style={{
                        transform: `translate(${mousePosition.x * 0.7}px, ${mousePosition.y * 0.7}px)`,
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        animationDelay: '1s'
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Award size={18} style={{ color: 'var(--color-violet-muted)' }} />
                        <span className="text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>Top Rated</span>
                    </div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 animate-fade-in-down glass-dark"
                        style={{
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            color: 'var(--color-indigo-bright)'
                        }}
                    >
                        <Sparkles size={16} />
                        <span className="text-sm font-bold tracking-wide">The Future of School Management</span>
                    </div>

                    <h1
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tighter animate-fade-in-up delay-200"
                        style={{
                            color: 'var(--color-text-primary)',
                            textShadow: '0 0 80px rgba(99, 102, 241, 0.3)'
                        }}
                    >
                        Education
                        <br />
                        <span className="text-gradient-indigo">Reimagined</span>
                    </h1>

                    <p
                        className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-400"
                        style={{
                            color: 'var(--color-text-secondary)',
                            fontWeight: '500'
                        }}
                    >
                        A silent revolution in school communication. Intelligent, elegant, and built for the future of South African education.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-600">
                        <button
                            onClick={onGetStarted}
                            className="magnetic-hover group"
                            style={{
                                padding: '18px 48px',
                                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                color: 'white',
                                borderRadius: '20px',
                                fontWeight: '700',
                                fontSize: '18px',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 0 40px rgba(99, 102, 241, 0.4)',
                                transition: 'all 0.4s var(--ease-elegant)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                        >
                            See it in Motion
                            <ArrowRight
                                size={20}
                                style={{
                                    transition: 'transform 0.3s var(--ease-smooth)'
                                }}
                                className="group-hover:translate-x-1"
                            />
                        </button>
                    </div>

                    {/* Scroll Indicator */}
                    <div
                        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-pulse-gentle"
                        style={{
                            opacity: scrollY > 100 ? 0 : 1,
                            transition: 'opacity 0.5s var(--ease-smooth)'
                        }}
                    >
                        <ChevronDown size={32} style={{ color: 'var(--color-text-muted)' }} />
                    </div>
                </div>
            </section>

            {/* Section 1: The Problem */}
            <section
                className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative"
                style={{
                    background: `linear-gradient(to bottom, var(--color-bg-primary), ${scrollY > 800 ? '#080a0d' : 'var(--color-bg-primary)'})`,
                    transition: 'background 1s var(--ease-slow)'
                }}
            >
                <div className="max-w-5xl mx-auto text-center">
                    <h2
                        className="text-5xl md:text-7xl lg:text-8xl font-black mb-12 leading-tight tracking-tighter"
                        style={{
                            color: 'var(--color-text-primary)',
                            opacity: scrollY > 300 ? 1 : 0,
                            transform: scrollY > 300 ? 'translateY(0)' : 'translateY(40px)',
                            transition: 'all 1.2s var(--ease-slow)'
                        }}
                    >
                        Schools deserve
                        <br />
                        <span className="text-gradient-cyan">better tools</span>
                    </h2>

                    <p
                        className="text-2xl md:text-3xl leading-relaxed max-w-3xl mx-auto"
                        style={{
                            color: 'var(--color-text-secondary)',
                            fontWeight: '500',
                            opacity: scrollY > 400 ? 1 : 0,
                            transform: scrollY > 400 ? 'translateY(0)' : 'translateY(40px)',
                            transition: 'all 1.2s var(--ease-slow) 0.2s'
                        }}
                    >
                        Fragmented systems. Endless spreadsheets. Communication chaos.
                        <br />
                        <span style={{ color: 'var(--color-text-primary)', fontWeight: '700' }}>
                            There's a better way.
                        </span>
                    </p>
                </div>
            </section>

            {/* Section 2: The System */}
            <section className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2
                            className="text-5xl md:text-6xl font-black mb-6 tracking-tight"
                            style={{
                                color: 'var(--color-text-primary)',
                                opacity: scrollY > 800 ? 1 : 0,
                                transform: scrollY > 800 ? 'translateY(0)' : 'translateY(40px)',
                                transition: 'all 1s var(--ease-elegant)'
                            }}
                        >
                            One intelligent <span className="text-gradient-indigo">system</span>
                        </h2>
                        <p
                            className="text-xl"
                            style={{
                                color: 'var(--color-text-secondary)',
                                opacity: scrollY > 900 ? 1 : 0,
                                transition: 'all 1s var(--ease-elegant) 0.2s'
                            }}
                        >
                            Everything you need, engineered to perfection
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Users, title: 'Attendance Intelligence', desc: 'Real-time tracking with predictive analytics', color: '#10B981', delay: 0 },
                            { icon: Calendar, title: 'Event Orchestration', desc: 'Seamless scheduling and coordination', color: '#6366F1', delay: 0.1 },
                            { icon: BarChart3, title: 'Data Clarity', desc: 'Insights that drive decisions', color: '#06B6D4', delay: 0.2 },
                            { icon: Target, title: 'Performance Tracking', desc: 'Student progress visualization', color: '#8B5CF6', delay: 0.3 },
                            { icon: Zap, title: 'Instant Communication', desc: 'Messages that matter, delivered instantly', color: '#22D3EE', delay: 0.4 },
                            { icon: Award, title: 'Recognition System', desc: 'Celebrate achievements automatically', color: '#A78BFA', delay: 0.5 }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="glass-dark p-8 rounded-3xl group will-animate"
                                style={{
                                    border: '1px solid rgba(99, 102, 241, 0.1)',
                                    opacity: scrollY > 1000 + (index * 80) ? 1 : 0,
                                    transform: scrollY > 1000 + (index * 80) ? 'translateY(0) scale(1)' : 'translateY(60px) scale(0.9)',
                                    transition: `all 0.8s var(--ease-smooth) ${feature.delay}s`,
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = `${feature.color}40`;
                                    e.currentTarget.style.boxShadow = `0 0 40px ${feature.color}30`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.1)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                                    style={{
                                        background: `${feature.color}20`,
                                        transition: 'transform 0.3s var(--ease-smooth)'
                                    }}
                                >
                                    <feature.icon size={32} style={{ color: feature.color }} />
                                </div>
                                <h3
                                    className="text-2xl font-black mb-3"
                                    style={{ color: 'var(--color-text-primary)' }}
                                >
                                    {feature.title}
                                </h3>
                                <p
                                    className="leading-relaxed"
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '15px'
                                    }}
                                >
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: The Power */}
            <section className="min-h-screen py-32 px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="max-w-6xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2
                                className="text-5xl md:text-6xl font-black mb-8 leading-tight tracking-tight"
                                style={{
                                    color: 'var(--color-text-primary)',
                                    opacity: scrollY > 1800 ? 1 : 0,
                                    transform: scrollY > 1800 ? 'translateY(0)' : 'translateY(40px)',
                                    transition: 'all 1s var(--ease-elegant)'
                                }}
                            >
                                Built for
                                <br />
                                <span className="text-gradient-indigo">impact</span>
                            </h2>
                            <p
                                className="text-xl mb-8 leading-relaxed"
                                style={{
                                    color: 'var(--color-text-secondary)',
                                    opacity: scrollY > 1900 ? 1 : 0,
                                    transition: 'all 1s var(--ease-elegant) 0.2s'
                                }}
                            >
                                Trusted by forward-thinking institutions across South Africa
                            </p>

                            <div className="space-y-6">
                                {[
                                    { label: 'Schools Connected', value: '500+' },
                                    { label: 'Students Managed', value: '125K+' },
                                    { label: 'Messages Sent Daily', value: '50K+' },
                                    { label: 'Time Saved Weekly', value: '2,000hrs' }
                                ].map((stat, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4"
                                        style={{
                                            opacity: scrollY > 2000 + (index * 80) ? 1 : 0,
                                            transform: scrollY > 2000 + (index * 80) ? 'translateX(0)' : 'translateX(-40px)',
                                            transition: `all 0.8s var(--ease-smooth) ${index * 0.1}s`
                                        }}
                                    >
                                        <CheckCircle2 size={24} style={{ color: 'var(--color-emerald-bright)' }} />
                                        <div>
                                            <div className="text-3xl font-black" style={{ color: 'var(--color-text-primary)' }}>
                                                {stat.value}
                                            </div>
                                            <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                                                {stat.label}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dashboard Mockup */}
                        <div
                            className="glass-dark p-8 rounded-3xl"
                            style={{
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                opacity: scrollY > 1900 ? 1 : 0,
                                transform: scrollY > 1900 ? 'scale(1)' : 'scale(0.9)',
                                transition: 'all 1s var(--ease-elegant) 0.4s'
                            }}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                        Student Performance
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full animate-pulse-gentle" style={{ background: 'var(--color-emerald-bright)' }} />
                                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Live</span>
                                    </div>
                                </div>

                                {/* Student Cards */}
                                {[
                                    { name: 'Thabo Mkhize', subject: 'Mathematics', grade: 'A', score: 92, color: '#10B981' },
                                    { name: 'Nomsa Dlamini', subject: 'Physical Science', grade: 'B+', score: 85, color: '#06B6D4' },
                                    { name: 'Sipho Ndlovu', subject: 'English', grade: 'A-', score: 88, color: '#8B5CF6' },
                                    { name: 'Lerato Mokoena', subject: 'Life Sciences', grade: 'A', score: 94, color: '#10B981' },
                                    { name: 'Zanele Khumalo', subject: 'Accounting', grade: 'B', score: 82, color: '#22D3EE' }
                                ].map((student, i) => (
                                    <div
                                        key={i}
                                        className="p-4 rounded-2xl"
                                        style={{
                                            background: 'rgba(99, 102, 241, 0.05)',
                                            border: '1px solid rgba(99, 102, 241, 0.1)',
                                            transition: 'all 0.3s var(--ease-smooth)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                                            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
                                            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.1)';
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {/* Avatar */}
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                                                    style={{
                                                        background: `${student.color}20`,
                                                        color: student.color
                                                    }}
                                                >
                                                    {student.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                                        {student.name}
                                                    </div>
                                                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                                        {student.subject}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {/* Score */}
                                                <div className="text-right">
                                                    <div className="text-sm font-bold" style={{ color: student.color }}>
                                                        {student.score}%
                                                    </div>
                                                    <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                                        Grade {student.grade}
                                                    </div>
                                                </div>
                                                {/* Progress Bar */}
                                                <div
                                                    className="w-16 h-2 rounded-full"
                                                    style={{ background: 'rgba(99, 102, 241, 0.2)' }}
                                                >
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${student.score}%`,
                                                            background: student.color,
                                                            transition: 'width 1s var(--ease-smooth)'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Animated Glow */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1), transparent 70%)',
                        opacity: scrollY > 2600 ? 1 : 0,
                        transition: 'opacity 2s var(--ease-slow)'
                    }}
                />

                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    <h2
                        className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tighter"
                        style={{
                            color: 'var(--color-text-primary)',
                            opacity: scrollY > 2600 ? 1 : 0,
                            transform: scrollY > 2600 ? 'scale(1)' : 'scale(0.9)',
                            transition: 'all 1.5s var(--ease-slow)'
                        }}
                    >
                        Experience
                        <br />
                        <span className="text-gradient-indigo">the system</span>
                    </h2>

                    <p
                        className="text-2xl mb-12"
                        style={{
                            color: 'var(--color-text-secondary)',
                            opacity: scrollY > 2700 ? 1 : 0,
                            transition: 'all 1s var(--ease-elegant) 0.3s'
                        }}
                    >
                        See what the future of education looks like
                    </p>

                    <button
                        onClick={onGetStarted}
                        className="magnetic-hover"
                        style={{
                            padding: '24px 64px',
                            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                            color: 'white',
                            borderRadius: '24px',
                            fontWeight: '700',
                            fontSize: '20px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 0 60px rgba(99, 102, 241, 0.5)',
                            transition: 'all 0.4s var(--ease-elegant)',
                            opacity: scrollY > 2800 ? 1 : 0,
                            transform: scrollY > 2800 ? 'translateY(0)' : 'translateY(40px)'
                        }}
                    >
                        Get Started Now
                    </button>

                    <p
                        className="mt-8 text-sm"
                        style={{
                            color: 'var(--color-text-muted)',
                            opacity: scrollY > 2900 ? 1 : 0,
                            transition: 'all 1s var(--ease-elegant) 0.6s'
                        }}
                    >
                        No credit card required • 14-day free trial • Cancel anytime
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer
                className="py-16 px-4 sm:px-6 lg:px-8"
                style={{
                    background: 'var(--color-bg-secondary)',
                    borderTop: '1px solid rgba(99, 102, 241, 0.1)'
                }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                                }}
                            >
                                <GraduationCap size={22} style={{ color: 'white' }} />
                            </div>
                            <span className="text-xl font-black" style={{ color: 'var(--color-text-primary)' }}>
                                NexLink SA
                            </span>
                        </div>

                        <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                            © 2026 NexLink SA. Built with precision for South African schools.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
