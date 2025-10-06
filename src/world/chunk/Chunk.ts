import { vec3d } from "../../utils/world/PerlinNoise";
import { Block, BlockState } from "../block/Block";

export interface WorldBlock {
    block: Block;
    blockstate: BlockState;
    vec3d: vec3d;
}

export class Chunk {
    chunkX: number;
    chunkZ: number;
    chunkData: WorldBlock[][][];
    size: number = 16;
    height: number = 128;

    constructor(chunkX: number, chunkZ: number, CHUNK_SIZE: number, CHUNK_HEIGHT: number) {
        this.chunkX = chunkX;
        this.chunkZ = chunkZ;

        this.size =  CHUNK_SIZE;
        this.height = CHUNK_HEIGHT;

        this.chunkData = []; // x y z ?
    }

    getBlockAt(x: number, y: number, z: number): WorldBlock {
        if (!this.chunkData[x]) this.chunkData[x] = [];
        if (!this.chunkData[x][y]) this.chunkData[x][y] = [];

        return this.chunkData[x][y][z];
    }

    setBlockAt(x: number, y: number, z: number, block: WorldBlock): void {
        if (!this.chunkData[x]) this.chunkData[x] = [];
        if (!this.chunkData[x][y]) this.chunkData[x][y] = [];
        
        this.chunkData[x][y][z] = block;
    }
}

