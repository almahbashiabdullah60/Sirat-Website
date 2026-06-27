(function(){
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.setAttribute('data-revealed','true');io.unobserve(e.target)}});
  },{threshold:.08,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('[data-reveal]').forEach(function(el){io.observe(el)});
})();

(function(){
  var nav=document.getElementById('nav');
  var lastY=0,ticking=false;
  window.addEventListener('scroll',function(){
    if(!ticking){requestAnimationFrame(function(){
      var y=window.pageYOffset;
      if(y>60)nav.classList.add('is-scrolled');else nav.classList.remove('is-scrolled');
      if(y>lastY&&y>160)nav.classList.add('is-hidden');else nav.classList.remove('is-hidden');
      lastY=y;ticking=false;
    });ticking=true;}
  });
})();

(function(){
  var tabs=[
    {img:'./assets/img/screens/main_apps.jpg',desc:'desc-0'},
    {img:'./assets/img/screens/vpn_dashboard.jpg',desc:'desc-1'},
    {img:'./assets/img/screens/ai_chat.jpg',desc:'desc-2'},
    {img:'./assets/img/screens/behavior_analytics.jpg',desc:'desc-3'},
    {img:'./assets/img/screens/supervisor_system.jpg',desc:'desc-4'}
  ];
  var cur=0;
  var img=document.getElementById('walkthroughImg');
  var counter=document.getElementById('tabCounter');
  var pills=document.querySelectorAll('.tab-pill');
  img.style.transition='opacity .25s ease';

  function go(idx){
    if(idx<0)idx=tabs.length-1;
    if(idx>=tabs.length)idx=0;
    cur=idx;
    img.style.opacity='0';
    setTimeout(function(){img.src=tabs[idx].img;img.style.opacity='1'},250);
    counter.textContent=(idx+1)+' / '+tabs.length;
    pills.forEach(function(p,i){p.classList.toggle('active',i===idx)});
    document.querySelectorAll('#desc-0,#desc-1,#desc-2,#desc-3,#desc-4').forEach(function(d){d.style.display='none'});
    var d=document.getElementById(tabs[idx].desc);
    if(d)d.style.display='';
  }

  pills.forEach(function(p,i){p.addEventListener('click',function(){go(i)})});
  document.getElementById('prevTab').addEventListener('click',function(){go(cur-1)});
  document.getElementById('nextTab').addEventListener('click',function(){go(cur+1)});
  go(0);
})();

document.getElementById('year').textContent=new Date().getFullYear();
