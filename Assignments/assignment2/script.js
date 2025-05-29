document.addEventListener('DOMContentLoaded', function() {
    // Animate progress bars on page load
    animateProgressBars();
    
    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll('.slide-in, .fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = entry.target.classList.contains('slide-in') ? 
                    'slideIn 1s ease forwards' : 'fadeIn 1s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
    
    // Button to re-animate progress bars
    const animateBtn = document.querySelector('.animated-btn');
    if (animateBtn) {
        animateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            animateProgressBars();
        });
    }
});

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        // Reset animation
        bar.style.width = '0';
        // Force reflow to restart animation
        void bar.offsetWidth;
        // Set to final width
        const targetWidth = bar.style.width;
        bar.style.width = targetWidth;
    });
}