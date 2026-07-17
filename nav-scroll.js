document.addEventListener('DOMContentLoaded', () => {
  const navLinks = Array.from(document.querySelectorAll('nav .nav-link'));
  const sections = Array.from(document.querySelectorAll('[data-nav-section]'));

  if (!navLinks.length || !sections.length) return;

  const setActiveTab = (sectionName) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('data-nav-target') === sectionName;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const updateActiveSection = () => {
    const headerOffset = 110;
    let currentSection = null;
    let currentDistance = Number.POSITIVE_INFINITY;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top - headerOffset);
      if (distance < currentDistance) {
        currentDistance = distance;
        currentSection = section;
      }
    });

    if (currentSection) {
      const sectionName = currentSection.getAttribute('data-nav-section');
      if (sectionName) {
        setActiveTab(sectionName);
      }
    }
  };

  const scrollToSection = (target) => {
    const targetSection = document.querySelector(`[data-nav-section="${target}"]`);
    if (!targetSection) return;
    setActiveTab(target);
    const top = targetSection.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', `#${target}`);
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = link.getAttribute('data-nav-target');
      if (!target) return;
      if (target === 'home') return;
      event.preventDefault();
      scrollToSection(target);
    });
  });

  const hash = window.location.hash.replace('#', '');
  if (hash) {
    setTimeout(() => scrollToSection(hash), 50);
  }

  updateActiveSection();
  window.addEventListener('scroll', updateActiveSection, { passive: true });
  window.addEventListener('resize', updateActiveSection);
});
