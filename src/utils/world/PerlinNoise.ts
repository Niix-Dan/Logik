export interface vec3d {
    x: number;
    y: number;
    z: number;
}

export class PerlinNoise {
    seed: number;
    perm: number[];

    constructor(seed: number) {
        this.seed = seed;
        this.perm = this.generatePermutationTable(seed);
    }

    private generatePermutationTable(seed: number): number[] {
        const p = new Array(256).fill(0).map((_, i) => i);
        let random = this.mulberry32(seed);

        for (let i = 255; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [p[i], p[j]] = [p[j], p[i]];
        }

        return [...p, ...p];
    }

    private mulberry32(seed: number): () => number {
        return function() {
            let t = seed += 0x6D2B79F5;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        }
    }

    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private lerp(a: number, b: number, t: number): number {
        return a + t * (b - a);
    }

    private grad(hash: number, x: number, y: number, z: number): number {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    getNoiseAt(p: vec3d): number {
        let xi = Math.floor(p.x) & 255;
        let yi = Math.floor(p.y) & 255;
        let zi = Math.floor(p.z) & 255;

        let xf = p.x - Math.floor(p.x);
        let yf = p.y - Math.floor(p.y);
        let zf = p.z - Math.floor(p.z);

        let u = this.fade(xf);
        let v = this.fade(yf);
        let w = this.fade(zf);

        const aaa = this.perm[this.perm[this.perm[xi] + yi] + zi];
        const aba = this.perm[this.perm[this.perm[xi] + yi + 1] + zi];
        const aab = this.perm[this.perm[this.perm[xi] + yi] + zi + 1];
        const abb = this.perm[this.perm[this.perm[xi] + yi + 1] + zi + 1];
        const baa = this.perm[this.perm[this.perm[xi + 1] + yi] + zi];
        const bba = this.perm[this.perm[this.perm[xi + 1] + yi + 1] + zi];
        const bab = this.perm[this.perm[this.perm[xi + 1] + yi] + zi + 1];
        const bbb = this.perm[this.perm[this.perm[xi + 1] + yi + 1] + zi + 1];

        const x1 = this.lerp(
            this.grad(aaa, xf, yf, zf),
            this.grad(baa, xf - 1, yf, zf),
            u
        );
        const x2 = this.lerp(
            this.grad(aba, xf, yf - 1, zf),
            this.grad(bba, xf - 1, yf - 1, zf),
            u
        );
        const y1 = this.lerp(x1, x2, v);

        const x3 = this.lerp(
            this.grad(aab, xf, yf, zf - 1),
            this.grad(bab, xf - 1, yf, zf - 1),
            u
        );
        const x4 = this.lerp(
            this.grad(abb, xf, yf - 1, zf - 1),
            this.grad(bbb, xf - 1, yf - 1, zf - 1),
            u
        );
        const y2 = this.lerp(x3, x4, v);

        return this.lerp(y1, y2, w);
    }
}
