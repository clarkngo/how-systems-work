# How Systems Work

Interactive explainers for complex system architectures, built with React, React Flow (`@xyflow/react`), and Tailwind. Every system is a static JSON file, so the site deploys to GitHub Pages with no backend.

```bash
npm install
npm run dev        # http://localhost:5173/how-systems-work/
npm run build      # validates public/systems/*.json, then builds dist/
```

## Adding a system

1. Create `public/systems/<id>.json` (copy `rag-ai.json` as a template).
2. Add or enable its entry in `public/systems/index.json` by setting `"file": "<id>.json"`.
3. Run `npm run validate`. The build fails on dangling edges, unknown layers, or missing fields.

It is then reachable at `#/<id>` and appears in the switcher.

## Data schema

```jsonc
{
  "schemaVersion": 1,
  "id": "rag-ai",                       // must match index.json
  "title": "…", "summary": "…",
  "flows": {                            // edge categories, used for color and legend
    "query": { "label": "Query (online)", "color": "#38bdf8" }
  },
  "walkthrough": [                      // numbered steps; edges opt in via data.steps
    { "step": 1, "title": "…", "text": "…" }
  ],
  "nodes": [{
    "id": "vector-db",
    "type": "systemNode",
    "position": { "x": 1140, "y": 0 },
    "data": {
      "label": "Vector Database",
      "layer": "client | gateway | processing | storage | external",
      "criticality": "critical | degradable | async",  // header badge: behaviour when down
      "tech": ["pgvector", "Pinecone"],
      "io": {
        "input":  [{ "name": "Query", "type": "JSON: { vector: float32[1536], topK }" }],
        "output": [{ "name": "Matches", "type": "JSON: Match[]" }]
      },
      "responsibilities": ["2-3 items"],
      "failureModes": [{ "scenario": "…", "impact": "…", "mitigation": "…" }]
    }
  }],
  "edges": [{
    "id": "e-embed-vdb",
    "source": "embeddings", "sourceHandle": "r",   // handles: t | r | b | l
    "target": "vector-db",  "targetHandle": "l",
    "data": { "flow": "query", "payload": "float32[1536]", "steps": [3], "bidirectional": false }
  }]
}
```

The JSON holds meaning only. Colors, arrowheads, animation, and labels are derived in `src/components/SystemCanvas.jsx` from `data.flow` and `data.steps`, so restyling never requires touching data files.
