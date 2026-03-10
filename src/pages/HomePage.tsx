import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ModelsCatalog from '../components/ModelsCatalog';
import FeaturesGrid from '../components/FeaturesGrid';
import CodePreview from '../components/CodePreview';
import OrbitalSection from '../components/OrbitalSection';
import Timeline from '../components/Timeline';
import PricingSection from '../components/PricingSection';
import DimensionsSection from '../components/DimensionsSection';
import GallerySection from '../components/GallerySection';
import MarqueeSection from '../components/MarqueeSection';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';

export default function HomePage() {
    return (
        <div className="bg-black min-h-screen">
            <Header />
            <HeroSection />

            <main className="z-10 w-full relative">
                <ScrollReveal><FeaturesGrid /></ScrollReveal>
                <ScrollReveal><ModelsCatalog /></ScrollReveal>
                <ScrollReveal><CodePreview /></ScrollReveal>
                <ScrollReveal><OrbitalSection /></ScrollReveal>
                <ScrollReveal><Timeline /></ScrollReveal>
                <ScrollReveal><GallerySection /></ScrollReveal>
                <ScrollReveal><MarqueeSection /></ScrollReveal>
                <ScrollReveal><DimensionsSection /></ScrollReveal>
                <ScrollReveal><PricingSection /></ScrollReveal>
                <ScrollReveal><CTASection /></ScrollReveal>
            </main>
            <ScrollReveal><Footer /></ScrollReveal>
        </div>
    );
}
