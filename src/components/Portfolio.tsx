import React, { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from 'react';
import { Parallax } from 'react-parallax';
import './Portfolio.css';
import striktnanayImage from '../imgs/striktnanay.png';
import discordImage from '../imgs/discord.jpeg';
import inventoryImage from '../imgs/Inventory-Management.png';
import eventManagementImage from '../imgs/Event-Management.png';
import robuxStoreImage from '../imgs/Robux-Store.png';
import faceImage from '../imgs/face.jpg';
import cvPdf from '../assets/CV.pdf';
// Add Font Awesome CSS to index.html or import it here if using a package

// Lazy load components for better performance
const ProjectsSection = lazy(() => import('./ProjectsSection'));

// Import your background images
const bgImage = 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80';

const CONTACT_EMAIL = 'rml2023-7602-83277@bicol-u.edu.ph';

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  
  // Refs
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const heroRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  
  // Advanced typing animation state
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);
  
  const texts = ["Front-End Developer", "Roblox Scripter"];
  const typingSpeed = 70; // milliseconds per character
  const deletingSpeed = 40; // milliseconds per character (faster deletion)
  const pauseTime = 2000; // 3 seconds pause

  // Define your skills data with descriptions
  const skills = useMemo(() => [
    { name: "HTML/CSS", level: 95, icon: "fab fa-html5", description: "Modern web development with responsive design" },
    { name: "JavaScript", level: 88, icon: "fab fa-js", description: "Dynamic web applications and interactive features" },
    { name: "React", level: 85, icon: "fab fa-react", description: "Component-based UI development" },
    { name: "Lua", level: 92, icon: "fas fa-code", description: "Roblox game scripting and automation" },
    { name: "Git", level: 90, icon: "fab fa-git-alt", description: "Version control and collaboration" },
    { name: "UI/UX Design", level: 87, icon: "fas fa-palette", description: "User interface and experience design" }
  ], []);

  // Define project categories
  const categories = useMemo(() => [
    { id: 'all', name: 'All' },
    { id: 'react', name: 'React' },
    { id: 'java', name: 'Java' },
    { id: 'html', name: 'HTML/CSS' },
    { id: 'flutter', name: 'Flutter' },
    { id: 'python', name: 'Python' },
  ], []);

  // Define projects with categories
  const projects = useMemo(() => [
    {
      title: "Striktnanay",
      description: "A Flutter checklist with an integrated Pomodoro timer that helped 75% of student testers stay productive.",
      image: striktnanayImage,
      category: "flutter",
      link: "#"
    },
    {
      title: "Discord Queue Bot",
      description: "Python automation that manages Discord order queues with transparency, making the DC shop 68% more efficient during drops.",
      image: discordImage,
      category: "python",
      link: "#"
    },
    {
      title: "Roblox Gamepass Scanner",
      description: "Python-powered scanner that tracks Robux prices and gamepasses in real time, boosting scanning efficiency across the shop by 82%.",
      image: discordImage,
      category: "python",
      link: "#"
    },
    {
      title: "MK Inventory Ledger",
      description: "A React-based inventory system that helps stores track expenses, stocks, and sales.",
      image: inventoryImage,
      category: "react",
      link: "#"
    },
    {
      title: "Event Management System",
      description: "A Java application to help users track and manage their upcoming events.",
      image: eventManagementImage,
      category: "java",
      link: "#"
    },
    {
      title: "Robux Store",
      description: "A website built with HTML/CSS for displaying pricelists in Robux and gamepasses.",
      image: robuxStoreImage,
      category: "html",
      link: "#"
    }
  ], []);

  // Filter projects based on active category
  const filteredProjects = useMemo(() => 
    activeCategory === 'all' 
      ? [...projects] 
      : projects.filter(project => project.category === activeCategory),
    [activeCategory, projects]
  );

  // Handle scroll for header transparency
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle smooth scrolling
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY < lastScrollY.current ? 'up' : 'down';
      setScrollDirection(direction);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Initialize Intersection Observer with improved options
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          } else {
            // Only remove the section from visible sections if scrolling up
            if (scrollDirection === 'up') {
              setVisibleSections((prev) => {
                const newSet = new Set(prev);
                newSet.delete(entry.target.id);
                return newSet;
              });
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all sections
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [scrollDirection]);

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

  // Advanced typing animation effect
  useEffect(() => {
    const currentText = texts[currentTextIndex];
    
    if (isTyping) {
      // Typing phase
      if (typedText.length < currentText.length) {
        const timer = setTimeout(() => {
          setTypedText(currentText.slice(0, typedText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Finished typing, start pause
        setIsTyping(false);
        setDisplayTime(0);
      }
    } else if (!isDeleting && displayTime < pauseTime) {
      // Pause phase - keep text visible
      const timer = setTimeout(() => {
        setDisplayTime(prev => prev + 100);
      }, 100);
      return () => clearTimeout(timer);
    } else if (!isDeleting && displayTime >= pauseTime) {
      // Start deleting
      setIsDeleting(true);
    } else if (isDeleting) {
      // Deleting phase
      if (typedText.length > 0) {
        const timer = setTimeout(() => {
          setTypedText(typedText.slice(0, -1));
        }, deletingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Finished deleting, move to next text
        setIsDeleting(false);
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsTyping(true);
      }
    }
  }, [typedText, isTyping, isDeleting, currentTextIndex, displayTime, texts, typingSpeed, deletingSpeed, pauseTime]);

  // Handle cursor movement and trail effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
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
  }, []);

  useEffect(() => {
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
  }, [handleMouseMove]);

  // Form submission handler
  const handleFormSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    if (typeof name === 'string' && typeof email === 'string' && typeof message === 'string') {
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      alert("Thanks! Your email client should open with the details filled in.");
      e.currentTarget.reset();
    } else {
      alert('Please fill in all fields.');
    }
  }, []);

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

  // Handle category change
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
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
              <span>RiaZure</span>
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
        <section 
          id="home" 
          className={`hero ${visibleSections.has('home') ? 'visible' : ''} ${scrollDirection === 'up' ? 'scroll-up' : ''}`}
          ref={heroRef}
        >
          <div className="hero-grid">
            <div className="hero-text">
              <div className="hero-intro">
                <span className="greeting">Hello, I'm</span>
                <h1 className="hero-title">Ryan Lumbis</h1>
                <div className="hero-subtitle">
                  <span className="typed-text">
                    {typedText}
                    <span className="cursor-blink">|</span>
                  </span>
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
                <a href={cvPdf} className="cta-button cv-button" target="_blank" rel="noopener noreferrer">
                  Download CV
                </a>
              </div>
            </div>
            <div className="hero-image">
              <div className="profile-image">
                <img src={faceImage} alt="Your Name" className="profile-photo" loading="lazy" />
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
      <section 
        id="about" 
        className={`about ${visibleSections.has('about') ? 'visible' : ''} ${scrollDirection === 'up' ? 'scroll-up' : ''}`}
      >
        <div className="container">
          <h2 className="fade-in section-title">About Me</h2>
          <div className="about-content">
            <div className="fade-in about-text">
              <p>Hello! I'm an IT student at Bicol University with a growing passion for front-end development and crafting clean, user-friendly interfaces. Since diving into web development, I've been excited by how design and code come together to create seamless digital experiences.</p>
              <br />
              <p>I specialize in building responsive, accessible web apps using HTML, CSS, JavaScript, and modern frameworks like React. I enjoy turning ideas into interactive, intuitive interfaces that not only look good but also function smoothly.</p>
              <br />
              <p>I'm always learning — whether it's experimenting with UI libraries, exploring new tools like Vite or Tailwind CSS, or keeping up with the latest front-end trends. Outside of coding, I enjoy reading tech blogs, joining dev communities, and collaborating with others on meaningful projects.</p>
            </div>
            <div className="fade-in skills-section">
              <h3 className="skills-title">Technical Skills</h3>
              <div className="skills-infinite-scroll">
                <div className="skills-track">
                  {/* First set of cards */}
                  {skills.map((skill, index) => (
                    <div key={`first-${index}`} className="skill-card">
                      <div className="skill-card-icon">
                        <i className={skill.icon}></i>
                      </div>
                      <div className="skill-card-content">
                        <h4 className="skill-card-title">{skill.name}</h4>
                      </div>
                    </div>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {skills.map((skill, index) => (
                    <div key={`second-${index}`} className="skill-card">
                      <div className="skill-card-icon">
                        <i className={skill.icon}></i>
                      </div>
                      <div className="skill-card-content">
                        <h4 className="skill-card-title">{skill.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with fixed styling */}
      <section 
        id="services" 
        className={`services ${visibleSections.has('services') ? 'visible' : ''} ${scrollDirection === 'up' ? 'scroll-up' : ''}`}
      >
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
              <div className="service-icon">🎮</div>
              <h3 className="service-title">Roblox Developer</h3>
              <p className="service-description">
                Creating engaging Roblox games and experiences with Lua scripting, focusing on game mechanics and user interaction.
              </p>
            </div>
            <div className="fade-in service-card">
              <div className="service-icon">🎨</div>
              <h3 className="service-title">UX/UI Designer</h3>
              <p className="service-description">
                Designing intuitive user interfaces and experiences with modern design principles and user-centered approaches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectsSection
          activeCategory={activeCategory}
          handleCategoryChange={handleCategoryChange}
          filteredProjects={filteredProjects}
          categories={categories}
          scrollDirection={scrollDirection}
          visibleSections={visibleSections}
        />
      </Suspense>

      {/* Contact Section with improved styling */}
      <section 
        id="contact" 
        className={`contact ${visibleSections.has('contact') ? 'visible' : ''} ${scrollDirection === 'up' ? 'scroll-up' : ''}`}
      >
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
            <a href="https://github.com/ItsRyan504" className="social-link" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://www.instagram.com/mr.popsout" className="social-link" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="social-link">
              <i className="fas fa-envelope"></i>
            </a>
          </div>
          <p>&copy; 2025 Sec. Built with passion and lots of coffee ☕</p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio; 