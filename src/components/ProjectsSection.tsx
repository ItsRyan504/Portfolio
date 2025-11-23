import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

interface ExitProject {
  project: Project;
  top: number;
  left: number;
  width: number;
  height: number;
}

const CARD_EXIT_DURATION = 280;
const CARD_ENTER_DURATION = 320;

const areProjectListsEqual = (a: Project[], b: Project[]) => {
  if (a.length !== b.length) {
    return false;
  }
  return a.every((project, index) => project.title === b[index]?.title);
};

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
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>(filteredProjects);
  const [exitingProjects, setExitingProjects] = useState<ExitProject[]>([]);
  const [enteringIds, setEnteringIds] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const prevPositionsRef = useRef(new Map<string, DOMRect>());
  const exitCleanupTimeout = useRef<number | null>(null);
  const enterCleanupTimeout = useRef<number | null>(null);
  const [hasFiltered, setHasFiltered] = useState(false);

  const closeModal = () => {
    if (!activeImage || isClosing) {
      return;
    }

    setIsClosing(true);
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveImage(null);
      setActiveTitle('');
      setIsClosing(false);
      closeTimeoutRef.current = null;
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
      if (exitCleanupTimeout.current) {
        window.clearTimeout(exitCleanupTimeout.current);
      }
      if (enterCleanupTimeout.current) {
        window.clearTimeout(enterCleanupTimeout.current);
      }
    };
  }, []);

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

  useEffect(() => {
    if (areProjectListsEqual(filteredProjects, displayedProjects)) {
      return;
    }

    if (!hasFiltered) {
      setHasFiltered(true);
    }

    const container = gridRef.current;
    const exiting: ExitProject[] = [];

    if (container) {
      const containerRect = container.getBoundingClientRect();
      displayedProjects.forEach(project => {
        if (!filteredProjects.find(target => target.title === project.title)) {
          const card = cardRefs.current.get(project.title);
          if (card) {
            const rect = card.getBoundingClientRect();
            exiting.push({
              project,
              top: rect.top - containerRect.top,
              left: rect.left - containerRect.left,
              width: rect.width,
              height: rect.height
            });
          }
        }
      });
    }

    if (exiting.length) {
      setExitingProjects(exiting);
      if (exitCleanupTimeout.current) {
        window.clearTimeout(exitCleanupTimeout.current);
      }
      exitCleanupTimeout.current = window.setTimeout(() => {
        setExitingProjects([]);
        exitCleanupTimeout.current = null;
      }, CARD_EXIT_DURATION);
    } else {
      setExitingProjects([]);
    }

    const entering = filteredProjects.filter(project =>
      !displayedProjects.find(current => current.title === project.title)
    );

    if (entering.length) {
      const enteringSet = new Set(entering.map(project => project.title));
      setEnteringIds(enteringSet);
      if (enterCleanupTimeout.current) {
        window.clearTimeout(enterCleanupTimeout.current);
      }
      enterCleanupTimeout.current = window.setTimeout(() => {
        setEnteringIds(new Set());
        enterCleanupTimeout.current = null;
      }, CARD_ENTER_DURATION);
    } else {
      setEnteringIds(new Set());
    }

    setDisplayedProjects(filteredProjects);
  }, [filteredProjects, displayedProjects, hasFiltered]);

  useLayoutEffect(() => {
    const latestPositions = new Map<string, DOMRect>();

    cardRefs.current.forEach((node, key) => {
      if (!node) {
        return;
      }
      const rect = node.getBoundingClientRect();
      latestPositions.set(key, rect);
      const previousRect = prevPositionsRef.current.get(key);
      if (previousRect) {
        const deltaX = previousRect.left - rect.left;
        const deltaY = previousRect.top - rect.top;
        if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
          node.animate(
            [
              { transform: `translate(${deltaX}px, ${deltaY}px)` },
              { transform: 'translate(0, 0)' }
            ],
            {
              duration: CARD_ENTER_DURATION,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }
          );
        }
      }
    });

    prevPositionsRef.current = latestPositions;
  }, [displayedProjects]);

  const handleProjectAction = (project: Project) => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (project.image.startsWith('/') || project.image.startsWith('http')) {
      setActiveImage(project.image);
      setActiveTitle(project.title);
      setIsClosing(false);
    } else if (project.link) {
      window.open(project.link, '_blank');
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === activeCategory) {
      return;
    }
    handleCategoryChange(categoryId);
  };

  const renderProjectCardContent = (project: Project, disableInteractions = false) => (
    <>
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
          onClick={disableInteractions ? undefined : () => handleProjectAction(project)}
          tabIndex={disableInteractions ? -1 : undefined}
          aria-hidden={disableInteractions ? true : undefined}
        >
          View Project →
        </button>
      </div>
    </>
  );

  return (
    <section 
      id="projects" 
      className={`projects ${visibleSections.has('projects') ? 'visible' : ''} ${scrollDirection === 'up' ? 'scroll-up' : ''} ${hasFiltered ? 'has-filtered' : ''}`.trim()}
    >
      <div className="container">
        <h2 className="fade-in section-title">Featured Projects</h2>
        <div className="project-categories">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategorySelect(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="projects-grid" ref={gridRef}>
          {displayedProjects.map(project => {
            const isEntering = enteringIds.has(project.title);
            return (
              <div
                key={project.title}
                ref={(node) => {
                  if (node) {
                    cardRefs.current.set(project.title, node);
                  } else {
                    cardRefs.current.delete(project.title);
                  }
                }}
                data-project-id={project.title}
                className={`project-card ${isEntering ? 'card-enter' : ''}`}
              >
                {renderProjectCardContent(project)}
              </div>
            );
          })}

          {exitingProjects.length > 0 && (
            <div className="project-exit-layer" aria-hidden="true">
              {exitingProjects.map(exit => (
                <div
                  key={`exit-${exit.project.title}`}
                  className="project-card exit-card"
                  style={{
                    width: exit.width,
                    height: exit.height,
                    top: exit.top,
                    left: exit.left
                  }}
                >
                  {renderProjectCardContent(exit.project, true)}
                </div>
              ))}
            </div>
          )}
        </div>
        {activeImage && typeof document !== 'undefined' && createPortal(
          <div
            className={`project-modal-backdrop ${isClosing ? 'closing' : 'opening'}`}
            onClick={closeModal}
            role="presentation"
          >
            <div
              className={`project-modal ${isClosing ? 'closing' : 'opening'}`}
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