
import { PerlinNoise } from "../../utils/world/PerlinNoise";
import { Chunk } from '../chunk/Chunk';
import { Block, BlockState } from '../block/Block';

import path from 'path';
import fs from 'fs';

const CHUNK_SIZE = 16;    // X & Z
const CHUNK_HEIGTH = 128; // Y

const SEED = 0;
const SAVE_DIRECTORY = path.join(__dirname, '..', '..', 'save');

if (!fs.existsSync(SAVE_DIRECTORY)) fs.mkdirSync(SAVE_DIRECTORY, { recursive: true });

const Perlin = new PerlinNoise(SEED); // Magic Thingy

export class Generator {
    frequency = 0.05;
    amplitude = 20;
    baseHeight = 64;

    generate(chunkX: number, chunkZ: number, chunk: Chunk) : Chunk {
        for (let x = 0 ; x < CHUNK_SIZE ; x++) {
            for (let z = 0 ; z < CHUNK_SIZE ; z++) {
                const worldX = chunkX * CHUNK_SIZE + x;
                const worldZ = chunkZ * CHUNK_SIZE + z;

                const noiseValue = Perlin.getNoiseAt({
                    x: worldX * this.frequency,
                    y: 0,
                    z: worldZ * this.frequency
                });

                const normalized = (noiseValue + 1) / 2; // [-1, 1] -> [0, 1]
                
                const height = Math.floor(this.baseHeight + normalized * this.amplitude);
                for (let y = 0 ; y < CHUNK_HEIGTH ; y++) {
                    if (y < height) {
                        const block = new Block();
                        const blockState = new BlockState(block);

                        const worldBlock = {
                            block, blockstate: blockState, vec3d: { x: worldX, y, z: worldZ }
                        }
                        chunk.setBlockAt(x, y, z, worldBlock);
                    }
                }
            }
        }

        return chunk;
    }

}

