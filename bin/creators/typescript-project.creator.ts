import { Location as LocationHelper } from '../helpers/location.helper';
import { readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync, spawnSync } from 'child_process';

export const TypescriptProject = {
  createApp(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error('project name is empty.');
    }

    const location = LocationHelper.toAbsolute(name);

    if (LocationHelper.isExist(location)) {
      throw new Error('project name already exists.');
    }

    execSync(`git clone https://github.com/jihyunlab/typescript-starter.git ${name}`, { stdio: 'pipe' });

    const basename = LocationHelper.toBasename(location);

    // package.json
    const packageJson = JSON.parse(readFileSync(join(location, 'package.json')).toString());

    packageJson['name'] = basename;
    packageJson['description'] = '';
    packageJson['license'] = 'UNLICENSED';

    delete packageJson['author'];
    delete packageJson['homepage'];
    delete packageJson['repository'];
    delete packageJson['bugs'];

    packageJson['keywords'] = [];

    writeFileSync(join(location, 'package.json'), JSON.stringify(packageJson, null, 2));

    // README.md
    writeFileSync(join(location, 'README.md'), `# ${basename}`);

    // LICENSE
    rmSync(join(location, 'LICENSE'), { recursive: true, force: true });

    // package-lock.json
    rmSync(join(location, 'package-lock.json'), { recursive: true, force: true });

    // .git
    rmSync(join(location, '.git'), { recursive: true, force: true });

    // npm i
    spawnSync('npm', ['i'], {
      cwd: location,
      env: process.env,
      shell: process.platform === 'win32',
      stdio: [null, process.stdout, process.stderr],
    });
  },
};
