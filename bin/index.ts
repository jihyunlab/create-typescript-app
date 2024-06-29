#!/usr/bin/env node
import { Command } from 'commander';
import { ProjectCreator } from './creators/project-creator.service';
import { LocationHelper } from './helpers/location.helper';
import prompts, { InitialReturnValue } from 'prompts';
import { setMaxListeners } from 'events';

setMaxListeners(36);

const handleSigTerm = () => process.exit(0);

process.on('SIGINT', handleSigTerm);
process.on('SIGTERM', handleSigTerm);

const onPromptState = (state: {
  value: InitialReturnValue;
  aborted: boolean;
  exited: boolean;
}) => {
  if (state.aborted) {
    process.stdout.write('\x1B[?25h');
    process.stdout.write('\n');
    process.exit(1);
  }
};

const program = new Command('create-typescript-app')
  .description('JihyunLab Create typescript app')
  .addHelpText('after', ' ')
  .addHelpText('after', 'Usage example:')
  .addHelpText('after', '  npx @jihyunlab/create-typescript-app@latest')
  .version('1.0.0');

program.action(async () => {
  console.log('');

  const response = await prompts({
    onState: onPromptState,
    type: 'text',
    name: 'path',
    message: 'What is your project name?',
    initial: 'my-app',
    validate: (name) => {
      if (!name || name.trim().length === 0) {
        console.log('');
        console.log('error: project name is empty.');
        process.exit(1);
      }

      const location = LocationHelper.toAbsolute(name);

      if (LocationHelper.isExist(location)) {
        console.log('');
        console.log('error: project name already exists.');
        process.exit(1);
      }

      return true;
    },
  });

  try {
    ProjectCreator.createApp(response.path.trim());
  } catch (error) {
    if (error instanceof Error) {
      console.log(`error: ${error.message}`);
    } else {
      console.log(error);
    }

    process.exit(1);
  }
});

program.parse();
