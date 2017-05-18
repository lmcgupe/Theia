/*
 * Copyright (C) 2017 Ericsson and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { JsonPreferenceService, PreferenceService } from './preference-service';
import { FileSystem, FileStat } from "../../filesystem/common/filesystem";
import { FileSystemWatcher } from "../../filesystem/common/filesystem-watcher"
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";


const expect = chai.expect;
let prefService: PreferenceService;
let fileWatcher: FileSystemWatcher;
let fs: FileSystem;

before(() => {
    chai.config.showDiff = true;
    chai.config.includeStack = true;
    chai.should();
    chai.use(chaiAsPromised);
});

describe('preference-service', () => {
    beforeEach(() => {
        fs = new FileSystemStub();
        fileWatcher = new FileSystemWatcher();
        prefService = new JsonPreferenceService(fs, fileWatcher, ".theia/prefs.json");
    });

    describe('01 #has preference', () => {
        it('should return true for the has preference', () => {
            return expect(prefService.has("lineNumbers")).to.eventually.equal(true);
        });

        it('should return false for the has preference', () => {
            return expect(prefService.has("nonExistingPref")).to.eventually.equal(false);
        });
    });

    describe('02 #get preference', () => {
        it('should get the value for the preference', () => {
            return expect(prefService.get("lineNumbers")).is.eventually.equal("on");
        });

        it('should get no value for unknown preference', () => {
            return expect(prefService.get("unknownPreference")).is.eventually.equal(undefined);
        });
    })

    describe('03 #onPreferenceChanged', () => {
        it('should get notified of changed pref', () => {

        });
    });
});

class FileSystemStub implements FileSystem {

    dummyFileStatRoot: FileStat = {
        uri: "/workspace",
        lastModification: 20,
        isDirectory: false,
    }

    dummyFileStat: FileStat = {
        uri: ".theia/prefs.json",
        lastModification: 20,
        isDirectory: false,
    }

    // Stub resolveContent
    resolveContent(uri: string, options?: { encoding?: string }): Promise<{ stat: FileStat, content: string }> {
        if (uri === "/workspace/.theia/prefs.json") {
            return new Promise<{ stat: FileStat, content: string }>((resolve) => {
                resolve({ stat: this.dummyFileStat, content: '{"lineNumbers": "on"}' });
            })
        } else {
            return new Promise<{ stat: FileStat, content: string }>((resolve) => {
                resolve({ stat: this.dummyFileStat, content: "test" });
            })
        }
    }
    // Stub getWorkSpaceRoot()
    getWorkspaceRoot(): Promise<FileStat> {
        return new Promise<FileStat>((resolve) => {
            resolve(this.dummyFileStatRoot)
        });
    }

    getFileStat(uri: string): Promise<FileStat> {
        return new Promise<FileStat>(() => { });
    }
    exists(uri: string): Promise<boolean> {
        return new Promise<boolean>(() => { });
    }

    setContent(file: FileStat, content: string, options?: { encoding?: string }): Promise<FileStat> {
        return new Promise<FileStat>(() => { });
    }
    move(sourceUri: string, targetUri: string, options?: { overwrite?: boolean }): Promise<FileStat> {
        return new Promise<FileStat>(() => { });
    }
    copy(sourceUri: string, targetUri: string, options?: { overwrite?: boolean, recursive?: boolean }): Promise<FileStat> {
        return new Promise<FileStat>(() => { });
    }
    createFile(uri: string, options?: { content?: string, encoding?: string }): Promise<FileStat> {
        return new Promise<FileStat>(() => { });
    }
    createFolder(uri: string): Promise<FileStat> {
        return new Promise<FileStat>(() => { });
    }
    touchFile(uri: string): Promise<FileStat> {
        return new Promise<FileStat>(() => { });
    }
    delete(uri: string, options?: { moveToTrash?: boolean }): Promise<void> {
        return new Promise<void>(() => { });
    }
    watchFileChanges(uri: string): Promise<void> {
        return new Promise<void>(() => { });
    }
    unwatchFileChanges(uri: string): Promise<void> {
        return new Promise<void>(() => { });

    }
    getEncoding(uri: string): Promise<string> {
        return new Promise<string>(() => { });
    }

    dispose(): void { }
}
