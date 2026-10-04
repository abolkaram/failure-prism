# FAILURE PRISM / CONTAINMENT NOTICE

Do not call a plan resilient because nobody has attacked it yet.

Failure Prism is a GenLayer pre-mortem chamber. A plan owner freezes protected requirements and threat categories. Independent reviewers try to expose one material failure at a time. The owner must then close the accepted attack without breaking any protected requirement.

## Specimen card

| Field | Value |
| --- | --- |
| Network | StudioNet |
| Contract | `0x4cb64a6e81BD7E6bddf5437ddF62B2fD1508ce83` |
| Public chamber | https://failure-prism.pages.dev/ |
| Backend | GenLayer Intelligent Contract only |

## Pressure cycle

`OPEN -> PATCHING -> OPEN` repeats until every category is sealed. Completing every category yields `HARDENED`. Three failed patches yield `BREACHED`.

`open_prism` freezes the plan, requirements, and unique categories. `probe` requires a distinct non-owner reviewer and asks validators whether the scenario is plausible, novel, category-correct, and tied to exact requirement indexes. `apply_patch` belongs to the owner and asks whether the patch closes that exact attack while preserving every requirement.

The frontend reads `get_summary`, `get_prism`, and `get_prisms_page`. It writes only the three lifecycle methods above.

## Invariant locks

Duplicate IDs and categories fail before consensus. Reviewers cannot probe twice or review their own plan. Only one material attack can be active. A material attack without valid protected-requirement indexes is downgraded. A patch cannot silently mark another category complete.

GenLayer is load-bearing because plausibility, novelty, materiality, and semantic closure need contextual judgment, while the shared state cannot belong to one reviewer or model leader. Validators inspect the same frozen plan and all state-driving fields.

## Operator sequence

```text
genvm-lint check contracts/contract.py
python -m pytest -q
cd frontend
npm install
npm run typecheck
npm run build
```

The static Next.js frontend talks directly to the contract through `genlayer-js`. Its radial containment chamber, sector rotor, aperture, pressure readout, and refraction rail expose real contract state.

The public StudioNet specimen is `PRISM-CLI`. Its accepted creation transaction is `0xfe0082c310afc56cc78abe7037b877a9595325c7d0c5f98e1e17684ca9d65c00`.

## Fracture log

This is a structured pre-mortem tool, not a security certification. Demo plans, wallets, attacks, and patches are operator-controlled fixtures. A finalized transaction proves network execution, not that a plan is safe outside its frozen requirements and categories.
