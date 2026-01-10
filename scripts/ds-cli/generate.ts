/**
 * DS CLI - Component Generator
 */

import * as fs from 'fs';
import * as path from 'path';

export type ComponentType = 'atom' | 'molecule' | 'organism';

export interface GenerateOptions {
  name: string;
  type: ComponentType;
  withStory?: boolean;
  withTest?: boolean;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function readTemplate(type: ComponentType, file: string): string {
  const templatePath = path.join(__dirname, 'templates', file);
  return fs.readFileSync(templatePath, 'utf-8');
}

function replacePlaceholders(content: string, name: string): string {
  return content.replace(/{{NAME}}/g, capitalize(name));
}

export function generateComponent(options: GenerateOptions): void {
  const { name, type, withStory = true, withTest = true } = options;
  const componentName = capitalize(name);
  const componentDir = path.join(process.cwd(), 'src', 'design-system', `${type}s`, componentName);

  // Create component directory
  if (!fs.existsSync(componentDir)) {
    fs.mkdirSync(componentDir, { recursive: true });
  } else {
    console.error(`❌ Error: Component ${componentName} already exists at ${componentDir}`);
    process.exit(1);
  }

  // Generate main component file
  const componentTemplate = readTemplate(type, `${type}.template.tsx`);
  const componentContent = replacePlaceholders(componentTemplate, name);
  fs.writeFileSync(path.join(componentDir, `${componentName}.tsx`), componentContent);
  console.log(`✅ Created ${componentName}.tsx`);

  // Generate styles file
  const stylesTemplate = readTemplate('atom', 'atom.styles.template.ts');
  const stylesContent = replacePlaceholders(stylesTemplate, name);
  fs.writeFileSync(path.join(componentDir, `${componentName}.styles.ts`), stylesContent);
  console.log(`✅ Created ${componentName}.styles.ts`);

  // Generate types file
  const typesTemplate = readTemplate('atom', 'atom.types.template.ts');
  const typesContent = replacePlaceholders(typesTemplate, name);
  fs.writeFileSync(path.join(componentDir, `${componentName}.types.ts`), typesContent);
  console.log(`✅ Created ${componentName}.types.ts`);

  // Generate story file (if requested)
  if (withStory) {
    const storiesTemplate = readTemplate('atom', 'atom.stories.template.tsx');
    const storiesContent = replacePlaceholders(storiesTemplate, name).replace(
      'Atoms/',
      `${capitalize(type)}s/`,
    );
    fs.writeFileSync(path.join(componentDir, `${componentName}.stories.tsx`), storiesContent);
    console.log(`✅ Created ${componentName}.stories.tsx`);
  }

  // Generate test file (if requested)
  if (withTest) {
    const testTemplate = readTemplate('atom', 'atom.test.template.tsx');
    const testContent = replacePlaceholders(testTemplate, name).replace('atoms', `${type}s`);
    const testDir = path.join(process.cwd(), 'tests', 'design-system', `${type}s`);
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    fs.writeFileSync(path.join(testDir, `${componentName}.test.tsx`), testContent);
    console.log(`✅ Created ${componentName}.test.tsx`);
  }

  console.log(`\n🎉 Component ${componentName} generated successfully!`);
  console.log(`\nNext steps:`);
  console.log(`1. Implement component logic in src/design-system/${type}s/${componentName}/`);
  console.log(`2. Update barrel export in src/design-system/${type}s/index.ts`);
  console.log(`3. Run: npm run lint`);
  console.log(`4. Run: npm test`);
  console.log(`5. View in Storybook: npm run storybook`);
}
