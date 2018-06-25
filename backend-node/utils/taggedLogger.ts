export class TaggedLogger {
    private tag: string;

    constructor(tag) {
        this.tag = tag;
    }

    log(content) {
        content
            .split('\n')
            .forEach((message) => console.log(`[${this.tag}]: ${message}`));
    }
}