// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:0.15});
revealEls.forEach(el=>revealObserver.observe(el));

// Active tab highlighting on scroll
const sections = document.querySelectorAll('section[id]');
const tabs = document.querySelectorAll('.tab');

const sectionObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const id = entry.target.getAttribute('id');
      tabs.forEach(tab=>{
        tab.classList.toggle('active', tab.getAttribute('href') === '#' + id);
      });
    }
  });
},{rootMargin:'-40% 0px -50% 0px'});
sections.forEach(sec=>sectionObserver.observe(sec));

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const tabbar = document.getElementById('tabbar');
if(menuBtn){
  menuBtn.addEventListener('click', ()=>{
    tabbar.classList.toggle('menu-open');
  });
  tabs.forEach(tab=>{
    tab.addEventListener('click', ()=> tabbar.classList.remove('menu-open'));
  });
}
