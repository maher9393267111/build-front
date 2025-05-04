import { Inter } from 'next/font/google';
import Script from 'next/script';
import { getSiteSettings } from '@services/api';
import '@public/tailwind/style.css';
import 'animate.css';
import 'swiper/css';
import "swiper/css/autoplay";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ClientProviders from './ClientProviders';

const inter = Inter({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export async function generateMetadata() {
    try {
        const settings = await getSiteSettings();
        
        const defaultTitle = 'letsbuildsw.co.uk';
        const defaultDescription = 'letsbuildsw.co.uk ';
        
        const metadataBase = {};
        if (settings?.ogImage?.url) {
           metadataBase.images = [
                {
                    url: settings.ogImage.url,
                },
            ];
        }

        return {
            metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://letsbuildsw.co.uk'),
            title: settings?.metaTitle || settings?.title || defaultTitle,
            url: settings?.canonicalUrl || 'https://letsbuildsw.co.uk',
            description: settings?.metaDescription || settings?.description || defaultDescription,
            keywords: settings?.metaKeywords ? settings.metaKeywords.split(',').map(k => k.trim()) : [],
            openGraph: {
                title: settings?.metaTitle || settings?.title || defaultTitle,
                description: settings?.metaDescription || settings?.description || defaultDescription,
                ...(metadataBase.images && { images: metadataBase.images }),
            },
        };
    } catch (error) {
        console.error("Failed to fetch settings for metadata:", error);
        return {
            title: 'Site Title',
            description: 'Site description.',
        };
    }
}

export default async function RootLayout({ children }) {
    let settings = null;
    try {
        settings = await getSiteSettings();
    } catch (error) {
        console.error("Failed to fetch settings for layout:", error);
    }

    const primaryColorStyle = settings?.primaryColor 
        ? { '--primary-color': settings.primaryColor } 
        : {};
    if (settings?.navTitles?.textColor) {
         primaryColorStyle['--nav-text-color'] = settings.navTitles.textColor;
     }
     if (settings?.navTitles?.iconColor) {
         primaryColorStyle['--nav-icon-color'] = settings.navTitles.iconColor;
     }

    return (
        <html lang="en" className="scroll-smooth hover:scroll-auto" id='top' style={primaryColorStyle}>
            <head>
                {settings?.scripts?.head && (
                   <script
                        id="head-scripts"
                        dangerouslySetInnerHTML={{ __html: settings.scripts.head }} 
                    />
                )}
            </head>
            <body className={inter.className}>
                <ClientProviders initialSettings={settings}>
                    {children}
                </ClientProviders>

                {settings?.scripts?.body && (
                    <script 
                        id="body-scripts"
                        dangerouslySetInnerHTML={{ __html: settings.scripts.body }}
                        strategy="lazyOnload"
                    />
                )}
            </body>
        </html>
    );
}
