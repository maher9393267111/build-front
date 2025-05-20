//no cache
export const revalidate = 0;

import { getPrivacyPolicy } from '@services/api';
import Layout from '@components/layout/landing/Layout';
import MarkdownRenderer from '@components/ui/MarkdownRenderer'; // Assuming you have a Markdown renderer

export async function generateMetadata() {
    try {
        const policy = await getPrivacyPolicy();
       
        return {
            title: policy?.seoTitle || 'Privacy Policy',
            description: policy?.seoTitle || 'Our Privacy Policy details.',
            // Add other metadata tags as needed
        };
    } catch (error) {
        console.error('Failed to fetch privacy policy for metadata:', error);
        return {
            title: 'Privacy Policy',
            description: 'Our Privacy Policy details.',
        };
    }
}

export default async function PrivacyPolicyPage() {
    const policy = await getPrivacyPolicy();
    const heroImage = policy?.heroImage?.url || null;

    return (
        <Layout
            headerStyle={1}
            breadcrumbTitle={policy?.seoTitle || "Privacy Policy"}
            breadcrumbSubTitle={policy?.heroSubTitle || "How we handle your data"}
            breadcrumbAlign={"center"}
            breadcrumbImage={heroImage}
            headerBg={"transparent"}
        >
            <section className="section-padding">
                <div className="container">
                    <div className="prose max-w-none lg:prose-xl">
                        {policy?.description ? (
                            <MarkdownRenderer markdown={policy.description} />
                        ) : (
                            <p>Privacy Policy content is not available at the moment. Please check back later.</p>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
} 