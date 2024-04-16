# prisma-fuse

Fuse multiple Prisma schema files into one.

### CLI Options
```
Usage: prisma-fuse [options]

Fuse multiple Prisma schema files into one.

Options:
  -V, --version                      output the version number
  -b, --base-file <string>           Base file usually with datasource & generator statement. (default: "src/prisma/base.prisma")
  -o, --output-file <string>         Output file. (default: "src/prisma/schema.prisma")
  -s, --schema-file-glob <string>    Glob pattern of Prisma schema files to include. (default: "src/**/*.prisma")
  -e, --excluded-file-glob <string>  Glob pattern of excluded files (e.g schema.prisma in migrations/generated folder). (default: "src/**/schema.prisma")
  --strip-comments                   Strip out lines that start with `//`. Lines that start with `///` will not be stripped. (default: false)
  --add-namespace-from-file-name     Adds a `/// @namespace {namespace}` comment before each model using the prisma file name. For example, `user.prisma` would map to `/// @namespace User`. Compatible with https://github.com/samchon/prisma-markdown. (default: false)
  --verbose                          Verbose logging. (default: false)
  -h, --help                         display help for command
```
