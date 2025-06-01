/*  *****  ¿Qué pinta?  *****  */
document.addEventListener('DOMContentLoaded', () => {
    const plansCarousel   = document.getElementById('plansCarousel');
    const prevBtn         = document.getElementById('prevPlan');
    const nextBtn         = document.getElementById('nextPlan');
    const dotsContainer   = document.getElementById('carouselDots');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const categorySelect  = document.getElementById('category-filter');
    const companySelect   = document.getElementById('company-filter');
    const locationInput   = document.getElementById('location-filter');

    /* ——— 1.   Valoración por estrellas ——— */
    plansCarousel.querySelectorAll('.plan-card').forEach(card => {
        const rating = parseInt(card.dataset.rating || '0', 10);
        card.querySelectorAll('.fa-star').forEach((star, idx) => {
            if (idx < rating) star.classList.add('filled');
        });
    });

    /* ——— 2.   Carrusel (flechas) ——— */
    const cardGap  = 30;
    const cardW    = plansCarousel.querySelector('.plan-card').offsetWidth + cardGap;
    let scrollPos  = 0;

    function scrollTo(val){
        plansCarousel.scrollTo({left: val, behavior:'smooth'});
        scrollPos = val;    updateDots();
    }
    nextBtn.addEventListener('click', () => {
        const visible = Math.round(plansCarousel.offsetWidth / cardW) || 1;
        scrollTo((scrollPos + cardW * visible) % plansCarousel.scrollWidth);
    });
    prevBtn.addEventListener('click', () => {
        const visible = Math.round(plansCarousel.offsetWidth / cardW) || 1;
        scrollPos = scrollPos - cardW * visible;
        if (scrollPos < 0) scrollPos = plansCarousel.scrollWidth - plansCarousel.offsetWidth;
        scrollTo(scrollPos);
    });

    /* ——— 3.   Dots dinámicos ——— */
    function buildDots(){
        dotsContainer.innerHTML='';
        const totalCards = plansCarousel.children.length;
        const perView    = Math.round(plansCarousel.offsetWidth / cardW) || 1;
        const dotCount   = Math.ceil(totalCards / perView);

        for (let i=0;i<dotCount;i++){
            const d=document.createElement('span');
            d.className='dot';d.dataset.index=i;
            d.addEventListener('click',()=>scrollTo(i*cardW*perView));
            dotsContainer.appendChild(d);
        }
        updateDots();
    }
    function updateDots(){
        const perView = Math.round(plansCarousel.offsetWidth / cardW) || 1;
        const act     = Math.round(plansCarousel.scrollLeft / (cardW*perView));
        dotsContainer.querySelectorAll('.dot').forEach((dot,i)=>dot.classList.toggle('active',i===act));
    }
    buildDots();
    plansCarousel.addEventListener('scroll',()=>{ clearTimeout(plansCarousel._t); plansCarousel._t=setTimeout(updateDots,120); });
    window.addEventListener('resize', buildDots);

    /* ——— 4.   Filtros ——— */
    applyFiltersBtn.addEventListener('click', () => {
        const cat  = categorySelect.value;
        const comp = companySelect.value;
        const loc  = locationInput.value.trim().toLowerCase();

        plansCarousel.querySelectorAll('.plan-card').forEach(card => {
            const matchCat  = (cat  === 'all') || (card.dataset.category === cat);
            const matchComp = (comp === 'all') || (card.dataset.company  === comp);
            const matchLoc  = !loc || card.querySelector('.location').textContent.toLowerCase().includes(loc);

            card.style.display = (matchCat && matchComp && matchLoc) ? 'flex' : 'none';
        });
        buildDots();   // rehacer dots con las tarjetas visibles
    });
});
