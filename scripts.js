// Neural Network Animation
function initNeuralNetwork() {
    const canvas = document.getElementById('neural-network');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Increased number of nodes
    const nodes = [];
    const numNodes = 40; // More nodes
    const nodeRadius = 2;
    const connectionDistance = 150;
    const activeNodes = new Set();
    
    // Colors from our theme
    const colors = {
        node: '#7B61FF',
        connection: 'rgba(123, 97, 255, 0.15)',
        activeNode: '#00F0FF',
        activeConnection: 'rgba(0, 240, 255, 0.3)'
    };

    // Initialize nodes with random positions
    for (let i = 0; i < numNodes; i++) {
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            active: false,
            activationTime: 0
        });
    }

    // Randomly activate nodes
    function activateRandomNode() {
        const node = nodes[Math.floor(Math.random() * nodes.length)];
        node.active = true;
        node.activationTime = 0;
        activeNodes.add(node);

        // Activate connected nodes
        nodes.forEach(otherNode => {
            const distance = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);
            if (distance < connectionDistance && Math.random() > 0.5) {
                otherNode.active = true;
                otherNode.activationTime = 0;
                activeNodes.add(otherNode);
            }
        });
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Update and draw connections
        nodes.forEach(node => {
            nodes.forEach(otherNode => {
                const distance = Math.hypot(node.x - otherNode.x, node.y - otherNode.y);
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(otherNode.x, otherNode.y);
                    
                    if (node.active && otherNode.active) {
                        ctx.strokeStyle = colors.activeConnection;
                    } else {
                        ctx.strokeStyle = colors.connection;
                    }
                    
                    ctx.stroke();
                }
            });
        });

        // Update and draw nodes
        nodes.forEach(node => {
            // Move nodes
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            // Keep within bounds
            node.x = Math.max(0, Math.min(width, node.x));
            node.y = Math.max(0, Math.min(height, node.y));

            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = node.active ? colors.activeNode : colors.node;
            ctx.fill();

            // Update activation
            if (node.active) {
                node.activationTime++;
                if (node.activationTime > 60) { // Deactivate after 1 second
                    node.active = false;
                    activeNodes.delete(node);
                }
            }
        });

        // Randomly activate nodes
        if (Math.random() < 0.03) activateRandomNode();

        requestAnimationFrame(animate);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Start animation
    animate();
}

// Header scroll behavior
let lastScroll = 0;
const header = document.querySelector('header');
const scrollThreshold = 50;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('header-hidden');
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
        // Scrolling down & past threshold
        header.classList.add('header-hidden');
    } else if (currentScroll < lastScroll) {
        // Scrolling up
        header.classList.remove('header-hidden');
    }
    
    lastScroll = currentScroll;
});

// Mobile Menu Toggle
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-links a');

function toggleMenu() {
    navbar.classList.toggle('mobile-menu-open');
    document.body.style.overflow = navbar.classList.contains('mobile-menu-open') ? 'hidden' : '';
}

mobileMenuButton.addEventListener('click', toggleMenu);

// Close menu when clicking nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('mobile-menu-open');
        document.body.style.overflow = '';
    });
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initNeuralNetwork);
