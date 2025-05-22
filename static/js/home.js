// Main hero carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('[data-carousel]');
    if (!carousel) return;

    const items = carousel.querySelectorAll('[data-carousel-item]');
    const indicators = carousel.querySelectorAll('[data-carousel-indicator]');
    const prevButton = carousel.querySelector('[data-carousel-prev]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    
    let currentIndex = 0;
    
    function showSlide(index) {
        items.forEach((item, i) => {
            item.classList.toggle('opacity-100', i === index);
            item.classList.toggle('opacity-0', i !== index);
        });
        
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('bg-cuf-yellow', i === index);
            indicator.classList.toggle('bg-white/50', i !== index);
        });
        
        currentIndex = index;
    }
    
    function nextSlide() {
        showSlide((currentIndex + 1) % items.length);
    }
    
    function prevSlide() {
        showSlide((currentIndex - 1 + items.length) % items.length);
    }
    
    // Event listeners
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });
    
    // Auto-play
    setInterval(nextSlide, 5000);
});

// Party Leaders carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('[data-leaders-carousel]');
    if (!carousel) return; // Exit if carousel doesn't exist
    
    const items = carousel.querySelectorAll('[data-leader-item]');
    const indicators = carousel.querySelectorAll('[data-leader-indicator]');
    const prevButton = carousel.querySelector('[data-leaders-prev]');
    const nextButton = carousel.querySelector('[data-leaders-next]');
    
    const itemsPerPage = 4; // Number of items to show per page (for desktop)
    const mobileItemsPerPage = 1; // Number of items to show per page on mobile
    const totalItems = items.length;
    let totalPages = Math.ceil(totalItems / itemsPerPage);
    
    let currentIndex = 0; // Current page index
    let autoScrollInterval;
    let isMobile = window.innerWidth < 768; // Define mobile breakpoint
    
    // Update items per page based on screen size
    function updateItemsPerPage() {
      isMobile = window.innerWidth < 768;
      let activeItemsPerPage = isMobile ? mobileItemsPerPage : itemsPerPage;
      totalPages = Math.ceil(totalItems / activeItemsPerPage);
      showPage(currentIndex); // Refresh the display
    }
    
    function showPage(index) {
      // Determine how many items to show based on screen size
      const activeItemsPerPage = isMobile ? mobileItemsPerPage : itemsPerPage;
      
      // Handle wrapping (for infinite carousel)
      let pageIndex = index;
      if (pageIndex < 0) pageIndex = totalPages - 1;
      if (pageIndex >= totalPages) pageIndex = 0;
      
      // Calculate start and end indices for visible items
      const startIdx = pageIndex * activeItemsPerPage;
      const endIdx = Math.min(startIdx + activeItemsPerPage - 1, totalItems - 1);
      
      // Update item visibility
      items.forEach((item, i) => {
        const itemIndex = parseInt(item.getAttribute('data-leader-item'));
        const isVisible = itemIndex >= startIdx && itemIndex <= endIdx;
        
        // Position items properly for layout
        if (isVisible) {
          item.classList.add('opacity-100');
          item.classList.remove('opacity-0', 'absolute');
          // Position relative to the page
          const relativePosition = itemIndex % activeItemsPerPage;
          item.style.order = relativePosition;
        } else {
          item.classList.add('opacity-0', 'absolute');
          item.classList.remove('opacity-100');
          item.style.order = '';
        }
      });
      
      // Update indicators
      indicators.forEach((indicator, i) => {
        const indicatorValue = parseInt(indicator.getAttribute('data-leader-indicator'));
        const indicatorIndex = isMobile ? indicatorValue : indicatorValue / itemsPerPage;
        indicator.classList.toggle('bg-cuf-yellow', indicatorIndex === pageIndex);
        indicator.classList.toggle('bg-gray-300', indicatorIndex !== pageIndex);
      });
      
      currentIndex = pageIndex;
    }
    
    function nextPage() {
      showPage(currentIndex + 1);
    }
    
    function prevPage() {
      showPage(currentIndex - 1);
    }
    
    // Event listeners
    if (prevButton) prevButton.addEventListener('click', prevPage);
    if (nextButton) nextButton.addEventListener('click', nextPage);
    
    indicators.forEach((indicator) => {
      indicator.addEventListener('click', () => {
        const indicatorValue = parseInt(indicator.getAttribute('data-leader-indicator'));
        const index = isMobile ? indicatorValue : indicatorValue / itemsPerPage;
        showPage(index);
      });
    });
    
    // Handle auto-scrolling (mobile only)
    function startAutoScroll() {
      if (!isMobile) return; // Only auto-scroll on mobile
      
      stopAutoScroll(); // Clear any existing interval
      autoScrollInterval = setInterval(nextPage, 5000); // 3-second interval
    }
    
    function stopAutoScroll() {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    }
    
    // Initialize
    updateItemsPerPage();
    startAutoScroll();
    
    // Handle window resize
    window.addEventListener('resize', function() {
      updateItemsPerPage();
      startAutoScroll(); // Restart auto-scroll if needed
    });
});