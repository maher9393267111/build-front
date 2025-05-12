//no cache
export const revalidate = 0;

// Remove 'use client' - this is now a server component
import Layout from '@components/layout/landing/Layout'
import { getSiteSettings } from '@services/api'
import ContactPageContent from './ContactMain'

// Generate metadata dynamically from settings
export async function generateMetadata() {
    try {
        const settings = await getSiteSettings();
        
        return {
            title: settings?.contactMetaTitle || 'Contact Us',
            description: settings?.contactMetaDescription || 'Get in touch with our team for questions or support',
            keywords: settings?.contactMetaKeywords
                ? settings.contactMetaKeywords.split(',').map(k => k.trim())
                : ['contact', 'support', 'email', 'phone', 'address'],
            openGraph: {
                title: settings?.contactMetaTitle || 'Contact Us',
                description: settings?.contactMetaDescription || 'Get in touch with our team for questions or support',
                ...(settings?.ogImage?.url && {
                    images: [{ url: settings.ogImage.url }]
                }),
            },
        };
    } catch (error) {
        console.error('Failed to fetch contact SEO settings:', error);
        return {
            title: 'Contact Us',
            description: 'Get in touch with our team for questions or support',
            keywords: ['contact', 'support', 'email', 'phone', 'address'],
        };
    }
}

export default async function ContactPage() {
    // Fetch settings on the server
    const settings = await getSiteSettings();
    
    // Get hero title and image from settings
    const heroTitle =  "Contact Us";
    const heroSubTitle = settings?.contactSection?.heroTitle || "We will be glad to hear from you";
    const heroImage = settings?.contactSection?.heroImage?.url || null;

    return (
        <Layout
            breadcrumbTitle={heroTitle}
            breadcrumbSubTitle={heroSubTitle}
            breadcrumbAlign={"center"}
            breadcrumbImage={heroImage}
            headerBg="transparent"
            headerStyle={1}
        >
            <ContactPageContent initialSettings={settings} />
        </Layout>
    );
}


