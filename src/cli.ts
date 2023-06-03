#!/usr/bin/env node

import { program } from 'commander';

import { fuse } from '#src/fuse.js';

program
  .name('prisma-fuse')
  .description('Fuse multiple Prisma schema files into one.')
  .version('0.0.1')
  .option(
    '-b, --base-file <string>',
    'Base file usually with datasource & generator statement.',
    'src/prisma/base.prisma',
  )
  .option(
    '-o, --output-file <string>',
    'Output file.',
    'src/prisma/schema.prisma',
  )
  .option(
    '-s, --schema-file-glob <string>',
    'Glob pattern of Prisma schema files to include.',
    'src/**/*.prisma',
  )
  .option(
    '-e, --excluded-file-glob <string>',
    'Glob pattern of excluded files (e.g schema.prisma in migrations/generated folder).',
    'src/**/schema.prisma',
  )
  .option(
    '--strip-comments',
    'Strip out lines that start with `//`. Lines that start with `///` will not be stripped.',
    false,
  )
  .option('--verbose', 'Verbose logging.', false)
  .action(async (options) => {
    await fuse({
      baseFile: options.baseFile,
      outputFile: options.outputFile,
      schemaFileGlob: options.schemaFileGlob,
      excludedFileGlob: options.excludedFileGlob,
      stripComments: options.stripComments,
      verbose: options.verbose,
    });
  });

program.parse();
