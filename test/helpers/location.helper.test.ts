import { Location as LocationHelper } from '../../bin/helpers/location.helper';
import { join } from 'path';
import { mkdirSync, rmSync, writeFileSync } from 'fs';

describe('Location', () => {
  const base = 'test-location';

  const textString = 'Welcome to JihyunLab.';

  const dir = join(base, 'dir');
  const file = join(dir, 'file.txt');

  beforeAll(() => {
    mkdirSync(base, { recursive: true });
    mkdirSync(dir, { recursive: true });

    writeFileSync(file, textString);
  });

  afterAll(() => {
    rmSync(dir, { recursive: true, force: true });
    rmSync(base, { recursive: true, force: true });
  });

  test('toRelative()', () => {
    const location = LocationHelper.toRelative(dir);
    expect(location).toBe(dir);
  });

  test('isDirectory(): dir', () => {
    const isDirectory = LocationHelper.isDirectory(dir);
    expect(isDirectory).toBe(true);
  });

  test('isDirectory(): file', () => {
    const isDirectory = LocationHelper.isDirectory(file);
    expect(isDirectory).toBe(false);
  });

  test('isDirectory(): not exist', () => {
    const isDirectory = LocationHelper.isDirectory('temp');
    expect(isDirectory).toBe(undefined);
  });

  test('toDirectory(): dir', () => {
    const directory = LocationHelper.toDirectory(dir);
    expect(directory).toBe(LocationHelper.toAbsolute(dir));
  });

  test('toDirectory(): file', () => {
    const directory = LocationHelper.toDirectory(file, true);
    expect(directory).toBe(LocationHelper.toAbsolute(dir));
  });
});
