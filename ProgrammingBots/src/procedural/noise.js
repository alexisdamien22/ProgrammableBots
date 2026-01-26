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

    random2D(x, y, seed = 0) {
        let n = x * 0x85ebca6b ^ y * 0xc2b2ae35 ^ seed * 0x27d4eb2f;
        n ^= n >> 16;
        n *= 0x7feb352d;
        n ^= n >> 15;
        n *= 0x846ca68b;
        n ^= n >> 16;

        // Convert uint32 → [-1, 1]
        return (n >>> 0) / 2147483647 * 2 - 1;
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