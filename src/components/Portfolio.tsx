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
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const lastScrollY = useRef(0);
  
  // Typing animation state
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const fullText = "Front-End Developer";
  const typingSpeed = 80; // milliseconds per character - faster

  // Define your skills data
  const skills = [
    { name: "HTML/CSS", level: 95, icon: "fab fa-html5" },
    { name: "JavaScript", level: 88, icon: "fab fa-js" },
    { name: "React", level: 85, icon: "fab fa-react" },
    { name: "GIT", level: 90, icon: "fab fa-git-alt" }
  ];

  // Define project categories
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'react', name: 'React' },
    { id: 'java', name: 'Java' },
    { id: 'html', name: 'HTML/CSS' },
  ];

  // Define projects with categories
  const projects = [
    {
      title: "MK Inventory Ledger",
      description: "A React-based inventory system that helps stores track expenses, stocks, and sales.",
      image: "/src/imgs/Inventory-Management.png",
      category: "react",
      link: "#"
    },
    {
      title: "Event Management System",
      description: "A Java application to help users track and manage their upcoming events.",
      image: "/src/imgs/Event-Management.png",
      category: "java",
      link: "#"
    },
    {
      title: "Robux Store",
      description: "A website built with HTML/CSS for displaying pricelists in Robux and gamepasses.",
      image: "/src/imgs/Robux-Store.png",
      category: "html",
      link: "#"
    }
  ];

  // Filter projects based on active category
  const filteredProjects = activeCategory === 'all' 
    ? [...projects] 
    : projects.filter(project => project.category === activeCategory);

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

  // Typing animation effect
  useEffect(() => {
    if (!isTyping) return;

    const typeText = () => {
      if (typedText.length < fullText.length) {
        setTypedText(fullText.slice(0, typedText.length + 1));
      } else {
        setIsTyping(false);
      }
    };

    const typingInterval = setInterval(typeText, typingSpeed);
    return () => clearInterval(typingInterval);
  }, [typedText, isTyping, fullText, typingSpeed]);

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

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

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
        <section 
          id="home" 
          className={`hero ${visibleSections.has('home') ? 'visible' : ''} ${scrollDirection === 'up' ? 'scroll-up' : ''}`}
          ref={heroRef}
        >
          <div className="hero-grid">
            <div className="hero-text">
              <div className="hero-intro">
                <span className="greeting">Hello, I'm</span>
                <h1 className="hero-title">Miss Ko Na Siya</h1>
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
                <a href="/path-to-your-cv.pdf" className="cta-button cv-button" target="_blank" rel="noopener noreferrer">
                  Download CV
                </a>
              </div>
            </div>
            <div className="hero-image">
              <div className="profile-image">
                <img src="/src/imgs/toge.png" alt="Your Name" className="profile-photo" />
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
      <section 
        id="projects" 
        className={`projects ${visibleSections.has('projects') ? 'visible' : ''} ${scrollDirection === 'up' ? 'scroll-up' : ''}`}
      >
        <div className="container">
          <h2 className="fade-in section-title">Featured Projects</h2>
          <div className="project-categories">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="projects-grid">
            {filteredProjects.map((project, index) => (
              <div key={index} className="fade-in project-card">
                <div className="project-image">
                  {project.image.startsWith('/') ? (
                    <img src={project.image} alt={project.title} className="project-img" />
                  ) : (
                    <div className="project-placeholder">{project.image}</div>
                  )}
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <a href={project.link} className="project-link">View Project →</a>
                </div>
              </div>
            ))}
            {/* Add empty cards to maintain grid layout when filtered */}
            {filteredProjects.length % 3 !== 0 && 
              Array.from({ length: 3 - (filteredProjects.length % 3) }).map((_, index) => (
                <div key={`empty-${index}`} className="project-card empty" style={{ visibility: 'hidden' }}></div>
              ))
            }
          </div>
        </div>
      </section>

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
            <a href="https://github.com/yourusername" className="social-link" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
            <a href="https://instagram.com/yourprofile" className="social-link" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="mailto:your.email@example.com" className="social-link">
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