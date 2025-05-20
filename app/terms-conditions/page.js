//no cache
export const revalidate = 0;

import { getTermsAndConditions } from '@services/api';
import Layout from '@components/layout/landing/Layout';
import MarkdownRenderer from '@components/ui/MarkdownRenderer';

export async function generateMetadata() {
    try {
        const terms = await getTermsAndConditions();
        return {
            title: terms?.seoTitle || 'Terms & Conditions',
            description: terms?.seoTitle || 'Our Terms & Conditions.',
        };
    } catch (error) {
        console.error('Failed to fetch terms & conditions for metadata:', error);
        return {
            title: 'Terms & Conditions',
            description: 'Our Terms & Conditions.',
        };
    }
}

export default async function TermsConditionsPage() {
    const terms = await getTermsAndConditions();
    const heroImage = terms?.heroImage?.url || null;

    return (
        <Layout
            headerStyle={1}
            breadcrumbTitle={terms?.seoTitle || "Terms & Conditions"}
            breadcrumbSubTitle={terms?.seoTitle || "Read our terms of service"}
            breadcrumbAlign={"center"}
            breadcrumbImage={heroImage}
            headerBg={"transparent"}
        >
            <section className="section-padding">
                <div className="container">
                    <div className="prose max-w-none lg:prose-xl">
                        {terms?.description ? (
                            <MarkdownRenderer markdown={terms.description} />
                        ) : (
                            <p>Terms & Conditions content is not available at the moment. Please check back later.</p>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
} 