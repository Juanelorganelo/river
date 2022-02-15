# river
=========

# :warning: This is a work-in-progress

A CLI to query CloudWatch Logs with additional features for JSON logs.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@ck/river.svg)](https://npmjs.org/package/river)
[![Downloads/week](https://img.shields.io/npm/dw/@ck/river.svg)](https://npmjs.org/package/river)
[![License](https://img.shields.io/npm/l/@ck/river.svg)](https://github.com/Juanelorganelo/river/blob/master/package.json)

<!-- toc -->
* [Why?](#why)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Why?
I wanted a CLI that will allow me to write powerful queries for JSON logs and none of the existing ones seem to work that well with queries. Also, programming is fun.

# Usage
<!-- usage -->
```sh-session
$ npm install -g river
$ river COMMAND
running command...
$ river (-v|--version|version)
river/0.1.0 darwin-x64 node-v12.22.6
$ river --help [COMMAND]
USAGE
  $ river COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`river help [COMMAND]`](#river-help-command)
* [`river query LOGGROUPNAME`](#river-query-loggroupname)
* [`river tail`](#river-tail)

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

## `river query LOGGROUPNAME`

Query a batch of logs from CloudWatch

```
USAGE
  $ river query LOGGROUPNAME

ARGUMENTS
  LOGGROUPNAME  The name of the log group to query

OPTIONS
  --from=from                                Start of date range to get logs from
  --indent=indent                            Number of spaces used to indent output for JSON logs

  --logStreamNamePrefix=logStreamNamePrefix  A prefix used to filter logs. Only logs from a log stream matching the
                                             prefix will be returned

  --logStreamNames=logStreamNames            Names of log streams to get logs from

  --query=query                              A JSONPath query ran against the log events list. Queries are run on log
                                             pages, so if you do something like $[1].record it'll give you the first
                                             record on every log page, not the first record overall

  --timeZone=timeZone                        Optional time zone. Logs will be filtered using this time zone if to or
                                             from are provided in addition to dates being printed in the specified time
                                             zone

  --to=to                                    End of date range to get logs from
```

_See code: [src/commands/query.ts](https://github.com/Juanelorganelo/river/blob/v0.1.0/src/commands/query.ts)_

## `river tail`

```
USAGE
  $ river tail
```

_See code: [src/commands/tail.ts](https://github.com/Juanelorganelo/river/blob/v0.1.0/src/commands/tail.ts)_
<!-- commandsstop -->
