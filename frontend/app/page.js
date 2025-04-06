"use client";
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <div className={styles.logo}>ExamPro</div>
          <div className={styles.navLinks}>
            <Link href="/login" className={styles.navLink}>Login</Link>
            <Link href="/register" className={styles.navLink}>Register</Link>
          </div>
        </nav>
      </header>

      <main className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Smart Examination Platform</h1>
          <p className={styles.heroSubtitle}>Automated Grading • Intelligent Assessment • Seamless Learning</p>
          <div className={styles.heroCTA}>
            <Link href="/register" className={styles.ctaButton}>Get Started</Link>
            <Link href="/features" className={styles.ctaButtonOutline}>Learn More</Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <Image 
            src="/images/education-hero.jpeg" 
            alt="Examination Platform" 
            width={500} 
            height={400} 
            priority 
          />
        </div>
      </main>

      <section className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>📝</div>
          <h3>Automated Grading</h3>
          <p>Instant, objective assessment of student performance</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🧠</div>
          <h3>Adaptive Testing</h3>
          <p>Intelligent question selection based on student's skill level</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>📊</div>
          <h3>Comprehensive Analytics</h3>
          <p>Detailed insights into student progress and learning gaps</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2025 ExamPro. All Rights Reserved.</p>
      </footer>
    </div>
  )
}