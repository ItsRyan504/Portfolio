import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Project {
  title: string;
  description: string;
  image: string;
  category: string;
  link: string;
}

interface Category {
  id: string;
  name: string;
}

interface ProjectsSectionProps {
  activeCategory: string;
  handleCategoryChange: (categoryId: string) => void;
  filteredProjects: Project[];
  categories: Category[];
  scrollDirection: 'up' | 'down';
  visibleSections: Set<string>;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  activeCategory,
  handleCategoryChange,
  filteredProjects,
  categories,
  scrollDirection,
  visibleSections
}) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState('');

  const closeModal = () => {
    setActiveImage(null);
    setActiveTitle('');
  };

  useEffect(() => {
    if (!activeImage) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (activeImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow || '';
    }

    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, [activeImage]);

  return (
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
                {(project.image.startsWith('/') || project.image.startsWith('http')) ? (
                  <img src={project.image} alt={project.title} className="project-img" loading="lazy" />
                ) : (
                  <div className="project-placeholder">{project.image}</div>
                )}
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <button
                  type="button"
                  className="project-link"
                  onClick={() => {
                    if (project.image.startsWith('/') || project.image.startsWith('http')) {
                      setActiveImage(project.image);
                      setActiveTitle(project.title);
                    } else if (project.link) {
                      window.open(project.link, '_blank');
                    }
                  }}
                >
                  View Project →
                </button>
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
        {activeImage && typeof document !== 'undefined' && createPortal(
          <div className="project-modal-backdrop" onClick={closeModal} role="presentation">
            <div
              className="project-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`${activeTitle} preview`}
              onClick={(e) => e.stopPropagation()}
            >
              <button type="button" className="project-modal-close" onClick={closeModal} aria-label="Close image">
                ×
              </button>
              <img src={activeImage} alt={activeTitle} className="project-modal-image" />
              <p className="project-modal-caption">{activeTitle}</p>
            </div>
          </div>,
          document.body
        )}
      </div>
    </section>
  );
};

export default ProjectsSection; 