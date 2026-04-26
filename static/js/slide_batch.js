let selectedTemplate=null; let slides=[];
async function init(){
 const t=await (await fetch('/api/slide-templates')).json();
 const sel=document.getElementById('templateSelect');
 sel.innerHTML=t.map(x=>`<option value='${x.id}'>${x.name}</option>`).join('');
 sel.onchange=()=>selectedTemplate=t.find(v=>v.id===sel.value);
 selectedTemplate=t[0];
}
function addSlideRow(){
 const c=document.getElementById('slidesContainer');
 const idx=slides.length;
 slides.push({});
 c.innerHTML += `<div id='slide-${idx}'></div>`;
 renderSlideFields(idx);
}
function renderSlideFields(idx){
 const div=document.getElementById(`slide-${idx}`);
 div.innerHTML=selectedTemplate.textboxes.map((tb,i)=>`<input placeholder='${tb.label}' onchange='slides[${idx}]["${tb.label}"]=this.value'>`).join('');
}
async function generateSlides(){
 const res=await fetch('/generate-slides-from-template',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({template:selectedTemplate,slides})});
 const data=await res.json();
 window.location=`/download?path=${encodeURIComponent(data.file)}`;
}
init();