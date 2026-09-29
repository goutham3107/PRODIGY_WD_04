// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth scrolling and active link highlighting
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        navLinks.classList.remove('active'); // Close mobile menu
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Reveal animations on scroll
const revealElements = document.querySelectorAll('.section');

const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
};

const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// --- Space Canvas Background (Stars and Moon) ---
const canvas = document.getElementById('space-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Create stars
    const stars = [];
    const numStars = 200;

    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5,
            speed: Math.random() * 0.5 + 0.1, // Parallax effect speed
            alpha: Math.random() * 0.5 + 0.3
        });
    }

    // Moon settings
    const moonRadius = 60;
    
    // Mouse tracking for subtle parallax on moon and stars
    let mouseX = width / 2;
    let mouseY = height / 2;
    let scrollY = window.scrollY;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Offset based on mouse position and scroll
        const offsetX = (mouseX - width / 2) * 0.05;
        const offsetY = (mouseY - height / 2) * 0.05 + scrollY * 0.15; // Move up on scroll

        // Draw Moon (Top Right)
        const moonX = width - Math.min(width * 0.2, 200) - offsetX * 0.5;
        const moonY = Math.min(height * 0.2, 150) - offsetY * 0.8;
        
        // Moon Glow
        const gradient = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.8, moonX, moonY, moonRadius * 3);
        gradient.addColorStop(0, 'rgba(242, 201, 76, 0.4)'); // Soft gold glow
        gradient.addColorStop(1, 'rgba(242, 201, 76, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Moon Body
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Craters (subtle details)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.arc(moonX - 15, moonY - 10, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(moonX + 20, moonY + 15, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(moonX - 5, moonY + 25, 8, 0, Math.PI * 2);
        ctx.fill();

        // Draw Stars
        stars.forEach(star => {
            // Apply slight movement upwards
            star.y -= star.speed;
            
            // Loop stars back to bottom
            if (star.y < 0) {
                star.y = height;
                star.x = Math.random() * width;
            }

            // Apply subtle parallax based on mouse
            const finalX = star.x - offsetX * star.speed;
            const finalY = star.y - offsetY * star.speed;

            // Draw star
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.beginPath();
            ctx.arc(finalX, finalY, star.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    // Start animation loop
    draw();
}
