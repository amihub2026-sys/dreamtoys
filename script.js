
/* Loading screen: calm 3.2 second presentation */
(function(){
  const loader = document.getElementById("siteLoader");
  if(!loader) return;

  const hideLoader = () => {
    loader.classList.add("hide");
    setTimeout(()=>loader.remove(), 700);
  };

  // Keep the branded loading screen visible for about 3.2 seconds.
  window.addEventListener("load", ()=>{
    setTimeout(hideLoader, 3200);
  }, {once:true});

  // Safety fallback if a remote image/server is slow.
  setTimeout(hideLoader, 4200);
})();


document.getElementById("year").textContent = new Date().getFullYear();

/* Mobile menu elements */
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");

/* Active nav by scroll */
const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...mainNav.querySelectorAll("a[href^='#']")];
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
    }
  });
},{rootMargin:"-40% 0px -50% 0px",threshold:0});
sections.forEach(s => navObserver.observe(s));

/* Hero slider */
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const dotsHost = document.getElementById("heroDots");
let heroIndex = 0;
let heroTimer;

heroSlides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Go to slide ${i+1}`);
  if(i===0) dot.classList.add("active");
  dot.addEventListener("click", () => showHero(i));
  dotsHost.appendChild(dot);
});
const heroDots = [...dotsHost.children];

function showHero(i){
  heroIndex = (i + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((s,n) => {
    s.classList.toggle("active", n===heroIndex);
    const copy = s.querySelector(".hero-copy");
    if(n===heroIndex){
      copy.classList.remove("reveal-up");
      void copy.offsetWidth;
      copy.classList.add("reveal-up");
    }
  });
  heroDots.forEach((d,n)=>d.classList.toggle("active",n===heroIndex));
  restartHero();
}
function restartHero(){
  clearInterval(heroTimer);
  heroTimer = setInterval(()=>showHero(heroIndex+1),6000);
}
document.getElementById("heroPrev").addEventListener("click",()=>showHero(heroIndex-1));
document.getElementById("heroNext").addEventListener("click",()=>showHero(heroIndex+1));
restartHero();

/* Swipe hero on mobile */
let touchStartX = 0;
document.getElementById("heroSlider").addEventListener("touchstart",e=>touchStartX=e.touches[0].clientX,{passive:true});
document.getElementById("heroSlider").addEventListener("touchend",e=>{
  const dx = e.changedTouches[0].clientX - touchStartX;
  if(Math.abs(dx)>45) showHero(dx<0 ? heroIndex+1 : heroIndex-1);
},{passive:true});

/* Collection horizontal slider */
const collectionTrack = document.getElementById("collectionTrack");
function collectionStep(){ return collectionTrack.clientWidth * .82; }
document.getElementById("collectionPrev").addEventListener("click",()=>collectionTrack.scrollBy({left:-collectionStep(),behavior:"smooth"}));
document.getElementById("collectionNext").addEventListener("click",()=>collectionTrack.scrollBy({left:collectionStep(),behavior:"smooth"}));

/* Reveal animations */
const revealObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach(el=>revealObserver.observe(el));

/* Counters */
let countersPlayed=false;
const statsBox=document.querySelector(".stats-box");
const counterObserver=new IntersectionObserver(entries=>{
  if(entries[0].isIntersecting && !countersPlayed){
    countersPlayed=true;
    document.querySelectorAll("[data-count]").forEach(el=>{
      const target=Number(el.dataset.count);
      const start=performance.now();
      const duration=1500;
      function animate(now){
        const p=Math.min((now-start)/duration,1);
        const eased=1-Math.pow(1-p,3);
        el.textContent=Math.floor(target*eased).toLocaleString();
        if(p<1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    });
  }
},{threshold:.3});
counterObserver.observe(statsBox);

/* Occasion preview */
const occasionImage=document.getElementById("occasionImage");
const occasionTitle=document.getElementById("occasionTitle");
const occasionKicker=document.getElementById("occasionKicker");
document.querySelectorAll("#occasionTabs button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll("#occasionTabs button").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    occasionImage.style.opacity="0";
    setTimeout(()=>{
      occasionImage.src=btn.dataset.image;
      occasionImage.alt=btn.dataset.title;
      occasionTitle.textContent=btn.dataset.title;
      occasionKicker.textContent=btn.dataset.title.toUpperCase()+" COLLECTION";
      occasionImage.style.opacity="1";
    },180);
  });
});
occasionImage.style.transition="opacity .35s ease";

/* Image graceful fallback */
document.querySelectorAll("img").forEach(img=>{
  img.addEventListener("error",()=>{
    img.style.opacity=".22";
    img.alt="Online image unavailable";
  });
});




/* Review slider */
const reviewItems = [...document.querySelectorAll(".review")];
const reviewDotsHost = document.getElementById("reviewDots");
let reviewIndex = 0;
if(reviewItems.length && reviewDotsHost){
  reviewItems.forEach((_,i)=>{
    const b=document.createElement("button");
    if(i===0) b.classList.add("active");
    b.addEventListener("click",()=>showReview(i));
    reviewDotsHost.appendChild(b);
  });
  const rdots=[...reviewDotsHost.children];
  function showReview(i){
    reviewIndex=(i+reviewItems.length)%reviewItems.length;
    reviewItems.forEach((r,n)=>r.classList.toggle("active",n===reviewIndex));
    rdots.forEach((d,n)=>d.classList.toggle("active",n===reviewIndex));
  }
  document.getElementById("reviewPrev").addEventListener("click",()=>showReview(reviewIndex-1));
  document.getElementById("reviewNext").addEventListener("click",()=>showReview(reviewIndex+1));
  setInterval(()=>showReview(reviewIndex+1),6500);
}

/* FAQ accordion */
document.querySelectorAll(".faq-item button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const item=btn.closest(".faq-item");
    const wasOpen=item.classList.contains("active");
    document.querySelectorAll(".faq-item").forEach(x=>x.classList.remove("active"));
    if(!wasOpen) item.classList.add("active");
  });
});


/* Contact form -> WhatsApp */
const contactForm = document.getElementById("contactForm");
if(contactForm){
  contactForm.addEventListener("submit", e=>{
    e.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    const occasion = document.getElementById("contactOccasion").value;
    const product = document.getElementById("contactProduct").value;
    const message = document.getElementById("contactMessage").value.trim() || "No extra details";

    const text = `Hello dreem World! I would like to enquire about a custom order.

Name: ${name}
Phone: ${phone}
Occasion: ${occasion}
Product: ${product}
Requirement: ${message}

Please share availability, pricing and next steps.`;

    window.open("https://wa.me/919940924687?text="+encodeURIComponent(text), "_blank");
  });
}


/* Product order -> WhatsApp with dynamic product name */
document.querySelectorAll(".product-order-btn").forEach(btn=>{
  btn.addEventListener("click", e=>{
    e.preventDefault();

    const product = btn.dataset.product || "dreem World Product";
    const message = `Hello dreem World! I want to order this product:

Product: ${product}

Please send me:
- Price
- Available colours/designs
- Customisation options
- Delivery details

Thank you.`;

    window.open(
      "https://wa.me/919940924687?text=" + encodeURIComponent(message),
      "_blank"
    );
  });
});




/* FINAL mobile navigation - fixed drawer, touch/click safe */
(function(){
  if(!menuToggle || !mainNav) return;

  const openMenu = () => {
    mainNav.classList.add("open");
    document.body.classList.add("mobile-menu-open");
    menuToggle.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded","true");
    if(mobileNavBackdrop) mobileNavBackdrop.classList.add("show");
  };

  const closeMenu = () => {
    mainNav.classList.remove("open");
    document.body.classList.remove("mobile-menu-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded","false");
    if(mobileNavBackdrop) mobileNavBackdrop.classList.remove("show");
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(mainNav.classList.contains("open")) closeMenu();
    else openMenu();
  };

  // Use pointerup so it works reliably for mouse + touch.
  menuToggle.addEventListener("pointerup", toggleMenu);

  mainNav.querySelectorAll("a").forEach(link=>{
    link.addEventListener("click", closeMenu);
  });

  if(mobileNavBackdrop){
    mobileNavBackdrop.addEventListener("pointerup", closeMenu);
  }

  document.addEventListener("keydown", e=>{
    if(e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", ()=>{
    if(window.innerWidth > 768) closeMenu();
  });
})();


/* Sticky header compact-on-scroll */
const stickyHeader = document.getElementById("header");
if(stickyHeader){
  const updateStickyHeader = () => {
    stickyHeader.classList.toggle("scrolled", window.scrollY > 45);
  };
  updateStickyHeader();
  window.addEventListener("scroll", updateStickyHeader, {passive:true});
}
