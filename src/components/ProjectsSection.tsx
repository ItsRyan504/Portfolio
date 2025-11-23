import React from 'react';

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
  );
};

export default ProjectsSection; 