document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  document.body.appendChild(navOverlay);

  // Toggle mobile menu
  function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
  }

  // Close mobile menu when clicking on a nav link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        toggleMobileMenu();
      }
    });
  });

  // Close mobile menu when clicking overlay
  navOverlay.addEventListener('click', toggleMobileMenu);

  // Toggle menu when clicking the hamburger button
  if (navToggle) {
    navToggle.addEventListener('click', toggleMobileMenu);
  }

  // Add scrolled class to header on scroll
  const header = document.querySelector('header');
  let lastScroll = 0;

  function handleScroll() {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class based on scroll position
    if (currentScroll > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
    
    lastScroll = currentScroll;
  }

  // Initial check in case page is loaded with scroll
  handleScroll();
  
  // Listen for scroll events
  window.addEventListener('scroll', handleScroll);

  // Close mobile menu when resizing to desktop
  function handleResize() {
    if (window.innerWidth > 992) {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  window.addEventListener('resize', handleResize);
});
