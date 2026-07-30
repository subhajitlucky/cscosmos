'use client';
import { useState } from 'react'
import VisualizerPanel from './VisualizerPanel'
import { type Topic } from '@/components/visualizers/cssviz/data/topics'

type GenericVisualizerProps = {
  topic: Topic
}

const defaultHTML = `<div class="card">
  <h3>Play with ${'${topic}'} props</h3>
  <p>Adjust CSS on the right to see live changes.</p>
</div>`

const GenericVisualizer = ({ topic }: GenericVisualizerProps) => {
  const [cssText, setCssText] = useState(`.card {
  padding: 16px;
  border-radius: 12px;
  background: #fef3c7;
  color: #0f172a;
  box-shadow: 0 10px 30px -15px rgba(0,0,0,0.3);
}
.card h3 { margin: 0 0 8px; font-size: 18px; }
.card p { margin: 0; line-height: 1.5; }`)

  return (
    <VisualizerPanel
      title={`${topic.name} — Live Playground`}
      description="Edit the CSS to experiment with the concept. Styles apply live to the preview card."
      cssOutput={cssText}
      onReset={() =>
        setCssText(`.card {
  padding: 16px;
  border-radius: 12px;
  background: #fef3c7;
  color: #0f172a;
  box-shadow: 0 10px 30px -15px rgba(0,0,0,0.3);
}
.card h3 { margin: 0 0 8px; font-size: 18px; }
.card p { margin: 0; line-height: 1.5; }`)
      }
      controls={
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <p className="font-semibold text-slate-800 dark:text-white">Try these ideas:</p>
          <ul className="space-y-1">
            {topic.bullets.slice(0, 5).map((bullet) => (
              <li key={bullet} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      }
      preview={
        <div className="grid gap-4 md:grid-cols-[1fr,1fr]">
          <div className="space-y-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/12 dark:bg-slate-900/60">
            <style>{cssText}</style>
            <div className="card" dangerouslySetInnerHTML={{ __html: defaultHTML.replace('${topic}', topic.name) }} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.18em] text-primary">CSS</label>
            <textarea
              className="h-48 rounded-lg border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 shadow-sm dark:border-white/12 dark:bg-slate-900/60 dark:text-slate-100"
              value={cssText}
              onChange={(e) => setCssText(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
      }
    />
  )
}

export default GenericVisualizer

