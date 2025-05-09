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

        // Prepare icon data if ogImage exists
        const iconUrl = settings?.ogImage?.url;
        const iconsData = iconUrl ? {
            icon: [
                { url: iconUrl, sizes: '16x16', type: 'image/png' },
                { url: iconUrl, sizes: '32x32', type: 'image/png' },
                { url: iconUrl, sizes: '64x64', type: 'image/png' }
            ],
            apple: [
                { url: iconUrl, sizes: '180x180', type: 'image/png' }
            ],
            shortcut: [{ url: iconUrl }],
            other: [
                { rel: 'mask-icon', url: iconUrl }
            ]
        } : undefined;

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
                ...(settings?.socialLinks && {
                    facebook: settings.socialLinks.facebook,
                    twitter: settings.socialLinks.twitter,
                    instagram: settings.socialLinks.instagram,
                    linkedin: settings.socialLinks.linkedin,
                    youtube: settings.socialLinks.youtube,
                }),
            },
            alternates: {
                canonical: settings?.canonicalUrl,
                types: {
                    'application/json+oembed': [
                        {
                            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://letsbuildsw.co.uk'}/api/oembed`,
                            title: settings?.title || defaultTitle,
                        },
                    ],
                },
            },
            other: {
                social: settings?.socialLinks || {},
            },
            icons: iconsData,
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
        // Wrap in try/catch and set a timeout to prevent hanging
        const settingsPromise = getSiteSettings();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Settings fetch timeout')), 5000)
        );
        
        // Race the settings fetch against a timeout
        settings = await Promise.race([settingsPromise, timeoutPromise])
            .catch(error => {
                console.error("Failed to fetch settings for layout:", error);
                return null;
            });
    } catch (error) {
        console.error("Failed to fetch settings for layout:", error);
    }

    // If settings is still null, provide fallback values
    if (!settings) {
        settings = {
            primaryColor: '#3b82f6',
            navTitles: {
                textColor: '#000000',
                iconColor: '#000000'
            },
            scripts: {
                head: '',
                body: ''
            }
        };
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

    // Parse any HTML content to avoid potential hydration issues
    const headScript = settings?.scripts?.head || '';
    const bodyScript = settings?.scripts?.body || '';

    return (
        <html lang="en" className="scroll-smooth hover:scroll-auto" id='top' style={primaryColorStyle}>
            <head>{/* Remove whitespace and ensure no extra text nodes */}
                <link rel="icon" href={settings?.ogImage?.url } />
                {headScript ? (
                   <Script
                        id="head-scripts"
                        dangerouslySetInnerHTML={{ __html: headScript }}
                        strategy="beforeInteractive"
                    />
                ) : null}
            </head>
            <body className={inter.className} suppressHydrationWarning={true}>
                <ClientProviders initialSettings={settings}>
                    {children}
                </ClientProviders>

                {bodyScript ? (
                    <Script 
                        id="body-scripts"
                        dangerouslySetInnerHTML={{ __html: bodyScript }}
                        strategy="lazyOnload"
                    />
                ) : null}
            </body>
        </html>
    );
}
