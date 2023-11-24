import { beforeEach, expect, describe, it } from 'vitest';

import { IssueHttpController } from './api/httpControllers/issueHttpController/issueHttpController.js';
import { issueSymbols } from './symbols.js';
import { Application } from '../../core/application.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';

describe('IssueModule', () => {
  let container: DependencyInjectionContainer;

  beforeEach(async () => {
    container = Application.createContainer();
  });

  it('declares bindings', async () => {
    expect(container.get<IssueHttpController>(issueSymbols.issueHttpController)).toBeInstanceOf(
      IssueHttpController,
    );
  });
});
