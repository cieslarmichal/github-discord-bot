import { DependencyInjectionContainer } from './dependencyInjectionContainer.js';

export class DependencyInjectionContainerFactory {
  public static create(): DependencyInjectionContainer {
    return new DependencyInjectionContainer();
  }
}
