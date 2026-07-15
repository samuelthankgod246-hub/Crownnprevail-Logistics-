$(document).ready(function() {
  const radialObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let $svg = $(entry.target);
        let percent = $svg.data('percentage');
        let radius = $svg.find('circle.complete').attr('r');
        let circumference = 2 * Math.PI * radius;
        let strokeDashOffset = circumference - ((percent * circumference) / 100);
        
        $svg.find('circle.complete').animate({'stroke-dashoffset': strokeDashOffset}, 1250);
        observer.unobserve(entry.target); // Run once, then stop observing for better performance
      }
    });
  }, { threshold: 0.25 });

  $('svg.radial-progress').each(function() {
    radialObserver.observe(this);
  });
});