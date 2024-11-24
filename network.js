class Node {
    constructor(x, y, color, speed = 0.5) {
        this.x = x;
        this.y = y;
        this.connections = [];
        this.speed = Math.random() * speed + 0.2;
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * 2 + 1;
        this.connectionDistance = 150;
        this.color = color;
    }

    update(width, height) {
        // Move in a slight random direction
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Randomly change angle
        this.angle += (Math.random() - 0.5) * 0.1;

        // Bounce off edges
        if (this.x < 0 || this.x > width) {
            this.angle = Math.PI - this.angle;
        }
        if (this.y < 0 || this.y > height) {
            this.angle = -this.angle;
        }

        // Keep within bounds
        this.x = Math.max(0, Math.min(width, this.x));
        this.y = Math.max(0, Math.min(height, this.y));
    }
}

class NeuralNetwork {
    constructor(startSide = 'left') {
        this.canvas = document.getElementById('networkCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.numNodes = 40;
        this.connectionOpacityFactor = 0.4;
        this.startSide = startSide;
        this.color = startSide === 'left' ? 
            getComputedStyle(document.documentElement).getPropertyValue('--accent-1').trim() :
            getComputedStyle(document.documentElement).getPropertyValue('--accent-2').trim();
        this.init();
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    init() {
        // Create nodes based on start side
        for (let i = 0; i < this.numNodes; i++) {
            let x, y;
            if (this.startSide === 'left') {
                x = Math.random() * (this.canvas.width * 0.7); // Left 70% of screen
                y = Math.random() * this.canvas.height;
            } else {
                x = this.canvas.width * 0.3 + Math.random() * (this.canvas.width * 0.7); // Right 70% of screen
                y = Math.random() * this.canvas.height;
            }
            this.nodes.push(new Node(x, y, this.color, this.startSide === 'left' ? 0.4 : 0.3));
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    drawConnections() {
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 1;

        for (let i = 0; i < this.nodes.length; i++) {
            const nodeA = this.nodes[i];
            for (let j = i + 1; j < this.nodes.length; j++) {
                const nodeB = this.nodes[j];
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < nodeA.connectionDistance) {
                    const opacity = (1 - distance / nodeA.connectionDistance) * this.connectionOpacityFactor;
                    this.ctx.beginPath();
                    this.ctx.moveTo(nodeA.x, nodeA.y);
                    this.ctx.lineTo(nodeB.x, nodeB.y);
                    this.ctx.globalAlpha = opacity;
                    this.ctx.stroke();
                }
            }
        }
        this.ctx.globalAlpha = 1;
    }

    drawNodes() {
        this.ctx.fillStyle = this.color;

        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    update() {
        this.nodes.forEach(node => node.update(this.canvas.width, this.canvas.height));
    }

    draw() {
        this.drawConnections();
        this.drawNodes();
    }
}

class NetworkManager {
    constructor() {
        this.canvas = document.getElementById('networkCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.networks = [
            new NeuralNetwork('left'),
            new NeuralNetwork('right')
        ];
        this.animate();
    }

    update() {
        this.networks.forEach(network => network.update());
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.networks.forEach(network => network.draw());
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Start the animation when the page loads
window.addEventListener('load', () => {
    new NetworkManager();
});
