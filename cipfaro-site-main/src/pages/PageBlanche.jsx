import React from 'react';
import { posts } from '../data/posts.js';
import { Link } from 'react-router-dom';

export default function PageBlanche(){
  return (
    <div>
      <h1>Blog d'information</h1>
      <p className="muted">Dernières actualités et ressources du CIP FARO.</p>

      <div style={{display:'grid',gap:'.8rem'}}>
        {posts.map(p=> (
          <article key={p.slug} className="card post-teaser">
            <h2 style={{margin:'0 0 .3rem'}}><Link to={`/page-blanche/${p.slug}`}>{p.title}</Link></h2>
            <div className="muted" style={{fontSize:'.9rem'}}>{p.date}</div>
            <p style={{marginTop:'.4rem'}}>{p.excerpt}</p>
            <Link to={`/page-blanche/${p.slug}`} className="btn small">Lire</Link>
          </article>
        ))}
      </div>
    </div>
  )
}
