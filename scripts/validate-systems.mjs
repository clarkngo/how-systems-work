// Validates every system JSON listed in public/systems/index.json.
// Runs before `vite build` so a broken data file fails CI instead of the live page.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'public/systems';
const LAYERS = ['client', 'gateway', 'processing', 'storage', 'external'];
const CRITICALITY = ['critical', 'degradable', 'async'];
const HANDLES = ['t', 'r', 'b', 'l'];

const errors = [];
const check = (cond, msg) => cond || errors.push(msg);
const nonEmpty = (v) => Array.isArray(v) && v.length > 0;

const { systems } = JSON.parse(readFileSync(join(DIR, 'index.json'), 'utf8'));
check(new Set(systems.map((s) => s.id)).size === systems.length, 'index.json: duplicate system ids');

for (const entry of systems.filter((s) => s.file)) {
  const path = join(DIR, entry.file);
  if (!check(existsSync(path), `index.json: ${entry.file} does not exist`)) continue;

  const sys = JSON.parse(readFileSync(path, 'utf8'));
  const at = (msg) => `${entry.file}: ${msg}`;
  check(sys.id === entry.id, at(`id "${sys.id}" does not match index entry "${entry.id}"`));
  check(sys.nodes.length >= 5 && sys.nodes.length <= 8, at(`expected 5-8 nodes, got ${sys.nodes.length}`));

  const nodeIds = new Set();
  for (const n of sys.nodes) {
    const d = n.data ?? {};
    const where = (msg) => at(`node "${n.id}" ${msg}`);
    check(!nodeIds.has(n.id), where('is duplicated'));
    nodeIds.add(n.id);
    check(n.type === 'systemNode', where('must have type "systemNode"'));
    check(typeof n.position?.x === 'number' && typeof n.position?.y === 'number', where('needs position {x, y}'));
    check(d.label, where('needs data.label'));
    check(LAYERS.includes(d.layer), where(`has unknown layer "${d.layer}"`));
    check(CRITICALITY.includes(d.criticality), where(`has unknown criticality "${d.criticality}"`));
    check(Array.isArray(d.tech), where('needs data.tech[]'));
    check(nonEmpty(d.io?.input) && nonEmpty(d.io?.output), where('needs io.input[] and io.output[]'));
    check(d.responsibilities?.length >= 2 && d.responsibilities?.length <= 3, where('needs 2-3 responsibilities'));
    check(nonEmpty(d.failureModes), where('needs failureModes[]'));
    d.failureModes?.forEach((f, i) =>
      check(f.scenario && f.impact && f.mitigation, where(`failureModes[${i}] needs scenario, impact, mitigation`)),
    );
  }

  const steps = new Set(sys.walkthrough.map((w) => w.step));
  const edgeIds = new Set();
  for (const e of sys.edges) {
    const where = (msg) => at(`edge "${e.id}" ${msg}`);
    check(!edgeIds.has(e.id), where('is duplicated'));
    edgeIds.add(e.id);
    check(nodeIds.has(e.source), where(`source "${e.source}" is not a node`));
    check(nodeIds.has(e.target), where(`target "${e.target}" is not a node`));
    check(HANDLES.includes(e.sourceHandle) && HANDLES.includes(e.targetHandle), where('handles must be t|r|b|l'));
    check(sys.flows[e.data?.flow], where(`flow "${e.data?.flow}" is not defined in flows`));
    check(e.data?.payload, where('needs data.payload'));
    e.data?.steps?.forEach((s) => check(steps.has(s), where(`references step ${s} missing from walkthrough`)));
  }
}

if (errors.length) {
  console.error(`System data validation failed:\n  - ${errors.join('\n  - ')}`);
  process.exit(1);
}
console.log(`Validated ${systems.filter((s) => s.file).length} system file(s).`);
