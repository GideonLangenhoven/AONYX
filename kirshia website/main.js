/* global gsap, ScrollTrigger */
(() => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");

  const toggleNav = () => {
    if (!nav) {
      return;
    }
    nav.classList.toggle("is-open");
    document.body.classList.toggle("no-scroll", nav.classList.contains("is-open"));
  };

  const closeNav = () => {
    if (!nav) {
      return;
    }
    nav.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  };

  navToggle?.addEventListener("click", toggleNav);
  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  const handleScroll = () => {
    if (!header) {
      return;
    }
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  const setupLightbox = () => {
    const lightbox = document.querySelector("[data-lightbox]");
    const items = Array.from(document.querySelectorAll("[data-gallery-item]"));
    if (!lightbox || items.length === 0) {
      return;
    }

    const image = lightbox.querySelector("[data-lightbox-image]");
    const caption = lightbox.querySelector("[data-lightbox-caption]");
    const closeBtn = lightbox.querySelector("[data-lightbox-close]");
    const prevBtn = lightbox.querySelector("[data-lightbox-prev]");
    const nextBtn = lightbox.querySelector("[data-lightbox-next]");

    let currentIndex = 0;

    const updateImage = () => {
      const current = items[currentIndex];
      const img = current?.querySelector("img");
      if (!img || !image) {
        return;
      }
      image.src = img.src;
      image.alt = img.alt || "Gallery image";
      if (caption) {
        caption.textContent = img.alt || "";
      }
    };

    const openLightbox = (index) => {
      currentIndex = index;
      updateImage();
      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
    };

    items.forEach((item, index) => {
      item.addEventListener("click", () => openLightbox(index));
    });

    closeBtn?.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    prevBtn?.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateImage();
    });

    nextBtn?.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % items.length;
      updateImage();
    });

    // Keyboard nav
    document.addEventListener("keydown", (event) => {
      if (lightbox.hidden) return;

      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % items.length;
        updateImage();
      }
      if (event.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateImage();
      }
    });
  };

  const setupScrollAnimations = () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray("[data-animate]").forEach((element) => {
      gsap.from(element, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    });

    const hero = document.querySelector(".hero_content");
    if (hero) {
      gsap.from(hero.children, {
        y: 20,
        opacity: 0,
        duration: 1.5,
        delay: 0.5,
        ease: "power3.out",
        stagger: 0.1,
      });
    }

    const navCta = document.querySelector(".nav-cta");
    if (navCta) {
      gsap.from(navCta, {
        y: -10,
        opacity: 0,
        duration: 1.2,
        delay: 1.2,
        ease: "power2.out",
      });
    }

    gsap.utils.toArray("[data-parallax]").forEach((element) => {
      const speed = Number(element.dataset.parallax) || 0.15;
      gsap.to(element, {
        y: () => -(speed * 120),
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    setupExperiencesSlider();
    setupHeroSlider();
  };

  const setupHeroSlider = () => {
    const container = document.querySelector(".hero_media");
    if (!container) return;

    const images = [
      "imgs/photo4.jpg",
      "imgs/photo6.jpg",
      "imgs/pics/1.jpg",
      "imgs/pics/2.jpg",
      "imgs/pics/3.jpeg",
      "imgs/pics/4.jpg",
      "imgs/pics/5.jpg",
      "imgs/pics/6.jpg",
      "imgs/pics/7.jpg",
      "imgs/pics/8.jpg",
      "imgs/pics/9.jpg",
      "imgs/pics/11.jpg",
      "imgs/pics/13.jpg",
      "imgs/pics/14.jpg",
      "imgs/pics/15.jpg",
      "imgs/pics/16.jpg",
      "imgs/pics/18.jpg",
      "imgs/pics/20.jpg"
    ];

    // Clear existing static slides
    container.innerHTML = "";

    // Create slides
    images.forEach((src) => {
      const slide = document.createElement("div");
      slide.classList.add("hero_slide");
      slide.style.backgroundImage = `url('${src}')`;
      container.appendChild(slide);
    });

    const slides = container.querySelectorAll(".hero_slide");
    let current = 0;

    // Init state
    gsap.set(slides, { opacity: 0, scale: 1.1, zIndex: 0 });
    gsap.set(slides[0], { opacity: 1, scale: 1, zIndex: 1 });

    const nextSlide = () => {
      const next = (current + 1) % slides.length;

      const tl = gsap.timeline();

      // Animate next in
      tl.set(slides[next], { zIndex: 2, opacity: 0, scale: 1.1 })
        .to(slides[next], {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "power2.out"
        })
        // Reset previous
        .set(slides[current], { zIndex: 0, opacity: 0 })
        .set(slides[next], { zIndex: 1 }); // Becomes current base

      current = next;
      gsap.delayedCall(6, nextSlide); // Wait 6 seconds
    };

    gsap.delayedCall(6, nextSlide);
  };

  const setupExperiencesSlider = async () => {
    const container = document.getElementById("exp-slider-container");
    if (!container) return;

    const data = [
      {
        place: "Night walk",
        title: "ORIGINAL",
        title2: "ROCKPOOL",
        description:
          "Experience the coast after dark! Join the original night rock pool tours in Cape Town. We'll show you the nocturnal life of the tidepools under the stars. Safe, guided, and full of glowing wonders.",
        image: "imgs/pics/16.jpg",
        link: "night.html",
      },
      {
        place: "Day walk",
        title: "TIDAL",
        title2: "POOLS",
        description:
          "Take a slow walk on the wild side. We'll explore the shoreline together, spotting colorful critters and learning the secrets of the Cape Peninsula. It's fun, easy-going, and perfect for all ages.",
        image: "imgs/photo2.jpg",
        link: "day.html",
      },
      {
        place: "Snorkel",
        title: "SNORKEL",
        title2: "SAFARI",
        description:
          "Float through the magical kelp forests. We'll guide you through the underwater world, spotting reefs and wildlife in the clear Atlantic. Don't worry about the cold—our wetsuits and excitement will keep you warm!",
        image: "imgs/snorkle.png",
        link: "snorkel.html",
      },
      {
        place: "Kayak",
        title: "SEA",
        title2: "KAYAKING",
        description:
          "Paddle out and see Cape Town from the blue. Team up with Cape Kayak Adventures to explore the open ocean, visit marine wildlife, and get a fresh perspective on the mountain.",
        image: "imgs/pics/10.jpg",
        link: "#contact",
      },
    ];

    const _ = (id) => document.getElementById(id);
    const cards = data
      .map(
        (i, index) =>
          `<div class="exp-card" id="exp-card${index}" style="background-image:url(${i.image})"></div>`
      )
      .join("");
    const cardContents = data
      .map(
        (i, index) => `<div class="exp-card-content" id="exp-card-content-${index}">
<div class="content-start"></div>
<div class="content-place">${i.place}</div>
<div class="content-title-1">${i.title}</div>
<div class="content-title-2">${i.title2}</div>
</div>`
      )
      .join("");

    const slideNumbers = data
      .map((_, index) => `<div class="item" id="slide-item-${index}">${index + 1}</div>`)
      .join("");

    container.innerHTML = cards + cardContents;
    const slideNumbersEl = _("slide-numbers");
    if (slideNumbersEl) slideNumbersEl.innerHTML = slideNumbers;

    function getCard(index) {
      return `#exp-card${index}`;
    }
    function getCardContent(index) {
      return `#exp-card-content-${index}`;
    }
    function getSliderItem(index) {
      return `#slide-item-${index}`;
    }

    function animate(target, duration, properties) {
      return new Promise((resolve) => {
        gsap.to(target, {
          ...properties,
          duration: duration,
          onComplete: resolve,
        });
      });
    }

    let order = [0, 1, 2, 3];
    let detailsEven = true;

    let cardWidth = 250;
    let cardHeight = 375;
    let gap = 40;

    // Responsive offsets - shifted right by 20rem (approx 320px)
    // Vertically centered: (SectionHeight * 0.5) - (CardHeight * 0.5)
    let offsetTop = (window.innerHeight * 0.96) * 0.5 - (cardHeight * 0.5);
    // Add a slight nudge up if needed, but true center is best start.

    let offsetLeft = window.innerWidth - 510; // Was 830

    // Fallback for smaller screens
    if (window.innerWidth < 1000) {
      offsetLeft = window.innerWidth - 80; // Was 400
    }

    let numberSize = 50;
    const ease = "sine.inOut";

    function initSlider() {
      const [active, ...rest] = order;
      // Use distinct variable names to avoid shadowing the state variable 'detailsEven'
      const detailsActive = detailsEven ? "#details-even" : "#details-odd";
      const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

      // Re-calc on init
      offsetTop = (window.innerHeight * 0.96) * 0.5 - (cardHeight * 0.5);
      offsetLeft = window.innerWidth - 510; // Was 830
      if (window.innerWidth < 1200) offsetLeft = window.innerWidth - 330; // Was 650
      if (window.innerWidth < 900) offsetLeft = window.innerWidth - 130;  // Was 450
      if (offsetTop < 100) offsetTop = 100;

      gsap.set("#pagination", {
        top: offsetTop + 330,
        left: offsetLeft,
        y: 200,
        opacity: 0,
        zIndex: 60,
      });

      gsap.set(getCard(active), {
        x: 0,
        y: 0,
        width: "100%",
        height: "100%",
      });
      gsap.set(getSliderItem(active), { x: 0 });
      gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
      gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
      gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });

      // Set initial text content
      const activeData = data[active];
      document.querySelector(`${detailsActive} .place-box .text`).textContent = activeData.place;
      document.querySelector(`${detailsActive} .title-1`).textContent = activeData.title;
      document.querySelector(`${detailsActive} .title-2`).textContent = activeData.title2;
      document.querySelector(`${detailsActive} .desc`).textContent = activeData.description;
      document.querySelector(`${detailsActive} .cta .exp-btn-ghost`).href = activeData.link;

      gsap.set(`${detailsInactive} .text`, { y: 100 });
      gsap.set(`${detailsInactive} .title-1`, { y: 100 });
      gsap.set(`${detailsInactive} .title-2`, { y: 100 });
      gsap.set(`${detailsInactive} .desc`, { y: 50 });
      gsap.set(`${detailsInactive} .cta`, { y: 60 });

      gsap.set(".progress-sub-foreground", {
        width: 300 * (1 / order.length) * (active + 1),
      });

      rest.forEach((i, index) => {
        gsap.set(getCard(i), {
          x: offsetLeft + 400 + index * (cardWidth + gap),
          y: offsetTop,
          width: cardWidth,
          height: cardHeight,
          zIndex: 30,
          borderRadius: 10,
        });
        gsap.set(getCardContent(i), {
          x: offsetLeft + 400 + index * (cardWidth + gap),
          zIndex: 40,
          y: offsetTop + cardHeight - 100,
        });
        gsap.set(getSliderItem(i), { x: (index + 1) * numberSize });
      });

      gsap.set(".exp-indicator", { x: -window.innerWidth });

      // Initial Content Set
      const initialData = data[order[0]];
      const activeDetailsSelector = detailsEven ? "#details-even" : "#details-odd";
      document.querySelector(`${activeDetailsSelector} .place-box .text`).textContent = initialData.place;
      document.querySelector(`${activeDetailsSelector} .title-1`).textContent = initialData.title;
      document.querySelector(`${activeDetailsSelector} .title-2`).textContent = initialData.title2;
      document.querySelector(`${activeDetailsSelector} .desc`).textContent = initialData.description;
      const discoverBtn = document.querySelector(`${activeDetailsSelector} .cta .exp-btn-ghost`);
      if (discoverBtn) discoverBtn.href = initialData.link;

      const startDelay = 0.6;

      gsap.to(".exp-cover", {
        x: window.innerWidth + 400,
        delay: 0.5,
        ease,
        onComplete: () => {
          // Removing auto-play loop call here to let user control or just init manually
          // loop();
          // Auto-play might be too aggressive, let's start with just setting it up ready for interaction
          // User requested "the section only to behave like this", likely implying the interaction logic
        },
      });

      rest.forEach((i, index) => {
        gsap.to(getCard(i), {
          x: offsetLeft + index * (cardWidth + gap),
          zIndex: 30,
          delay: 0.05 * index,
          ease,
          delay: startDelay,
        });
        gsap.to(getCardContent(i), {
          x: offsetLeft + index * (cardWidth + gap),
          zIndex: 40,
          delay: 0.05 * index,
          ease,
          delay: startDelay,
        });
      });
      gsap.to("#pagination", { y: 0, opacity: 1, ease, delay: startDelay });
      gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });

      // Click event for cards
      gsap.utils.toArray(".exp-card").forEach((card) => {
        card.style.cursor = "pointer";
        card.addEventListener("click", () => step());
      });
    }

    let clicks = 0;

    async function step() {
      clicks += 1;
      return new Promise((resolve) => {
        order.push(order.shift());
        detailsEven = !detailsEven;
        updateSliderState(resolve);
      });
    }

    async function stepBack() {
      clicks += 1;
      return new Promise((resolve) => {
        order.unshift(order.pop());
        detailsEven = !detailsEven;
        updateSliderState(resolve, true);
      });
    }

    function updateSliderState(resolve, isBack = false) {
      const detailsActive = detailsEven ? "#details-even" : "#details-odd";
      const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

      // Update Text Content
      const activeData = data[order[0]];
      document.querySelector(`${detailsActive} .place-box .text`).textContent = activeData.place;
      document.querySelector(`${detailsActive} .title-1`).textContent = activeData.title;
      document.querySelector(`${detailsActive} .title-2`).textContent = activeData.title2;
      document.querySelector(`${detailsActive} .desc`).textContent = activeData.description;

      // Update Link
      const discoverBtn = document.querySelector(`${detailsActive} .cta .exp-btn-ghost`);
      if (discoverBtn) discoverBtn.href = activeData.link;

      gsap.set(detailsActive, { zIndex: 22 });
      gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease });
      gsap.to(`${detailsActive} .text`, { y: 0, delay: 0.1, duration: 0.7, ease });
      gsap.to(`${detailsActive} .title-1`, { y: 0, delay: 0.15, duration: 0.7, ease });
      gsap.to(`${detailsActive} .title-2`, { y: 0, delay: 0.15, duration: 0.7, ease });
      gsap.to(`${detailsActive} .desc`, { y: 0, delay: 0.3, duration: 0.4, ease });
      gsap.to(`${detailsActive} .cta`, { y: 0, delay: 0.35, duration: 0.4, onComplete: resolve, ease });

      gsap.set(detailsInactive, { zIndex: 12 });
      gsap.set(`${detailsInactive} .text`, { y: 100 });
      gsap.set(`${detailsInactive} .title-1`, { y: 100 });
      gsap.set(`${detailsInactive} .title-2`, { y: 100 });
      gsap.set(`${detailsInactive} .desc`, { y: 50 });
      gsap.set(`${detailsInactive} .cta`, { y: 60 });
      gsap.to(detailsInactive, { opacity: 0 });

      if (!isBack) {
        // Forward Animation
        const [active, ...rest] = order;
        const prv = rest[rest.length - 1];

        gsap.set(getCard(prv), { zIndex: 10 });
        gsap.set(getCard(active), { zIndex: 20 });
        gsap.to(getCard(prv), { scale: 1.5, ease });

        gsap.to(getCardContent(active), {
          y: offsetTop + cardHeight - 10,
          opacity: 0,
          duration: 0.3,
          ease,
        });
        gsap.to(getSliderItem(active), { x: 0, ease });
        gsap.to(getSliderItem(prv), { x: -numberSize, ease });
        gsap.to(".progress-sub-foreground", {
          width: 300 * (1 / order.length) * (active + 1),
          ease,
        });

        gsap.to(getCard(active), {
          x: 0,
          y: 0,
          ease,
          width: "100%",
          height: "100%",
          borderRadius: 0,
          onComplete: () => {
            const xNew = offsetLeft + (rest.length - 1) * (cardWidth + gap);
            gsap.set(getCard(prv), {
              x: xNew,
              y: offsetTop,
              width: cardWidth,
              height: cardHeight,
              zIndex: 30,
              borderRadius: 10,
              scale: 1,
            });

            gsap.set(getCardContent(prv), {
              x: xNew,
              y: offsetTop + cardHeight - 100,
              opacity: 1,
              zIndex: 40,
            });
            gsap.set(getSliderItem(prv), { x: rest.length * numberSize });
          },
        });

        rest.forEach((i, index) => {
          if (i !== prv) {
            const xNew = offsetLeft + index * (cardWidth + gap);
            gsap.set(getCard(i), { zIndex: 30 });
            gsap.to(getCard(i), {
              x: xNew,
              y: offsetTop,
              width: cardWidth,
              height: cardHeight,
              ease,
              delay: 0.1 * (index + 1),
            });

            gsap.to(getCardContent(i), {
              x: xNew,
              y: offsetTop + cardHeight - 100,
              opacity: 1,
              zIndex: 40,
              ease,
              delay: 0.1 * (index + 1),
            });
            gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease });
          }
        });
      } else {
        // Back Animation
        const [active, ...rest] = order; // active is the new one (was at stack end)
        // Order is now [NewActive, Stack1, Stack2, Stack3]
        // Before was [Stack1, Stack2, Stack3, NewActive] 
        // So 'active' corresponds to what WAS Stack 3.
        // And 'active' needs to move to Main.
        // order[1] (Stack 1) corresponds to what WAS Main.

        const leavingMain = order[1];
        const newMain = active; // order[0]

        // 1. Move Leaving Main (order[1]) to Stack 1 position
        gsap.set(getCard(leavingMain), { zIndex: 30, borderRadius: 10 }); // Reset to card look
        gsap.to(getCard(leavingMain), {
          x: offsetLeft,
          y: offsetTop,
          width: cardWidth,
          height: cardHeight,
          scale: 1,
          ease
        });
        gsap.to(getCardContent(leavingMain), {
          x: offsetLeft,
          y: offsetTop + cardHeight - 100,
          opacity: 1,
          zIndex: 40,
          ease
        });
        gsap.to(getSliderItem(leavingMain), { x: numberSize, ease });

        // 2. Move New Main (active, order[0]) to Main position
        // It should animate FROM Stack 3 position
        // But we want it to look like it comes "around"? Or just slides in from right?
        // Let's just slide it from its current position (Stack 3) to 0,0
        // We ensure it is above the leaving main? Or below? 
        // If Leaving Main goes to Stack 1 (Z=30), New Main going to Main (Z=20) should be below.

        gsap.set(getCard(newMain), { zIndex: 20 });
        gsap.to(getCard(newMain), {
          x: 0,
          y: 0,
          width: "100%",
          height: "100%",
          borderRadius: 0,
          ease
        });
        gsap.to(getCardContent(newMain), {
          y: offsetTop + cardHeight - 10,
          opacity: 0,
          duration: 0.3,
          ease,
        });
        gsap.to(getSliderItem(newMain), { x: 0, ease });

        // 3. Shift the rest of the stack (order[2], order[3]...) to their new positions
        // They were at pos N-1, now at pos N.
        rest.forEach((i, index) => {
          if (i !== leavingMain) { // leavingMain is index 0 of rest
            // index includes leavingMain.
            // rest = [leavingMain, stack2, stack3]
            // index 0 -> leavingMain (handled above)
            // index 1 -> stack2 (needs to go to stack 2 pos)
            // index 2 -> stack3 (needs to go to stack 3 pos)

            const xNew = offsetLeft + index * (cardWidth + gap);
            gsap.set(getCard(i), { zIndex: 30 });
            gsap.to(getCard(i), {
              x: xNew,
              y: offsetTop,
              width: cardWidth,
              height: cardHeight,
              ease,
              delay: 0.05 * index,
            });
            gsap.to(getCardContent(i), {
              x: xNew,
              y: offsetTop + cardHeight - 100,
              opacity: 1,
              zIndex: 40,
              ease,
              delay: 0.05 * index
            });
            gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease });
          }
        });

        gsap.to(".progress-sub-foreground", {
          width: 300 * (1 / order.length) * (active + 1),
          ease,
        });
      }
    }

    // Attach Click Events
    const btnRight = document.querySelector('.exp-arrow-right');
    const btnLeft = document.querySelector('.exp-arrow-left');

    if (btnRight) {
      btnRight.addEventListener('click', () => step());
    }

    if (btnLeft) {
      btnLeft.addEventListener('click', () => stepBack());
    }

    initSlider();
  };

  const setupCarousel = () => {
    const track = document.querySelector(".gallery-track");
    if (!track) return;

    // Clone items for infinite loop
    const items = Array.from(track.children);
    items.forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      // Update data attribute or keep it distinct for lightbox if needed
      // For lightbox, we want clones to open their original counterpart index or just work independently.
      // Lightbox gathers all [data-gallery-item], so clones will be added to the list.
      // This technically works but `openLightbox(index)` needs to correspond to the visible list.
      track.appendChild(clone);
    });

    // Simple infinite marquee
    // Calculate total width of original items + gap is roughly half of current width (since we cloned).
    // Animate xPercent to -50% (move left by half the track width).

    // Create the loop tween
    const loop = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 100, // Adjust speed (seconds)
      repeat: -1
    });

    // Hover to pause logic: pause the specific tween, not global timeline
    track.addEventListener("mouseenter", () => loop.pause());
    track.addEventListener("mouseleave", () => loop.play());
  };

  setupCarousel();
  setupLightbox();
  setupScrollAnimations();
})();
