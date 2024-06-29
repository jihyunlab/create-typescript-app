import { ProjectCreator } from '../../bin/creators/project-creator.service';
import { join } from 'path';
import { mkdirSync, readFileSync, rmSync } from 'fs';

describe('ProjectCreator', () => {
  const base = 'test-project';
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
      ProjectCreator.createApp(dir);

      const packageJson = JSON.parse(
        readFileSync(join(dir, 'package.json')).toString()
      );
      expect(packageJson['name']).toBe(name);
    }).not.toThrow();
  });

  test('createApp(): exception(empty)', () => {
    expect(() => {
      ProjectCreator.createApp(' ');
    }).toThrow(Error);
  });

  test('createApp(): exception(already exists)', () => {
    expect(() => {
      mkdirSync(dir, { recursive: true });
      ProjectCreator.createApp(dir);
    }).toThrow(Error);
  });
});
