import fs from "fs";
import path from "path";
import yaml from "yaml";
import stripJsonComments from "strip-json-comments";

export interface RiverConfig {
  endpointURL?: string;
  logGroupName?: string;
  logStreamNames?: string[];
  logStreamNamePrefix?: string;
}

type ConfigFileExtension = ".json" | ".jsonc" | ".yml" | ".yaml" | "";

const FILE_NAMES = ["river.yml", "river.yaml", "river.json", "river.jsonc"];

export async function load<T extends RiverConfig>(flags: T): Promise<RiverConfig & T> {
  for (const file of FILE_NAMES) {
    const resolved = await loadFile(file);

    if (resolved) {
      return { ...resolved, ...flags };
    }
  }
  return flags;
}

async function loadFile(name: string): Promise<RiverConfig | null> {
  const file = await findUpstream(name);

  if (!file) {
    return null;
  }

  const ext = path.extname(file) as ConfigFileExtension;
  const content = await fs.promises.readFile(file);
  return parse(content, ext);
}

function parse(content: Buffer, ext: ConfigFileExtension): RiverConfig {
  const text = content.toString();
  switch (ext) {
    case "":
    case ".json":
    case ".jsonc":
      return JSON.parse(stripJsonComments(text));
    case ".yml":
    case ".yaml":
      return yaml.parse(text);
  }
}

function findUpstream(file: string, maxDepth = 5): Promise<string | null> {
  return findUpstreamWithDepth(file);

  async function findUpstreamWithDepth(file: string, depth = 0): Promise<string | null> {
    if (depth === maxDepth) return null;
    try {
      await fs.promises.access(file);
      return file;
    } catch {
      return findUpstreamWithDepth(path.resolve("..", file), depth + 1);
    }
  }
}
