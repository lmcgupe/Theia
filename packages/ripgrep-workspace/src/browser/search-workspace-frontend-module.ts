/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { ContainerModule, interfaces } from 'inversify';
import { CommandContribution, KeybindingContribution, MenuContribution, } from "@theia/core/lib/common";
import { WebSocketConnectionProvider } from '@theia/core/lib/browser';
import { SearchWorkSpaceFrontendContribution } from './search-workspace-contribution';
import { SearchWorkSpaceService } from './search-workspace';
import { ISearchWorkSpaceServer } from '../common/search-workspace-service';
import { SearchWorkSpaceServer } from '../common/search-workspace-server';

export const searchPath = '/services/search';

export default new ContainerModule((bind: interfaces.Bind, unbind: interfaces.Unbind, isBound: interfaces.IsBound, rebind: interfaces.Rebind) => {
    bind(ISearchWorkSpaceServer).toDynamicValue(ctx => {
        const provider = ctx.container.get(WebSocketConnectionProvider);
        return provider.createProxy<SearchWorkSpaceServer>(searchPath);
    }).inSingletonScope();

    bind(SearchWorkSpaceService).toSelf().inSingletonScope();

    bind(SearchWorkSpaceFrontendContribution).toSelf().inSingletonScope();
    for (const identifier of [CommandContribution, MenuContribution, KeybindingContribution]) {
        bind(identifier).toDynamicValue(ctx =>
            ctx.container.get(SearchWorkSpaceFrontendContribution)
        ).inSingletonScope();
    }
});