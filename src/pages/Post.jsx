import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { posts } from '../data/posts.js';

function simpleMarkdownToHtml(md){
  // very small markdown -> html converter: headings (#), paragraphs and line breaks
  const lines = md.split(/\r?\n/);
  let out = '';
  let paragraphOpen = false;
  for(const line of lines){
    if(line.trim().length === 0){
      if(paragraphOpen){ out += '</p>'; paragraphOpen = false }
      continue;
    }
    const hMatch = line.match(/^#{1,6}\s+(.*)$/);
    if(hMatch){
      if(paragraphOpen){ out += '</p>'; paragraphOpen = false }
      const level = Math.min(6, hMatch[0].split(' ')[0].length);
      out += `<h${level}>${escapeHtml(hMatch[1])}</h${level}>`;
      continue;
    }
    // simple inline bold **text** and italic *text*
    let text = escapeHtml(line)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
    if(!paragraphOpen){ out += `<p>${text}`; paragraphOpen = true }
    else { out += `<br/>${text}` }
  }
  if(paragraphOpen) out += '</p>';
  return out;
}

function escapeHtml(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

export default function Post(){
  const { slug } = useParams();
  const meta = posts.find(p=>p.slug === slug);
  const [html, setHtml] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    let cancelled = false;
    if(!meta) return;
    setLoading(true);
    fetch(meta.path).then(r=>{
      if(!r.ok) throw new Error('Failed to fetch')
      return r.text()
    }).then(md=>{
      if(cancelled) return;
      setHtml(simpleMarkdownToHtml(md));
    }).catch(err=>{
      console.error('Could not load post', err);
      setHtml('<p>Impossible de charger l\'article.</p>')
    }).finally(()=>{ if(!cancelled) setLoading(false) });
    return ()=>{ cancelled = true }
  },[meta])

  if(!meta) return (
    <div className="card">
      <h1>Article introuvable</h1>
      <p>Nous n'avons pas trouvé l'article demandé.</p>
      <p><Link to="/page-blanche">Retour au blog</Link></p>
    </div>
  )

  return (
    <article className="card">
      <h1>{meta.title}</h1>
      <div className="muted">{meta.date}</div>
      <div style={{marginTop:'.8rem'}} dangerouslySetInnerHTML={{__html: loading ? '<p>Chargement…</p>' : (html || '')}} />
      <p style={{marginTop:'.8rem'}}><Link to="/page-blanche">← Retour</Link></p>
    </article>
  )
}
