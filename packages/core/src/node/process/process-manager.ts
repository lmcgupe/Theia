/*
 * Copyright (C) 2017 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
import { injectable } from 'inversify';
import { Process } from './process';

@injectable()
export class ProcessManager {

    protected readonly processes: Map<number, Process> = new Map();
    protected id: number = 0;

    register(process: Process): number {
        const id = this.id;
        this.processes.set(id, process);
        this.id++;
        return id;
    }

    get(id: number): Process | undefined {
        return this.processes.get(id);
    }

    delete(process: Process): void {
        this.processes.delete(process.id);
    }
}
