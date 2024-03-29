import { createWriteStream, createReadStream } from 'fs';

import { basename } from 'path';

import { glob } from 'glob';

import {
  LineTransform,
  type LineTransformOptions,
} from '#src/line-transform.js';

const AUTOGENERATED_PREFIX =
  '/// ********* AUTO GENERATED FILE, DO NOT EDIT. ********* ///\n' +
  '/// ************ Generated by prisma-fuse *************** ///\n\n';

/* eslint-disable no-console */

export async function fuse({
  baseFile,
  outputFile,
  schemaFileGlob,
  excludedFileGlob,
  stripComments,
  verbose,
}: {
  baseFile: string;
  outputFile: string;
  schemaFileGlob: string;
  excludedFileGlob: string;
  stripComments: boolean;
  verbose: boolean;
}): Promise<void> {
  const start = performance.now();

  const [excludedFiles, schemaFiles] = await Promise.all([
    glob(excludedFileGlob),
    glob(schemaFileGlob),
  ]);

  const filesToFuse = schemaFiles
    .filter(
      (file) =>
        !excludedFiles.includes(file) &&
        !file.endsWith(baseFile) &&
        !file.endsWith(outputFile),
    )
    .sort((a, b) => basename(a).localeCompare(basename(b)));

  if (verbose) {
    console.log(`Fusing Prisma schema files into ${outputFile}...`);
  }
  const writeStream = createWriteStream(outputFile);
  writeStream.write(AUTOGENERATED_PREFIX);

  // Pipe the base file to the final output file.
  await pipeToWriteStream(baseFile, writeStream, { stripComments });
  if (verbose) {
    console.log(`Added base file: ${baseFile} ✔`);
  }

  // Pipe the schema files to the final output file with a `\n` separator.
  for (const filePath of filesToFuse) {
    writeStream.write('\n');
    await pipeToWriteStream(filePath, writeStream, { stripComments });
    if (verbose) {
      console.log(`Added file: ${filePath} ✔`);
    }
  }

  writeStream.end();

  const duration = (performance.now() - start).toFixed(2);

  console.log(
    `Fused ${filesToFuse.length} Prisma schema files into ${outputFile} in ${duration}ms`,
  );
}

async function pipeToWriteStream(
  sourcePath: string,
  writableStream: NodeJS.WritableStream,
  lineTransformOptions: LineTransformOptions,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    createReadStream(sourcePath)
      .on('error', reject)
      .pipe(new LineTransform(lineTransformOptions))
      .on('error', reject)
      .on('end', resolve)
      .pipe(writableStream, { end: false });
  });
}
