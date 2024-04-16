#!/usr/bin/env node

import { program } from 'commander';

import { fuse } from '#src/fuse.js';

program
  .name('prisma-fuse')
  .description('Fuse multiple Prisma schema files into one.')
  .version('0.0.6')
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
  .option(
    '--add-namespace-from-file-name',
    'Adds a `/// @namespace {namespace}` comment before each model using the prisma ' +
      'file name. For example, `user.prisma` would map to `/// @namespace User`. ' +
      'Compatible with https://github.com/samchon/prisma-markdown.',
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
      addNamespaceFromFileName: options.addNamespaceFromFileName,
      verbose: options.verbose,
    });
  });

program.parse();
