import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';

export default class AxeReporter {
    IS_WINDOWS: boolean;
    process: ChildProcessWithoutNullStreams | null;
    timestamp: Date;
    fileName: string;
    fileExtension: string;

    constructor() {
        this.IS_WINDOWS = process.platform === 'win32';
        this.process = null;
        this.timestamp = new Date();
        this.fileName = `${this.timestamp.getFullYear()}_${this.timestamp.getMonth()}_${this.timestamp.getDate()}_report`
        this.fileExtension = 'json';
    }

    create = (target: string = 'https://google.com', fileName: string = this.fileName) => {
        if (fileName) { this.fileName = fileName }
        const spawnCmd = this.IS_WINDOWS ? 'npm.cmd' : 'npm';
        this.process = spawn(
            `${spawnCmd}`,
            [
                'run',
                'axe',
                '--',
                `${target}`,
                '--tags',
                'wcag2a',
                '--dir',
                './axe-results/',
                '--save',
                `${this.fileName}.${this.fileExtension}`,
            ]
        );

        this.process.stdout.on('data', (d) => console.log(d.toString()));
    }
}
