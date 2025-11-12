import { LocationHelper } from '../helpers/location.helper';
import { execSync, spawnSync } from 'child_process';
import { readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

export const ProjectCreator = {
  createApp(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error('project name is empty.');
    }

    const location = LocationHelper.toAbsolute(name);

    if (LocationHelper.isExist(location)) {
      throw new Error('project name already exists.');
    }

    execSync(
      `git clone https://github.com/jihyunlab/typescript-starter.git ${name}`,
      { stdio: 'pipe' }
    );

    const basename = LocationHelper.toBasename(location);

    // Update package.json
    const packageJson = JSON.parse(
      readFileSync(join(location, 'package.json')).toString()
    );

    packageJson['name'] = basename;
    packageJson['version'] = '1.0.0';
    packageJson['description'] = '';
    packageJson['license'] = 'UNLICENSED';

    delete packageJson['author'];
    delete packageJson['homepage'];
    delete packageJson['repository'];
    delete packageJson['bugs'];

    packageJson['keywords'] = [];
    packageJson['devDependencies'] = {};

    writeFileSync(
      join(location, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Create README.md
    writeFileSync(join(location, 'README.md'), `# ${basename}`);

    // Delete LICENSE
    rmSync(join(location, 'LICENSE'), { recursive: true, force: true });

    // Delete package-lock.json
    rmSync(join(location, 'package-lock.json'), {
      recursive: true,
      force: true,
    });

    // Delete .git
    rmSync(join(location, '.git'), { recursive: true, force: true });

    // Install
    spawnSync('npm', ['i'], {
      cwd: location,
      env: process.env,
      shell: process.platform === 'win32',
      stdio: [null, process.stdout, process.stderr],
    });

    // Install TypeScript and Node
    spawnSync('npm', ['i', '--save-dev', '@types/node', 'typescript'], {
      cwd: location,
      env: process.env,
      shell: process.platform === 'win32',
      stdio: [null, process.stdout, process.stderr],
    });

    // Install @jihyunlab/eslint-config
    spawnSync(
      'npm',
      [
        'i',
        '--save-dev',
        '@jihyunlab/eslint-config',
        'eslint',
        '@eslint/js',
        'typescript',
        'typescript-eslint',
      ],
      {
        cwd: location,
        env: process.env,
        shell: process.platform === 'win32',
        stdio: [null, process.stdout, process.stderr],
      }
    );

    // Install @jihyunlab/prettier-config
    spawnSync(
      'npm',
      [
        'i',
        '--save-dev',
        '@jihyunlab/prettier-config',
        'prettier',
        'eslint-config-prettier',
        'eslint-plugin-prettier',
      ],
      {
        cwd: location,
        env: process.env,
        shell: process.platform === 'win32',
        stdio: [null, process.stdout, process.stderr],
      }
    );

    // Install Jest
    spawnSync('npm', ['i', '--save-dev', 'jest', 'ts-jest', '@types/jest'], {
      cwd: location,
      env: process.env,
      shell: process.platform === 'win32',
      stdio: [null, process.stdout, process.stderr],
    });
  },
};
