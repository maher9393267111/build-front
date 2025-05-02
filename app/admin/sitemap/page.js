'use client'; // Mark as client component for potential future interactions, though fetching is server-side

import * as api from '@/services/api'; // Assuming services is aliased to @/services
import Link from 'next/link';
import {
  FaHome,
  FaInfoCircle,
  FaPhoneAlt,
  FaAngleRight,
  FaNewspaper, // Used for blogs
  FaFileAlt, // Used for pages
  FaShieldAlt,
  FaFileContract,
  FaQuestionCircle, // For FAQs
  FaWrench, // Generic for site sections
  FaBlog, // For blog section title
  FaRegFileAlt, // For page section title
} from 'react-icons/fa';
import styles from './sitemap.module.css';
import { useEffect, useState } from 'react';



export default function AdminSitemapPage() {
  const [siteStructure, setSiteStructure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Admin Sitemap: Fetching data...");
      try {
        setLoading(true);
        const sitemapData = await api.getSitemapData();
        console.log("Admin Sitemap: Data received", sitemapData);

        const pages = sitemapData.pages || [];
        const blogs = sitemapData.blogs || [];

        const structure = [
          {
            title: 'Main Pages',
            icon: <FaHome className={styles.icon} />,
            childIcon: <FaAngleRight className={styles.childIcon} />,
            links: [
              { url: '/', label: 'Home', icon: <FaHome className={styles.linkIcon} /> },
              // Add other static pages like About, Contact, etc.
              { url: '/contact', label: 'Contact', icon: <FaPhoneAlt className={styles.linkIcon} /> },
              { url: '/faqs', label: 'FAQs', icon: <FaQuestionCircle className={styles.linkIcon} /> },
              // Add links to policy pages if they exist
              // { url: '/privacy-policy', label: 'Privacy Policy', icon: <FaShieldAlt className={styles.linkIcon} /> },
              // { url: '/terms-and-conditions', label: 'Terms & Conditions', icon: <FaFileContract className={styles.linkIcon} /> },
            ],
          },
          {
            title: 'Content Pages',
            icon: <FaRegFileAlt className={styles.icon} />,
            childIcon: <FaFileAlt className={styles.childIcon} />,
            links: [
              // Maybe a link to the main page editor or list
              // { url: '/admin/pages', label: 'Manage Pages' },
              ...pages.map((page) => ({
                url: `${page.isMainPage ? '/' : `/${page.slug}`}`, // Link to the actual page view
                label: page.title || page.slug, // Display title, fallback to slug
                isChild: true,
              })),
            ],
          },
          {
            title: 'Blogs',
            icon: <FaBlog className={styles.icon} />,
            childIcon: <FaNewspaper className={styles.childIcon} />,
            links: [
              { url: '/blog', label: 'All Blogs' }, // Link to the public blog list
              // { url: '/admin/blogs', label: 'Manage Blogs' }, // Link to admin blog management
              ...blogs.map((blog) => ({
                url: `/blog/${blog.slug}`,
                label: blog.title || blog.slug, // Display title, fallback to slug
                isChild: true,
              })),
            ],
          },
          // Add other sections like Admin, Profile etc. if needed
        ];

        setSiteStructure(structure);
        setError(null);
      } catch (err) {
        console.error('Error fetching sitemap data for admin page:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
        console.log("Admin Sitemap: Fetching complete.");
      }
    };

    fetchData();
  }, []); // Fetch data on component mount

  if (loading) {
    return <div className={styles.container}><p>Loading sitemap...</p></div>;
  }

  if (error) {
    return <div className={styles.container}><p>Error loading sitemap: {error}</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Site Overview</h1>
      <div className={styles.sitemapGrid}>
        {siteStructure.map((section, index) => (
          <div key={index} className={styles.section}>
            <div className={styles.sectionHeader}>
              {section.icon}
              <h2>{section.title}</h2>
            </div>
            <ul className={styles.linkList}>
              {section.links.map((link, linkIndex) => (
                <li
                  key={`${index}-${linkIndex}`}
                  className={`${styles.linkItem} ${link.isChild ? styles.childLink : ''}`}
                >
                  <Link href={link.url} className={styles.link}>
                    {link.isChild ? (
                      <span className={styles.childIconWrapper}>
                        {/* Using AngleRight as the primary child indicator */}
                        <FaAngleRight className={styles.arrowIcon} />
                        {/* Optional: Section specific child icon */}
                        {/* {section.childIcon}  */}
                      </span>
                    ) : link.icon ? (
                      <span className={styles.linkIconWrapper}>
                        {link.icon}
                      </span>
                    ) : (
                       // Placeholder for alignment if no icon but not a child
                       <span className={styles.linkIconWrapper}>&nbsp;</span> 
                    )}
                    <span className={styles.linkText}>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
} 