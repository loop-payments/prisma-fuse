import { readFileSync } from 'fs';

import { fuse } from '#src/fuse.js';

describe('prisma-fuse', () => {
  it('fuses files successfully', async () => {
    await fuse({
      baseFile: 'fixture/prisma/base.prisma',
      outputFile: 'fixture/prisma/schema.prisma',
      schemaFileGlob: 'fixture/**/*.prisma',
      excludedFileGlob: 'fixture/**/schema.prisma',
      stripComments: true,
      addNamespaceFromFileName: true,
      verbose: false,
    });
    const file = readFileSync('fixture/prisma/schema.prisma');
    expect(file.toString()).toEqual(EXPECTED);
  });
});

const EXPECTED = `/// ********* AUTO GENERATED FILE, DO NOT EDIT. ********* ///
/// ************ Generated by prisma-fuse *************** ///

datasource db {
  url      = env("DATABASE_URL")
  provider = "postgresql"
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
}

/// @namespace Module1
model Module1Thing {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

/// comment does not get stripped
/// @namespace Module2
model Module2Thing {
  /// comment does not get stripped
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;
