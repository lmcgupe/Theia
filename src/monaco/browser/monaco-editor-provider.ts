/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from 'inversify';
import { MonacoToProtocolConverter, ProtocolToMonacoConverter } from 'monaco-languageclient';
import URI from "../../application/common/uri";
import { MonacoEditor } from "./monaco-editor";
import { MonacoEditorService } from "./monaco-editor-service";
import { MonacoModelResolver } from "./monaco-model-resolver";
import { MonacoContextMenuService } from "./monaco-context-menu";
import { MonacoWorkspace } from "./monaco-workspace";
import { MonacoCommandServiceFactory } from "./monaco-command-service";
import { PreferenceService } from '../../preferences/common';


@injectable()
export class MonacoEditorProvider {

    constructor(
        @inject(MonacoEditorService) protected readonly editorService: MonacoEditorService,
        @inject(MonacoModelResolver) protected readonly monacoModelResolver: MonacoModelResolver,
        @inject(MonacoContextMenuService) protected readonly contextMenuService: MonacoContextMenuService,
        @inject(MonacoToProtocolConverter) protected readonly m2p: MonacoToProtocolConverter,
        @inject(ProtocolToMonacoConverter) protected readonly p2m: ProtocolToMonacoConverter,
        @inject(MonacoWorkspace) protected readonly workspace: MonacoWorkspace,
        @inject(PreferenceService) protected readonly prefService: PreferenceService,
        @inject(MonacoCommandServiceFactory) protected readonly commandServiceFactory: MonacoCommandServiceFactory

    ) { }

    get(uri: URI): Promise<MonacoEditor> {
        return Promise.resolve(this.monacoModelResolver.createModelReference(uri).then(reference => {
            const commandService = this.commandServiceFactory();

            const node = document.createElement('div');
            const model = reference.object;
            const editor = new MonacoEditor(
                uri, node, this.m2p, this.p2m, this.workspace, this.prefService, {
                    model: model.textEditorModel,
                    wordWrap: false,
                    folding: true,
                    theme: 'vs-dark',
                    readOnly: model.readOnly
                }, {
                    editorService: this.editorService,
                    textModelResolverService: this.monacoModelResolver,
                    contextMenuService: this.contextMenuService,
                    commandService
                }
            );
            editor.onDispose(() => reference.dispose());

            const standaloneCommandService = new monaco.services.StandaloneCommandService(editor.instantiationService);
            commandService.setDelegate(standaloneCommandService);

            return editor;
        }));
    }

}