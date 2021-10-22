@ck/river
=========

A CLI to query CloudWatch Logs

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@ck/river.svg)](https://npmjs.org/package/@ck/river)
[![Downloads/week](https://img.shields.io/npm/dw/@ck/river.svg)](https://npmjs.org/package/@ck/river)
[![License](https://img.shields.io/npm/l/@ck/river.svg)](https://github.com/Juanelorganelo/river/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @ck/river
$ river COMMAND
running command...
$ river (-v|--version|version)
@ck/river/0.1.0 darwin-x64 node-v12.22.6
$ river --help [COMMAND]
USAGE
  $ river COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`river hello [FILE]`](#river-hello-file)
* [`river help [COMMAND]`](#river-help-command)

## `river hello [FILE]`

describe the command here

```
USAGE
  $ river hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ river hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/Juanelorganelo/river/blob/v0.1.0/src/commands/hello.ts)_

## `river help [COMMAND]`

display help for river

```
USAGE
  $ river help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_
<!-- commandsstop -->
