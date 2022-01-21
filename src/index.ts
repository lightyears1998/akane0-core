import "./agent";
import path from "path";

import { Agent } from "@lightyears1998/akane0-interface";
import fs from "fs-extra";

const rootPath = path.resolve(path.join(__dirname, ".."));
const varPath = path.join(rootPath, "./var");
const agentDir = path.join(varPath, "./agents");

async function ensureDirs() {
  for (const path of [varPath, agentDir]) {
    await fs.ensureDir(path);
  }
}

function buildAgent(agentConstructor: unknown): Agent {
  if (typeof agentConstructor !== "function") {
    throw "not a valid agent constructor";
  }

  let agent = {} as Agent;
  try {
    agent = new (agentConstructor as new() => Agent)();
    if (typeof agent !== "object") {
      throw "not a valid agent constructor";
    }
  } catch {
    throw "not a valid agent constructor";
  }

  const keys: Array<keyof Agent> = [
    "version",
    "install",
    "uninstall",
    "start",
    "stop"
  ];
  for (const key of keys) {
    if (agent[key] === undefined) {
      throw "not a valid agent constructor";
    }
  }

  return agent;
}

async function loadAgents() {
  const agentList = await fs.readdir(agentDir);
  for (const agentName of agentList) {
    const agentPath = path.join(agentDir, agentName);

    let agentEntry = path.join(agentPath, "index.js");
    if (!fs.existsSync(agentEntry)) {
      agentEntry = path.join(agentPath, "lib/index.js");
      if (!fs.existsSync(agentEntry)) {
        console.warn("rejected:", "No plugin found in", agentPath);
        continue;
      }
    }

    const agentConstructor = (await import(agentEntry)).default;
    try {
      const agent = buildAgent(agentConstructor);
      console.log("loaded:", agentName, agent.version);
    } catch {
      console.warn("rejected:", agentName, "is not a valid agent.");
    }
  }
}

async function bootstrap() {
  await ensureDirs();
  await loadAgents();
}

bootstrap();
