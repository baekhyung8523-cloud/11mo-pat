// 공통 스크립트: 진행바 · 음악 · 월간지 뷰어 · 복사 버튼 · 책 링크
(function(){
  var bar=document.getElementById('progress');
  function prog(){ if(!bar) return; var m=document.documentElement.scrollHeight-innerHeight; bar.style.transform='scaleX('+(m>0?Math.min(scrollY/m,1):0)+')'; }
  addEventListener('scroll',prog,{passive:true}); addEventListener('resize',prog); prog();

  var au=document.getElementById('bgm'), tg=document.getElementById('musicToggle'), st=document.getElementById('musicState');
  if(au&&tg){ tg.addEventListener('click',async function(){
    if(au.paused){ try{ au.volume=.35; await au.play(); tg.classList.add('on'); st.textContent='음악 끄기'; tg.setAttribute('aria-pressed','true'); }catch(e){ st.textContent='재생 불가'; } }
    else{ au.pause(); tg.classList.remove('on'); st.textContent='음악 듣기'; tg.setAttribute('aria-pressed','false'); }
  }); }

  var cfg=window.PARTNER_CONFIG||{};
  document.querySelectorAll('[data-bookk]').forEach(function(a){ if(cfg.bookkUrl){ a.href=cfg.bookkUrl; a.hidden=false; } });

  document.querySelectorAll('[data-copy]').forEach(function(b){ b.addEventListener('click',function(){
    var el=document.getElementById(b.dataset.copy), cl=el.cloneNode(true), bt=cl.querySelector('.copy'); if(bt) bt.remove(); var t=cl.textContent.trim();
    var p=navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject();
    p.then(function(){ b.textContent='복사됨'; setTimeout(function(){b.textContent='복사'},1500); }).catch(function(){ var r=document.createRange(); r.selectNodeContents(el); var s=getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent='선택됨 · Ctrl+C'; });
  }); });

  document.querySelectorAll('[data-magazine]').forEach(function(root){
    var base=root.dataset.magazine, n=+root.dataset.count||9, cur=1;
    var img=root.querySelector('.mag-img'), prev=root.querySelector('.mag-prev'), next=root.querySelector('.mag-next'), label=root.querySelector('.mag-label'), th=root.querySelector('.mag-thumbs'), dlg=document.getElementById('lightbox'), big=dlg&&dlg.querySelector('img');
    var pad=function(i){return (i<10?'0':'')+i};
    for(var i=1;i<=n;i++){ (function(i){ var b=document.createElement('button'); b.type='button'; b.setAttribute('aria-label',i+'쪽'); b.innerHTML='<img loading="lazy" alt="" src="'+base+'thumb-'+pad(i)+'.jpg">'; b.addEventListener('click',function(){go(i)}); th.appendChild(b); })(i); }
    function go(i){ cur=Math.max(1,Math.min(n,i)); img.src=base+'page-'+pad(cur)+'.jpg'; img.alt='2026년 11월 월간지 '+cur+'쪽'; label.textContent=cur+' / '+n; prev.disabled=cur===1; next.disabled=cur===n;
      Array.prototype.forEach.call(th.querySelectorAll('button'),function(b,k){ b.classList.toggle('on',k===cur-1) });
      var on=th.children[cur-1]; if(on&&th.scrollTo) th.scrollTo({left:on.offsetLeft-th.clientWidth/2+on.clientWidth/2,behavior:'smooth'});
      if(root.dataset.hash==='1') history.replaceState(null,'','#'+cur);
      var pre=new Image(); pre.src=base+'page-'+pad(Math.min(n,cur+1))+'.jpg'; }
    prev.addEventListener('click',function(){go(cur-1)}); next.addEventListener('click',function(){go(cur+1)});
    addEventListener('keydown',function(e){ if(dlg&&dlg.open) return; if(e.target&&/INPUT|TEXTAREA/.test(e.target.tagName)) return; if(root.dataset.hash!=='1' && !root.contains(document.activeElement)) return; if(e.key==='ArrowLeft')go(cur-1); if(e.key==='ArrowRight')go(cur+1); });
    var x0=null; img.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true}); img.addEventListener('touchend',function(e){ if(x0===null)return; var dx=e.changedTouches[0].clientX-x0; if(Math.abs(dx)>50) go(cur+(dx<0?1:-1)); x0=null; });
    img.addEventListener('click',function(){ if(dlg){ big.src=base+'page-'+pad(cur)+'.jpg'; dlg.showModal(); } });
    var h=parseInt((location.hash||'').slice(1),10); go(root.dataset.hash==='1'&&h?h:1);
  });
  var lb=document.getElementById('lightbox'); if(lb) lb.addEventListener('click',function(e){ if(e.target===lb) lb.close(); });
})();
