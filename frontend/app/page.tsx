'use client';
import { useEffect, useMemo, useState } from 'react';
import { CONTRACT, EXPLORER, connectWallet, readContract, writeContract } from '../lib/chain';

type Attack = { category: string; scenario: string; material: boolean; patched: boolean; requirement_indexes: number[] };
type Prism = { id: string; owner: string; title: string; plan: string; requirements: string[]; categories: string[]; sealed: string[]; active_attack: Attack | null; attacks: Attack[]; patch_failures: number; state: string };

const EMPTY: Prism = { id: '', owner: '', title: 'No prism loaded', plan: 'Open a new containment specimen or load the latest public prism.', requirements: [], categories: ['OPERATIONS', 'ABUSE', 'RECOVERY'], sealed: [], active_attack: null, attacks: [], patch_failures: 0, state: 'IDLE' };

export default function Page() {
  const [prism, setPrism] = useState<Prism>(EMPTY);
  const [selected, setSelected] = useState('OPERATIONS');
  const [wallet, setWallet] = useState('');
  const [mode, setMode] = useState<'probe' | 'patch' | 'open'>('probe');
  const [text, setText] = useState('');
  const [tx, setTx] = useState('');
  const [notice, setNotice] = useState('');
  const [draft, setDraft] = useState({ id: '', title: '', plan: '', requirements: '', categories: '' });

  async function refresh() {
    try {
      const page: any = await readContract('get_prisms_page', [0, 20]);
      if (page.items?.length) {
        const latest = page.items[page.items.length - 1] as Prism;
        setPrism(latest);
        setSelected(latest.active_attack?.category || latest.categories.find(c => !latest.sealed.includes(c)) || latest.categories[0]);
        setMode(latest.state === 'PATCHING' ? 'patch' : 'probe');
      }
    } catch (error: any) {
      setNotice(error.message || 'Read-only state is unavailable.');
    }
  }

  useEffect(() => { refresh(); }, []);
  const completion = prism.categories.length ? Math.round((prism.sealed.length / prism.categories.length) * 100) : 0;
  const angle = 360 / Math.max(prism.categories.length, 1);
  const shortWallet = wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : 'Connect reviewer';

  async function submit() {
    try {
      setNotice('');
      if (mode === 'open') {
        await writeContract('open_prism', [draft.id, draft.title, draft.plan, draft.requirements.split('\n').filter(Boolean), draft.categories.split('\n').filter(Boolean)], setTx);
      } else if (mode === 'patch') {
        await writeContract('apply_patch', [prism.id, text], setTx);
      } else {
        await writeContract('probe', [prism.id, selected, text], setTx);
      }
      setText('');
      await refresh();
    } catch (error: any) {
      setNotice(error.message || 'Transaction failed.');
    }
  }

  const requirements = useMemo(() => prism.active_attack?.requirement_indexes.map(i => prism.requirements[i]).filter(Boolean) || [], [prism]);

  return <main>
    <a className="skip" href="#controls">Skip to controls</a>
    <header className="instrument-rail">
      <div className="wordmark"><span>FP</span><b>FAILURE PRISM</b></div>
      <div className="readout"><span>SPECIMEN</span><strong>{prism.id || 'UNLOADED'}</strong></div>
      <div className="readout"><span>STATE</span><strong data-state={prism.state}>{prism.state}</strong></div>
      <div className="rail-actions">
        <button className="ghost" onClick={() => setMode(mode === 'open' ? 'probe' : 'open')}>{mode === 'open' ? 'Close intake' : 'New prism'}</button>
        <button onClick={async () => { try { setWallet(await connectWallet()); } catch (e: any) { setNotice(e.message); } }}>{shortWallet}</button>
      </div>
    </header>

    {mode === 'open' ? <section className="intake" id="controls" aria-label="Open a new failure prism">
      <div className="intake-title"><span>CONTAINMENT INTAKE</span><h1>Freeze the plan before pressure.</h1><p>Define what must survive and where reviewers should attack. Categories become the chamber sectors.</p></div>
      <div className="intake-fields">
        <label>Prism ID<input value={draft.id} onChange={e => setDraft({ ...draft, id: e.target.value })} /></label>
        <label>Plan title<input value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} /></label>
        <label className="wide">Plan<textarea value={draft.plan} onChange={e => setDraft({ ...draft, plan: e.target.value })} /></label>
        <label>Protected requirements<textarea value={draft.requirements} onChange={e => setDraft({ ...draft, requirements: e.target.value })} placeholder="One per line" /></label>
        <label>Threat categories<textarea value={draft.categories} onChange={e => setDraft({ ...draft, categories: e.target.value })} placeholder="At least three, one per line" /></label>
        <button className="ignite" onClick={submit}>Pressurize prism</button>
      </div>
    </section> : <section className="chamber" id="controls">
      <aside className="plan-aperture">
        <span className="eyeline">FROZEN PLAN</span>
        <h1>{prism.title}</h1>
        <p>{prism.plan}</p>
        <div className="requirements">
          {prism.requirements.map((item, index) => <div key={item} className={requirements.includes(item) ? 'under-pressure' : ''}><b>{String(index + 1).padStart(2, '0')}</b><span>{item}</span></div>)}
        </div>
      </aside>

      <div className="prism-stage" aria-label={`Containment coverage ${completion} percent`}>
        <div className="orbit orbit-a" />
        <div className="orbit orbit-b" />
        <div className="prism-core" style={{ '--progress': `${completion * 3.6}deg` } as React.CSSProperties}>
          <div className="core-glass"><span>SEALED</span><strong>{completion}%</strong><small>{prism.sealed.length} / {prism.categories.length} sectors</small></div>
        </div>
        <div className="sector-rotor">
          {prism.categories.map((category, index) => {
            const sealed = prism.sealed.includes(category);
            return <button key={category} className={`sector ${selected === category ? 'selected' : ''} ${sealed ? 'sealed' : ''}`} style={{ '--angle': `${index * angle}deg` } as React.CSSProperties} onClick={() => setSelected(category)} disabled={sealed || prism.state === 'PATCHING'}><span>{category}</span></button>;
          })}
        </div>
      </div>

      <aside className="pressure-aperture">
        <span className="eyeline">{mode === 'patch' ? 'ACTIVE FRACTURE' : 'PROBE GATE'}</span>
        <h2>{mode === 'patch' ? prism.active_attack?.category : selected}</h2>
        {mode === 'patch' && <blockquote>{prism.active_attack?.scenario}</blockquote>}
        <label>{mode === 'patch' ? 'Requirement-safe patch' : 'Material failure scenario'}
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder={mode === 'patch' ? 'Explain the concrete plan change that closes this exact attack without weakening the frozen requirements.' : 'Describe one plausible, category-specific failure path and the protected requirement it threatens.'} />
        </label>
        <button className={mode === 'patch' ? 'anneal' : 'pressure'} disabled={!prism.id || text.length < 36} onClick={submit}>{mode === 'patch' ? 'Anneal patch' : 'Apply pressure'}</button>
        <div className="failure-meter"><span>PATCH FAILURES</span><i style={{ '--fail': `${prism.patch_failures * 33}%` } as React.CSSProperties} /></div>
      </aside>
    </section>}

    <section className={`transaction-rail ${tx ? 'active' : ''}`} aria-live="polite">
      <div><span>CONSENSUS CIRCUIT</span><b>{tx || 'STANDBY'}</b></div>
      {notice && <p role="alert">{notice}</p>}
      <div className="rail-links">{CONTRACT && <a href={`${EXPLORER}/address/${CONTRACT}`} target="_blank" rel="noreferrer">Inspect contract</a>}<button className="ghost" onClick={refresh}>Refresh state</button></div>
    </section>
  </main>;
}
