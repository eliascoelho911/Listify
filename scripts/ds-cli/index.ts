#!/usr/bin/env node
/**
 * DS CLI - Design System Component Generator
 *
 * Usage:
 *   npm run ds generate atom <name>      Generate an atom component
 *   npm run ds generate molecule <name>  Generate a molecule component
 *   npm run ds generate organism <name>  Generate an organism component
 *   npm run ds -- --help                 Show help
 *
 * Flags:
 *   --no-story    Skip generating Storybook story
 *   --no-test     Skip generating test file
 */

import { Command } from 'commander';

import { type ComponentType, generateComponent } from './generate';

const program = new Command();

program.name('ds').description('Design System component generator CLI').version('1.0.0');

program
  .command('generate <type> <name>')
  .description('Generate a new Design System component')
  .option('--no-story', 'Skip generating Storybook story file')
  .option('--no-test', 'Skip generating test file')
  .action((type: string, name: string, options: { story: boolean; test: boolean }) => {
    const validTypes: ComponentType[] = ['atom', 'molecule', 'organism'];

    if (!validTypes.includes(type as ComponentType)) {
      console.error(`❌ Error: Invalid component type "${type}"`);
      console.error(`Valid types: ${validTypes.join(', ')}`);
      process.exit(1);
    }

    try {
      generateComponent({
        name,
        type: type as ComponentType,
        withStory: options.story,
        withTest: options.test,
      });
    } catch (error) {
      console.error(
        `❌ Error generating component: ${error instanceof Error ? error.message : String(error)}`,
      );
      process.exit(1);
    }
  });

program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
