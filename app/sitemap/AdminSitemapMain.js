'use client';

import Link from 'next/link';
import {
  FaHome,
  FaInfoCircle,
  FaPhoneAlt,
  FaAngleRight,
  FaNewspaper,
  FaFileAlt,
  FaShieldAlt,
  FaFileContract,
  FaQuestionCircle,
  FaWrench,
  FaBlog,
  FaRegFileAlt,
} from 'react-icons/fa';
import styles from './sitemap.module.css';

// Map of icon string names to their components
const iconMap = {
  FaHome: FaHome,
  FaInfoCircle: FaInfoCircle,
  FaPhoneAlt: FaPhoneAlt,
  FaAngleRight: FaAngleRight,
  FaNewspaper: FaNewspaper,
  FaFileAlt: FaFileAlt,
  FaShieldAlt: FaShieldAlt,
  FaFileContract: FaFileContract,
  FaQuestionCircle: FaQuestionCircle,
  FaWrench: FaWrench,
  FaBlog: FaBlog,
  FaRegFileAlt: FaRegFileAlt,
};

export default function AdminSitemapMain({ siteStructure = [], error = null }) {
  if (error) {
    return <div className={styles.container}><p>Error loading sitemap: {error}</p></div>;
  }

  if (!siteStructure || siteStructure.length === 0) {
    return <div className={styles.container}><p>No sitemap data available.</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Site Overview</h1>
      <div className={styles.sitemapGrid}>
        {siteStructure.map((section, index) => {
          // Convert string icon names to actual React components
          const SectionIcon = iconMap[section.icon];
          const ChildIcon = iconMap[section.childIcon];

          return (
            <div key={index} className={styles.section}>
              <div className={styles.sectionHeader}>
                {SectionIcon && <SectionIcon className={styles.icon} />}
                <h2>{section.title}</h2>
              </div>
              <ul className={styles.linkList}>
                {section.links.map((link, linkIndex) => {
                  const LinkIcon = link.icon ? iconMap[link.icon] : null;
                  
                  return (
                    <li
                      key={`${index}-${linkIndex}`}
                      className={`${styles.linkItem} ${link.isChild ? styles.childLink : ''}`}
                    >
                      <Link href={link.url} className={styles.link}>
                        {link.isChild ? (
                          <span className={styles.childIconWrapper}>
                            <FaAngleRight className={styles.arrowIcon} />
                          </span>
                        ) : LinkIcon ? (
                          <span className={styles.linkIconWrapper}>
                            <LinkIcon className={styles.linkIcon} />
                          </span>
                        ) : (
                          <span className={styles.linkIconWrapper}>&nbsp;</span>
                        )}
                        <span className={styles.linkText}>{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
} 