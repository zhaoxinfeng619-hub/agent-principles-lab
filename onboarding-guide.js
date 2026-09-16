(function(){
  const STYLE_ID='agent-onboarding-style';
  const SVG='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 3.8 25.2 18l-9.1 1.7-4.8 7.9L5 3.8Z" stroke-width="2" stroke-linejoin="round"/></svg>';
  function addStyles(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');style.id=STYLE_ID;style.textContent=`
      .og-card{position:fixed;z-index:3003;width:min(360px,calc(100vw - 28px));padding:20px 54px 19px 20px;border:3px solid #211d3a;border-radius:20px;color:#211d3a;background:linear-gradient(135deg,#fff 0 18%,#ddfc76 100%);box-shadow:8px 8px 0 #211d3a,0 22px 55px rgba(43,30,77,.28);will-change:left,top,transform,opacity}
      .og-card[hidden],.og-spot[hidden],.og-pointer[hidden]{display:none!important}.og-card small{display:block;color:#6d46d9;font:900 12px ui-monospace,monospace;letter-spacing:.1em}.og-card strong{display:block;margin-top:6px;font:900 23px/1.15 "Avenir Next","PingFang SC",system-ui,sans-serif;letter-spacing:-.035em}.og-card p{margin:7px 0 0;color:#49425e;font:600 13px/1.5 "PingFang SC","Microsoft YaHei",system-ui,sans-serif}.og-close{position:absolute;right:10px;top:10px;width:40px;height:40px;display:grid;place-items:center;border:1px solid rgba(33,29,58,.24);border-radius:12px;color:#211d3a;background:rgba(255,255,255,.78);cursor:pointer}.og-close:hover{border-color:#211d3a;background:#fff}.og-close svg{width:16px;stroke:currentColor}.og-card::after{content:"";position:absolute;right:22px;width:20px;height:20px;border-right:3px solid #211d3a;border-bottom:3px solid #211d3a;background:#ddfc76}.og-card[data-side="above"]::after{bottom:-12px;transform:rotate(45deg)}.og-card[data-side="below"]::after{top:-12px;transform:rotate(225deg)}
      .og-spot{position:fixed;z-index:3000;border:3px solid #ddfc76;border-radius:22px;background:transparent;box-shadow:0 0 0 9999px rgba(22,16,42,.62),0 0 0 9px rgba(221,252,118,.22),0 0 42px 12px rgba(221,252,118,.42);pointer-events:none;will-change:left,top,width,height}.og-pointer{position:fixed;z-index:3004;width:60px;height:60px;display:grid;place-items:center;border:3px solid #211d3a;border-radius:18px;color:#fff;background:#6d46d9;box-shadow:6px 6px 0 #ddfc76,0 12px 30px rgba(31,20,58,.36);pointer-events:none;will-change:left,top,transform,opacity}.og-pointer>svg{width:30px;height:30px;fill:#fff;stroke:#211d3a;filter:drop-shadow(1px 2px 0 rgba(33,29,58,.2))}.og-pointer::after{content:"";position:absolute;inset:-14px;border:4px solid #ddfc76;border-radius:24px;opacity:0}.og-pointer.arrived::after{animation:og-pulse 1.25s ease-out infinite}@keyframes og-pulse{0%{opacity:1;transform:scale(.72)}100%{opacity:0;transform:scale(1.55)}}
      @media(max-width:560px){.og-card{padding:17px 50px 16px 17px}.og-card strong{font-size:19px}.og-card p{font-size:12px}.og-pointer{width:54px;height:54px}}
      @media(prefers-reduced-motion:reduce){.og-pointer.arrived::after{animation:none;opacity:1}.og-card,.og-spot,.og-pointer{transition:none!important}}
    `;document.head.appendChild(style);
  }
  function init(options){
    addStyles();
    const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
    let timer=null,epoch=0,target=null,motions=[];
    const root=document.createElement('div');root.className='og-root';root.innerHTML='<aside class="og-card" aria-label="开始体验引导" hidden><button class="og-close" type="button" aria-label="跳过引导"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="m6 6 12 12M18 6 6 18"/></svg></button><small>START HERE · 从这里开始</small><strong></strong><p></p></aside><span class="og-spot" aria-hidden="true" hidden></span><span class="og-pointer" aria-hidden="true" hidden>'+SVG+'</span>';
    document.body.appendChild(root);
    const card=root.querySelector('.og-card'),spot=root.querySelector('.og-spot'),pointer=root.querySelector('.og-pointer');
    function close(){epoch++;clearTimeout(timer);motions.forEach(a=>a.cancel());motions=[];[card,spot,pointer].forEach(el=>{el.getAnimations().forEach(a=>a.cancel());el.hidden=true});pointer.classList.remove('arrived');if(target){target.removeEventListener('click',close);target=null}}
    function show(){
      const run=epoch;target=document.querySelector(options.target);if(!target)return;
      const r=target.getBoundingClientRect(),vw=innerWidth,vh=innerHeight;
      card.querySelector('strong').textContent=options.title;
      card.querySelector('p').textContent='跟着亮区移动视线。'+options.text;
      card.hidden=spot.hidden=pointer.hidden=false;
      card.style.left='0px';card.style.top='0px';
      const w=card.offsetWidth,h=card.offsetHeight,startW=Math.min(360,vw-40),startH=126,startX=Math.max(20,(vw-startW)/2),startY=Math.max(28,Math.min(vh*.32,vh-startH-28));
      const endX=Math.max(8,Math.min(vw-r.width-38,r.left-15)),endY=Math.max(8,Math.min(vh-r.height-38,r.top-15)),endW=r.width+30,endH=r.height+30;
      const above=endY-h-18>12,side=above?'above':'below',endLeft=Math.max(14,Math.min(vw-w-14,r.right-w+28)),endTop=Math.max(14,Math.min(vh-h-14,above?endY-h-18:endY+endH+18));
      const cardStartLeft=Math.max(14,Math.min(vw-w-14,startX+(startW-w)/2)),cardStartTop=Math.max(14,Math.min(vh-h-14,startY-h-22));
      const pointerStartLeft=startX+startW/2-30,pointerStartTop=startY+startH/2-30,pointerEndLeft=r.left+r.width/2-30,pointerEndTop=r.top+r.height/2-30;
      card.dataset.side=side;Object.assign(card.style,{left:cardStartLeft+'px',top:cardStartTop+'px'});Object.assign(spot.style,{left:startX+'px',top:startY+'px',width:startW+'px',height:startH+'px'});Object.assign(pointer.style,{left:pointerStartLeft+'px',top:pointerStartTop+'px'});
      target.addEventListener('click',close,{once:true});
      if(reduced){Object.assign(card.style,{left:endLeft+'px',top:endTop+'px',opacity:1,transform:'none'});Object.assign(spot.style,{left:endX+'px',top:endY+'px',width:endW+'px',height:endH+'px'});Object.assign(pointer.style,{left:pointerEndLeft+'px',top:pointerEndTop+'px',opacity:1,transform:'none'});pointer.classList.add('arrived');return}
      const duration=3900,ease='cubic-bezier(.22,.8,.25,1)';
      const cardMotion=card.animate([{opacity:0,transform:'translateY(14px) scale(.86)'},{offset:.12,opacity:1,transform:'translateY(0) scale(1.04)'},{offset:.3,left:cardStartLeft+'px',top:cardStartTop+'px',opacity:1,transform:'scale(1)'},{offset:.82,left:endLeft+'px',top:endTop+'px',opacity:1,transform:'scale(.94)'},{left:endLeft+'px',top:endTop+'px',opacity:1,transform:'scale(1)'}],{duration,easing:ease,fill:'forwards'});
      const spotMotion=spot.animate([{left:startX+'px',top:startY+'px',width:startW+'px',height:startH+'px'},{offset:.3,left:startX+'px',top:startY+'px',width:startW+'px',height:startH+'px'},{left:endX+'px',top:endY+'px',width:endW+'px',height:endH+'px'}],{duration,easing:ease,fill:'forwards'});
      const pointerMotion=pointer.animate([{left:pointerStartLeft+'px',top:pointerStartTop+'px',opacity:0,transform:'scale(.55) rotate(-18deg)'},{offset:.12,opacity:1,transform:'scale(1.18) rotate(0)'},{offset:.3,left:pointerStartLeft+'px',top:pointerStartTop+'px',transform:'scale(1)'},{offset:.86,left:pointerEndLeft+'px',top:pointerEndTop+'px',transform:'scale(.9)'},{left:pointerEndLeft+'px',top:pointerEndTop+'px',transform:'scale(1)'}],{duration,easing:ease,fill:'forwards'});
      motions=[cardMotion,spotMotion,pointerMotion];
      Promise.allSettled(motions.map(a=>a.finished)).then(()=>{if(run!==epoch)return;Object.assign(card.style,{left:endLeft+'px',top:endTop+'px',opacity:1,transform:'none'});Object.assign(spot.style,{left:endX+'px',top:endY+'px',width:endW+'px',height:endH+'px'});Object.assign(pointer.style,{left:pointerEndLeft+'px',top:pointerEndTop+'px',opacity:1,transform:'none'});pointer.classList.add('arrived')});
    }
    function play(){close();timer=setTimeout(show,360)}
    root.querySelector('.og-close').addEventListener('click',close);
    addEventListener('message',e=>{if(e.data&&e.data.type==='agent-guide-replay')play()});
    timer=setTimeout(play,120);
    return{play,close};
  }
  window.AgentOnboardingGuide={init};
})();
