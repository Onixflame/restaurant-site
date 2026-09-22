import { useState } from 'react';
import type { BoutiqueCategory, BoutiqueItem, DemoSandbox } from '../../types/domain';

const categories:BoutiqueCategory[]=['Wine cellar','Desserts','Pantry & keepsakes'];

export function BoutiqueManager({sandbox,onChange}:{sandbox:DemoSandbox;onChange:(s:DemoSandbox)=>void}){
  const [selected,setSelected]=useState<BoutiqueItem|null>(null);
  const persist=(items:BoutiqueItem[])=>onChange({...sandbox,boutique:items});
  const create=()=>setSelected({id:Math.max(0,...sandbox.boutique.map(x=>x.id))+1,name:'New boutique item',category:'Pantry & keepsakes',price:20,description:'Describe the item.',note:'Boutique item',image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=88',position:'center'});
  const save=()=>{if(!selected)return;const exists=sandbox.boutique.some(x=>x.id===selected.id);persist(exists?sandbox.boutique.map(x=>x.id===selected.id?selected:x):[...sandbox.boutique,selected]);setSelected(null)};
  const remove=(id:number)=>persist(sandbox.boutique.filter(x=>x.id!==id));
  return <section className="admin-section">
    <div className="admin-section-head"><div><h2>Boutique catalogue</h2><p className="muted">Edit products, prices, descriptions and photography shown in the boutique sandbox preview.</p></div><button className="admin-primary" onClick={create}>Add item</button></div>
    <div className="admin-boutique-list">{sandbox.boutique.map(item=><div className="admin-boutique-row" key={item.id}><img src={item.image} alt=""/><div><strong>{item.name}</strong><small>{item.category} · ${item.price}</small><p>{item.note}</p></div><div className="admin-row-actions"><button onClick={()=>setSelected(item)}>Edit</button><button className="admin-danger" onClick={()=>remove(item.id)}>Delete</button></div></div>)}</div>
    {selected&&<div className="admin-drawer"><div className="admin-drawer-card"><div className="admin-section-head"><div><h2>Edit boutique item</h2><p className="muted">Changes remain temporary and auto-reset after 10 minutes.</p></div><button onClick={()=>setSelected(null)}>Close</button></div><div className="admin-form">
      <label>Name<input value={selected.name} onChange={e=>setSelected({...selected,name:e.target.value})}/></label>
      <label>Category<select value={selected.category} onChange={e=>setSelected({...selected,category:e.target.value as BoutiqueCategory})}>{categories.map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Price ($)<input type="number" min="0" value={selected.price} onChange={e=>setSelected({...selected,price:Number(e.target.value)})}/></label>
      <label>Description<textarea rows={4} value={selected.description} onChange={e=>setSelected({...selected,description:e.target.value})}/></label>
      <label>Short note<input value={selected.note} onChange={e=>setSelected({...selected,note:e.target.value})}/></label>
      <label>Image URL<input value={selected.image} onChange={e=>setSelected({...selected,image:e.target.value})}/></label>
      <label>Image position<input value={selected.position??'center'} onChange={e=>setSelected({...selected,position:e.target.value})}/></label>
      <div className="admin-drawer-actions"><button className="admin-primary" onClick={save}>Save item</button><button onClick={()=>setSelected(null)}>Cancel</button></div>
    </div></div></div>}
  </section>;
}
