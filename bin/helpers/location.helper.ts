import * as fs from 'fs';
import * as path from 'path';

export const Location = {
  isAbsolute(location: string) {
    return path.isAbsolute(location);
  },

  toAbsolute(location: string) {
    let absolute: string;

    if (this.isAbsolute(location)) {
      absolute = location;
    } else {
      absolute = path.join(process.cwd(), location);
    }

    return path.normalize(absolute);
  },

  toRelative(location: string) {
    const absolute = this.toAbsolute(location);
    const relative = path.relative(process.cwd(), absolute);

    return path.normalize(relative);
  },

  toBasename(location: string) {
    return path.basename(this.toAbsolute(location));
  },

  isExist(location: string) {
    return fs.existsSync(location);
  },

  isDirectory(location: string) {
    if (!this.isExist(location)) {
      return undefined;
    }

    return fs.lstatSync(location).isDirectory();
  },

  toDirectory(location: string, file = false) {
    let dirname: string;

    if (file) {
      dirname = this.toAbsolute(path.dirname(location));
    } else {
      dirname = this.toAbsolute(location);
    }

    return path.normalize(dirname);
  },
};
