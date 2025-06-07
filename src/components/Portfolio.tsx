import React, { useState, useEffect, useRef } from 'react';
import { Parallax } from 'react-parallax';
import './Portfolio.css';
// Add Font Awesome CSS to index.html or import it here if using a package

// Import your background images
const bgImage = 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80';

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);

  // Define your skills data
  const skills = [
    { name: "HTML/CSS", level: 95, icon: "fab fa-html5" },
    { name: "JavaScript", level: 88, icon: "fab fa-js" },
    { name: "Java", level: 85, icon: "fab fa-java" },
    { name: "PHP", level: 80, icon: "fab fa-php" },
    { name: "C", level: 75, icon: "fas fa-code" },
    { name: "GIT", level: 90, icon: "fab fa-git-alt" }
  ];

  // Handle scroll for header transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle smooth scrolling
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Intersection Observer for skills animation
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skillItem = entry.target;
          skillItem.classList.add('active');
          const progressBar = skillItem.querySelector('.skill-progress') as HTMLDivElement;
          if (progressBar) {
            const percentage = progressBar.getAttribute('data-percentage');
            progressBar.style.setProperty('--progress-width', `${percentage}%`);
          }
        }
      });
    }, observerOptions);

    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 100) {
          header.style.background = 'rgba(10, 10, 10, 0.98)';
          header.style.borderBottom = '1px solid rgba(0, 212, 255, 0.3)';
        } else {
          header.style.background = 'rgba(15, 15, 15, 0.95)';
          header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle cursor movement and trail effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Update main cursor
      if (cursorRef.current && cursorDotRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
        cursorDotRef.current.style.transform = `translate(${e.clientX - 2}px, ${e.clientY - 2}px)`;
      }

      // Create trail effect
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = `${e.clientX - 3}px`;
      trail.style.top = `${e.clientY - 3}px`;
      document.body.appendChild(trail);

      // Store trail element reference
      trailsRef.current.push(trail);

      // Remove trail after animation
      setTimeout(() => {
        trail.style.opacity = '0';
        setTimeout(() => {
          if (trail && trail.parentElement) {
            trail.parentElement.removeChild(trail);
            trailsRef.current = trailsRef.current.filter(t => t !== trail);
          }
        }, 300);
      }, 100);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      // Clean up any remaining trails
      trailsRef.current.forEach(trail => {
        if (trail && trail.parentElement) {
          trail.parentElement.removeChild(trail);
        }
      });
      trailsRef.current = [];
    };
  }, []);

  // Form submission handler
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (name && email && message) {
      alert("Thank you for your message! I'll get back to you soon.");
      e.currentTarget.reset();
    } else {
      alert('Please fill in all fields.');
    }
  };

  // Create particles for hero section
  useEffect(() => {
    const createParticle = () => {
      if (heroRef.current) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = 'rgba(0, 212, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        
        heroRef.current.appendChild(particle);
        
        setTimeout(() => {
          particle.remove();
        }, 7000);
      }
    };

    const particleInterval = setInterval(createParticle, 2000);
    return () => clearInterval(particleInterval);
  }, []);

  return (
    <div className="portfolio">
      {/* Custom Cursor */}
      <div ref={cursorRef} className="cursor" />
      <div ref={cursorDotRef} className="cursor-dot" />

      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <nav className="nav">
            <div className="logo">
              <span>Portfolio</span>
            </div>
            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              <li><a href="#home" onClick={() => scrollToSection('home')} className="nav-link">Home</a></li>
              <li><a href="#about" onClick={() => scrollToSection('about')} className="nav-link">About</a></li>
              <li><a href="#services" onClick={() => scrollToSection('services')} className="nav-link">Services</a></li>
              <li><a href="#projects" onClick={() => scrollToSection('projects')} className="nav-link">Projects</a></li>
              <li><a href="#contact" onClick={() => scrollToSection('contact')} className="nav-link">Contact</a></li>
            </ul>
            <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section with Parallax */}
      <Parallax
        blur={0}
        bgImage={bgImage}
        bgImageAlt="tech background"
        strength={200}
        className="hero-parallax"
      >
        <div className="hero-overlay"></div>
        <section id="home" className="hero" ref={heroRef}>
          <div className="hero-grid">
            <div className="hero-text">
              <div className="hero-intro">
                <span className="greeting">Hello, I'm</span>
                <h1 className="hero-title">Your Name</h1>
                <div className="hero-subtitle">
                  <span className="typed-text">Front-End Developer</span>
                </div>
              </div>
              <p className="hero-description">
                Specialized in building exceptional websites, applications,
                and everything in between.
              </p>
              <div className="hero-cta">
                <a href="#projects" onClick={() => scrollToSection('projects')} className="cta-button primary">
                  View My Work
                </a>
                <a href="#contact" onClick={() => scrollToSection('contact')} className="cta-button secondary">
                  Let's Talk
                </a>
              </div>
            </div>
            <div className="hero-image">
              <div className="profile-image">
                <img src="your-photo.jpg" alt="Your Name" className="profile-photo" />
                <div className="image-decoration"></div>
              </div>
              <div className="tech-stack">
                <div className="tech-item">
                  <i className="fab fa-react"></i>
                </div>
                <div className="tech-item">
                  <i className="fab fa-node-js"></i>
                </div>
                <div className="tech-item">
                  <i className="fab fa-python"></i>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Parallax>

      {/* About Section with improved skills display */}
      <section id="about" className="about">
        <div className="container">
          <h2 className="fade-in section-title">About Me</h2>
          <div className="about-content">
            <div className="fade-in about-text">
              <p>Hello! I'm a passionate Computer Science student with a deep interest in software development, web technologies, and emerging tech trends. My journey in programming started during my first year, and since then, I've been constantly learning and building projects.</p>
              <br />
              <p>I believe in writing clean, efficient code and creating user-centered solutions. Whether it's developing a web application, designing algorithms, or exploring machine learning, I approach each challenge with curiosity and determination.</p>
              <br />
              <p>When I'm not coding, you'll find me reading tech blogs, contributing to open-source projects, or experimenting with new frameworks and tools. I'm always excited to collaborate on interesting projects and learn from fellow developers.</p>
            </div>
            <div className="fade-in skills-container">
              <h3 className="skills-title">Technical Skills</h3>
              <div className="skills-graph">
                {skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="skill-info">
                      <div className="skill-name-with-icon">
                        <i className={`${skill.icon} skill-icon`}></i>
                        <span className="skill-name">{skill.name}</span>
                      </div>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-bar-container">
                      <div className="skill-progress" data-percentage={skill.level}>
                        <div className="skill-progress-glow"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with fixed styling */}
      <section id="services" className="services">
        <div className="container">
          <h2 className="fade-in section-title">What I Do</h2>
          <div className="services-grid">
            <div className="fade-in service-card">
              <div className="service-icon">💻</div>
              <h3 className="service-title">Web Development</h3>
              <p className="service-description">
                Building responsive, modern websites and web applications using the latest technologies like React, Node.js, and modern CSS frameworks.
              </p>
            </div>
            <div className="fade-in service-card">
              <div className="service-icon">📱</div>
              <h3 className="service-title">Mobile Development</h3>
              <p className="service-description">
                Creating cross-platform mobile applications with React Native and Flutter, focusing on user experience and performance optimization.
              </p>
            </div>
            <div className="fade-in service-card">
              <div className="service-icon">🤖</div>
              <h3 className="service-title">AI & Machine Learning</h3>
              <p className="service-description">
                Exploring artificial intelligence and machine learning concepts, implementing algorithms, and building intelligent applications with Python and TensorFlow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects">
        <div className="container">
          <h2 className="fade-in section-title">Featured Projects</h2>
          <div className="projects-grid">
            <div className="fade-in project-card">
              <div className="project-image">E-Learning Platform</div>
              <div className="project-content">
                <h3 className="project-title">University Learning System</h3>
                <p className="project-description">A comprehensive e-learning platform built with React and Node.js, featuring course management, video streaming, and progress tracking for students and instructors.</p>
                <a href="#" className="project-link">View Project →</a>
              </div>
            </div>
            <div className="fade-in project-card">
              <div className="project-image">Task Manager App</div>
              <div className="project-content">
                <h3 className="project-title">Smart Task Manager</h3>
                <p className="project-description">A productivity application with AI-powered task prioritization, built using React Native for mobile and featuring real-time synchronization across devices.</p>
                <a href="#" className="project-link">View Project →</a>
              </div>
            </div>
            <div className="fade-in project-card">
              <div className="project-image">Data Visualization</div>
              <div className="project-content">
                <h3 className="project-title">COVID-19 Analytics Dashboard</h3>
                <p className="project-description">An interactive data visualization dashboard using D3.js and Python Flask, providing real-time insights and trends analysis for COVID-19 statistics.</p>
                <a href="#" className="project-link">View Project →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section with improved styling */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="contact-content">
            <h2 className="fade-in section-title">Let's Connect</h2>
            <p className="fade-in">Interested in collaborating on a project or just want to chat about technology? I'd love to hear from you!</p>
            
            <form onSubmit={handleFormSubmit} className="fade-in contact-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Your full name"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Your email address"
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  placeholder="Your message"
                  className="form-input textarea"
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer with updated social links */}
      <footer className="footer">
        <div className="container">
          <div className="social-links">
            <a href="https://linkedin.com/in/yourprofile" className="social-link" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://github.com/yourusername" className="social-link" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://twitter.com/yourhandle" className="social-link" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com/yourprofile" className="social-link" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="mailto:your.email@example.com" className="social-link">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
          <p>&copy; 2025 Your Name. Built with passion and lots of coffee ☕</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio; 