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
  -s, --schema-file-glob <string>    Glob of all prisma files to include. (default: "src/**/*.prisma")
  -e, --excluded-file-glob <string>  Glob pattern for excluded files (e.g schema.prisma in migrations / generated folder). (default: "src/**/schema.prisma")
  --verbose                          Verbose logging. (default: false)
  -h, --help                         display help for command
```
