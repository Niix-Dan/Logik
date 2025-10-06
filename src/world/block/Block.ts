


export class BlockState {
    block : Block;
    data: Object;
    constructor(block: Block) {
        this.block = block;
        this.data = {};
    }

    getData(): Object {
        return this.data;
    }
}

export class Block {
    
}

