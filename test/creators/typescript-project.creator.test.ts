import { TypescriptProject as TypescriptProjectCreator } from '../../bin/creators/typescript-project.creator';
import { join } from 'path';
import { mkdirSync, readFileSync, rmSync } from 'fs';

describe('TypescriptProject', () => {
  const base = 'test-typescriptproject';
  const name = 'my-app';

  const dir = join(base, name);

  beforeAll(() => {
    rmSync(dir, { recursive: true, force: true });
    rmSync(base, { recursive: true, force: true });

    mkdirSync(base, { recursive: true });
  });

  afterAll(() => {
    rmSync(dir, { recursive: true, force: true });
    rmSync(base, { recursive: true, force: true });
  });

  test('createApp()', () => {
    expect(() => {
      TypescriptProjectCreator.createApp(dir);

      const packageJson = JSON.parse(readFileSync(join(dir, 'package.json')).toString());
      expect(packageJson['name']).toBe(name);
    }).not.toThrow();
  });

  test('createApp(): exception(empty)', () => {
    expect(() => {
      TypescriptProjectCreator.createApp(' ');
    }).toThrow(Error);
  });

  test('createApp(): exception(already exists)', () => {
    expect(() => {
      mkdirSync(dir, { recursive: true });
      TypescriptProjectCreator.createApp(dir);
    }).toThrow(Error);
  });
});
