import { beforeEach, expect, describe, it } from 'vitest';

import { MessageHttpController } from './api/httpControllers/messageHttpController/messageHttpController.js';
import { messageSymbols } from './symbols.js';
import { Application } from '../../core/application.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';

describe('MessageModule', () => {
  let container: DependencyInjectionContainer;

  beforeEach(async () => {
    container = Application.createContainer();
  });

  it('declares bindings', async () => {
    expect(container.get<MessageHttpController>(messageSymbols.messageHttpController)).toBeInstanceOf(
      MessageHttpController,
    );
  });
});
