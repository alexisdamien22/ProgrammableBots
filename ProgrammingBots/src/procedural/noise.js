export class Noise {
    constructor(seed = 1) {
        this.perm = new Array(512);
        this.gradients = [];

        // Initialize permutation table
        const p = Array.from({ length: 256 }, (_, i) => i);

        // Simple seeded shuffle
        let random = () => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }

        for (let i = 0; i < 512; i++) {
            this.perm[i] = p[i & 255];
        }

        // Random gradient vectors
        const grad = [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
        for (let i = 0; i < 512; i++) {
            this.gradients[i] = grad[this.perm[i] % grad.length];
        }
    }

    normal(x, y, seed = 1) {
        const n = x * 374761393 + y * 668265263 + seed * 31;
        return (Math.sin(n) + 1) * 0.5;
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(a, b, t) {
        return a + t * (b - a);
    }

    dot(grad, x, y) {
        return grad[0] * x + grad[1] * y;
    }

    perlin(x, y) {
        let X = Math.floor(x) & 255;
        let Y = Math.floor(y) & 255;

        let xf = x - Math.floor(x);
        let yf = y - Math.floor(y);

        const topRight = this.gradients[this.perm[X + 1 + this.perm[Y + 1]]];
        const topLeft = this.gradients[this.perm[X + this.perm[Y + 1]]];
        const bottomRight = this.gradients[this.perm[X + 1 + this.perm[Y]]];
        const bottomLeft = this.gradients[this.perm[X + this.perm[Y]]];

        const u = this.fade(xf);
        const v = this.fade(yf);

        const x1 = this.lerp(
            this.dot(bottomLeft, xf, yf),
            this.dot(bottomRight, xf - 1, yf),
            u
        );

        const x2 = this.lerp(
            this.dot(topLeft, xf, yf - 1),
            this.dot(topRight, xf - 1, yf - 1),
            u
        );

        return this.lerp(x1, x2, v);
    }
}