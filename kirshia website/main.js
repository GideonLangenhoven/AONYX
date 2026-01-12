/* global gsap, ScrollTrigger */
(() => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navClose = document.querySelector("[data-nav-close]");

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
  navClose?.addEventListener("click", () => {
    closeNav();
    navToggle?.classList.remove("is-active");
  });
  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  const handleScroll = () => {
    if (!header) {
      return;
    }
    header.classList.toggle("is-scrolled", window.scrollY > 20);
    nav.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
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

    // Custom animation for About Grid Feature Items
    const featureItems = gsap.utils.toArray(".feature-item");
    if (featureItems.length > 0) {
      gsap.from(featureItems, {
        y: 50,
        opacity: 0,
        duration: 1.6,
        stagger: 0.4, // Reveal one by one, reverse one by one on scroll up
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-grid",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }

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
      "imgs/pics/1.jpg",
      "imgs/pics/2.jpg",
      "imgs/pics/5.jpg",
      "imgs/pics/9.jpg",
      "imgs/pics/10.jpg",
      "imgs/pics/16.jpg"
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
        place: "Snorkel",
        title: "SNORKEL",
        title2: "SAFARI",
        description:
          "Float through the magical kelp forests. We'll guide you through the underwater world, spotting reefs and wildlife in the clear Atlantic. Don't worry about the cold—our wetsuits and excitement will keep you warm!",
        image: "imgs/snorkle.png",
        link: "snorkel.html",
        price: "R850"
      },
      {
        place: "Day walk",
        title: "TIDAL",
        title2: "POOLS",
        description:
          "Take a slow walk on the wild side. We'll explore the shoreline together, spotting colorful critters and learning the secrets of the Cape Peninsula. It's fun, easy-going, and perfect for all ages.",
        image: "imgs/photo2.jpg",
        link: "day.html",
        price: "R450"
      },
      {
        place: "Night walk",
        title: "ORIGINAL",
        title2: "ROCKPOOL",
        description:
          "Experience the coast after dark! Join the original night rock pool tours in Cape Town. We'll show you the nocturnal life of the tidepools under the stars. Safe, guided, and full of glowing wonders.",
        image: "imgs/pics/16.jpg",
        link: "night.html",
        price: "R650"
      },
      {
        place: "Kayak",
        title: "SEA",
        title2: "KAYAKING",
        description:
          "Paddle out and see Cape Town from the blue. Team up with Cape Kayak Adventures to explore the open ocean, visit marine wildlife, and get a fresh perspective on the mountain.",
        image: "imgs/pics/10.jpg",
        link: "#contact",
        price: "R550"
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
      const calculateOffsets = () => {
        offsetTop = (window.innerHeight * 0.96) * 0.5 - (cardHeight * 0.5);
        // Use percentage based logic or safer breakpoints
        if (window.innerWidth > 1400) offsetLeft = window.innerWidth * 0.55;
        else if (window.innerWidth > 1000) offsetLeft = window.innerWidth * 0.55;
        else offsetLeft = window.innerWidth - 80;

        // Override for report recommendation
        if (window.innerWidth >= 1200) offsetLeft = window.innerWidth - 600;
        if (window.innerWidth < 1200) offsetLeft = window.innerWidth - 330;
        if (window.innerWidth < 900) offsetLeft = window.innerWidth - 130;

        if (offsetTop < 100) offsetTop = 100;
      };

      calculateOffsets();

      gsap.set("#pagination", {
        top: offsetTop + 330,
        left: offsetLeft,
        y: 200,
        opacity: 0,
        zIndex: 60,
      });

      // Window resize listener
      window.addEventListener('resize', () => {
        calculateOffsets();
        // Update positions of non-active cards (active is 0,0)
        // Ideally we would re-run the layout logic, but for now let's just update the future positions
        // and the pagination
        gsap.to("#pagination", { top: offsetTop + 330, left: offsetLeft, duration: 0.5 });
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
      const priceEl = document.querySelector(`${detailsActive} .exp-price .amount`);
      if (priceEl) priceEl.textContent = activeData.price;

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
      const priceElInit = document.querySelector(`${activeDetailsSelector} .exp-price .amount`);
      if (priceElInit) priceElInit.textContent = initialData.price;
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
      clicks += 1; // Basic lock preventing rapid clicks could be added
      return new Promise((resolve) => {
        order.push(order.shift());
        detailsEven = !detailsEven;

        const detailsActive = detailsEven ? "#details-even" : "#details-odd";
        const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

        // Update Text Content
        const activeData = data[order[0]];
        document.querySelector(`${detailsActive} .place-box .text`).textContent = activeData.place;
        document.querySelector(`${detailsActive} .title-1`).textContent = activeData.title;
        document.querySelector(`${detailsActive} .title-2`).textContent = activeData.title2;
        document.querySelector(`${detailsActive} .desc`).textContent = activeData.description;
        const priceElStep = document.querySelector(`${detailsActive} .exp-price .amount`);
        if (priceElStep) priceElStep.textContent = activeData.price;

        // Update Link
        const discoverBtn = document.querySelector(`${detailsActive} .cta .exp-btn-ghost`);
        if (discoverBtn) discoverBtn.href = activeData.link;

        gsap.set(detailsActive, { zIndex: 22 });
        gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease });
        gsap.to(`${detailsActive} .text`, {
          y: 0,
          delay: 0.1,
          duration: 0.7,
          ease,
        });
        gsap.to(`${detailsActive} .title-1`, {
          y: 0,
          delay: 0.15,
          duration: 0.7,
          ease,
        });
        gsap.to(`${detailsActive} .title-2`, {
          y: 0,
          delay: 0.15,
          duration: 0.7,
          ease,
        });
        gsap.to(`${detailsActive} .desc`, {
          y: 0,
          delay: 0.3,
          duration: 0.4,
          ease,
        });
        gsap.to(`${detailsActive} .cta`, {
          y: 0,
          delay: 0.35,
          duration: 0.4,
          onComplete: resolve,
          ease,
        });
        gsap.set(detailsInactive, { zIndex: 12 });

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

            gsap.set(detailsInactive, { opacity: 0 });
            gsap.set(`${detailsInactive} .text`, { y: 100 });
            gsap.set(`${detailsInactive} .title-1`, { y: 100 });
            gsap.set(`${detailsInactive} .title-2`, { y: 100 });
            gsap.set(`${detailsInactive} .desc`, { y: 50 });
            gsap.set(`${detailsInactive} .cta`, { y: 60 });
            // clicks -= 1; // handling debounce if needed
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
      });
    }

    // Attach Click Events
    // Attach Click Events
    const btnRight = document.querySelector('.exp-arrow-right');
    const btnLeft = document.querySelector('.exp-arrow-left');

    const stepReverse = () => {
      return new Promise((resolve) => {
        // Rotate order for reverse: move last explicitly to first
        // Actually, logic for step() moves first to last. Reverse should move last to first.
        const last = order.pop();
        if (last !== undefined) {
          order.unshift(last);
        }

        detailsEven = !detailsEven;
        const detailsActive = detailsEven ? "#details-even" : "#details-odd";
        const detailsInactive = detailsEven ? "#details-odd" : "#details-even";

        document.querySelector("#details-even").style.zIndex = detailsEven ? 22 : 12;
        document.querySelector("#details-odd").style.zIndex = detailsEven ? 12 : 22;

        gsap.set(detailsActive, { zIndex: 22 });
        gsap.set(detailsInactive, { zIndex: 12 });

        // Update Text Content (Crucially missing before)
        const activeData = data[order[0]];
        document.querySelector(`${detailsActive} .place-box .text`).textContent = activeData.place;
        document.querySelector(`${detailsActive} .title-1`).textContent = activeData.title;
        document.querySelector(`${detailsActive} .title-2`).textContent = activeData.title2;
        document.querySelector(`${detailsActive} .desc`).textContent = activeData.description;
        const priceElStep = document.querySelector(`${detailsActive} .exp-price .amount`);
        if (priceElStep) priceElStep.textContent = activeData.price;

        // Update Link
        const discoverBtn = document.querySelector(`${detailsActive} .cta .exp-btn-ghost`);
        if (discoverBtn) discoverBtn.href = activeData.link;

        const [active, ...rest] = order;

        // Animate Out Current
        gsap.set(detailsInactive, { opacity: 0 });
        gsap.set(`${detailsInactive} .text`, { y: 100 });
        gsap.set(`${detailsInactive} .title-1`, { y: 100 });
        gsap.set(`${detailsInactive} .title-2`, { y: 100 });
        gsap.set(`${detailsInactive} .desc`, { y: 50 });
        gsap.set(`${detailsInactive} .cta`, { y: 60 });

        // TEXT ANIMATION (In New)
        gsap.to(detailsActive, { opacity: 1, duration: 0.4, ease });
        gsap.to(`${detailsActive} .text`, { y: 0, delay: 0.1, duration: 0.7, ease });
        gsap.to(`${detailsActive} .title-1`, { y: 0, delay: 0.15, duration: 0.7, ease });
        gsap.to(`${detailsActive} .title-2`, { y: 0, delay: 0.15, duration: 0.7, ease });
        gsap.to(`${detailsActive} .desc`, { y: 0, delay: 0.3, duration: 0.4, ease });
        gsap.to(`${detailsActive} .cta`, { y: 0, delay: 0.35, duration: 0.4, ease });

        // CARD ANIMATION
        // The 'active' is now the first element of our rotated order.
        gsap.to(getCard(active), {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: 0,
          opacity: 1,
          zIndex: 100, // Background
          ease,
          duration: 0.5
        });

        gsap.to(getCardContent(active), {
          x: 0,
          y: 0,
          opacity: 0, // Text hidden on background
          duration: 0.3,
          ease
        });

        // SLIDES
        gsap.to(".progress-sub-foreground", {
          width: 300 * (1 / order.length) * (active + 1),
          ease,
        });

        gsap.to(getSliderItem(active), { x: 0, ease }); // Number

        // Rest of cards
        rest.forEach((i, index) => {
          gsap.set(getCard(i), { zIndex: 30 }); // Foreground
          gsap.to(getCard(i), {
            x: offsetLeft + (index * (cardWidth + cardGap)),
            y: offsetTop,
            width: cardWidth,
            height: cardHeight,
            opacity: 1,
            borderRadius: 10,
            ease,
            delay: 0.1 * (index + 1)
          });
          gsap.to(getCardContent(i), {
            x: offsetLeft + (index * (cardWidth + cardGap)),
            y: offsetTop + cardHeight - 100,
            opacity: 1,
            zIndex: 40,
            ease,
            delay: 0.1 * (index + 1)
          });
          gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease });
        });
        setTimeout(resolve, 500);
      });
    };

    if (btnRight) {
      btnRight.addEventListener('click', () => {
        // Disable button temporarily to prevent rapid clicks?
        step();
      });
    }

    if (btnLeft) {
      btnLeft.addEventListener('click', () => {
        stepReverse();
      });
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

// Contact Form Handling (Mock)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate network request
    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      btn.style.backgroundColor = '#4ade80'; // Green
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.backgroundColor = '';
      }, 3000);
    }, 1500);
  });
}

// --- Tide & Light Widget Logic (Stormglass API - Proxy/Front-end) ---
// Note: In production, API calls should be routed through a backend to hide the key.
// Implementing client-side purely for demonstration purposes as per request.

// --- Weather & Tide Widget Logic ---
// Implements 7-Day Forecast with Stormglass API and LocalStorage Caching

const setupTideWidget = async () => {
  const widget = document.querySelector('.tide-widget');
  if (!widget) return;

  const key = "8182e246-eae1-11f0-b4de-0242ac130003-8182e2e6-eae1-11f0-b4de-0242ac130003";
  const lat = -33.9065;
  const lng = 18.3973;

  // DOM Elements
  const dateEl = widget.querySelector('.tide-date');
  const lowTideEl = document.getElementById('low-tide-time');
  const highTideEl = document.getElementById('high-tide-time');
  const moonEl = document.getElementById('moon-phase');
  const headerEl = widget.querySelector('h3');
  const forecastGrid = document.getElementById('forecast-grid');

  // New Data Elements
  const swellEl = document.getElementById('swell-data');
  const windEl = document.getElementById('wind-data');
  const tempEl = document.getElementById('water-temp');
  const cloudEl = document.getElementById('cloud-cover');

  // Helper: Format Time
  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Helper: Get Local YYYY-MM-DD
  const getLocalDateStr = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper: Get Moon Phase
  const getMoonPhase = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 3) { year--; month += 12; }
    ++month;
    let c = 365.25 * year;
    let e = 30.6 * month;
    let jd = c + e + day - 694039.09;
    jd /= 29.5305882;
    let b = parseInt(jd);
    jd -= b;
    b = Math.round(jd * 8);
    if (b >= 8) b = 0;
    const phases = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"];
    const distFromFull = Math.abs(jd - 0.5);
    const illumination = Math.round((0.5 - distFromFull) * 2 * 100);
    return { phase: phases[b], illumination: `${illumination}%` };
  };

  // Helper: Generate Biologist Note from REAL Data
  const getBioNote = (cond) => {
    let note = "Conditions are stable. Great for exploring the intertidal zone.";
    if (!cond) return note;

    const swellH = parseFloat(cond.swellHeight || 0);
    const windS = parseFloat(cond.windSpeed || 0);
    const cloudC = parseFloat(cond.cloudCover || 0);
    const waterT = parseFloat(cond.waterTemp || 14);

    if (swellH > 1.8) {
      note = `High energy swell (~${swellH}m) today. Rock pools will be turbulent. Snorkeling not advised; stick to sheltered intake pools or kayaking.`;
    } else if (swellH < 1.2 && windS < 20) {
      note = `Prime conditions! Low swell (${swellH}m) and manageable wind mean excellent visibility for spotting octopus and shysharks.`;
    } else if (windS > 25) {
      note = "The 'Cape Doctor' is blowing strong. Surface water will be choppy, driving nutrient upwelling. Good for kite surfing, hard for snorkeling.";
    } else if (cloudC < 20) {
      note = "Clear skies tonight! Perfect for Night Walks to see bioluminescence and star constellations reflecting on calm water.";
    } else if (cloudC > 80) {
      note = "Overcast lighting reduces glare, arguably making it easier to spot invertebrates in shallow tidal pools during the day.";
    } else if (waterT <= 11) {
      note = `Water is fresh (${waterT}°C)! Cold upwelling suggests high nutrient load—look for active filter feeders.`;
    }
    return note;
  };

  // Function to Render Data to UI
  const renderUI = (dailyData) => {
    if (!dailyData || dailyData.length === 0) return;

    // Set Header Data (Today)
    const today = dailyData[0];
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-ZA', options);
    headerEl.textContent = "Ocean Report: Three Anchor Bay";

    // Initial Main Widget Update (Today)
    lowTideEl.textContent = today.low ? formatTime(today.low.time) : '--:--';
    highTideEl.textContent = today.high ? formatTime(today.high.time) : '--:--';

    // Real Extra Data
    if (swellEl) swellEl.textContent = `${today.swellHeight || '-'}m ${today.swellDir || ''}`;
    if (windEl) windEl.textContent = `${today.windSpeed || '-'}kts ${today.windDir || ''}`;
    if (tempEl) tempEl.textContent = `${today.waterTemp || '-'}°C`;
    if (cloudEl) cloudEl.textContent = `${today.cloudCover || '-'}%`;

    const moon = getMoonPhase(now);
    moonEl.textContent = moon.phase;
    if (moonEl.nextElementSibling) moonEl.nextElementSibling.textContent = moon.illumination + ' Illumination';
    document.getElementById('bio-note').textContent = today.note;

    // Render Forecast Grid
    if (forecastGrid) {
      forecastGrid.innerHTML = '';

      dailyData.forEach((day, index) => {
        const displayDate = new Date(day.date + 'T00:00:00');

        const dayName = displayDate.toLocaleDateString('en-US', { weekday: 'short' });
        const fullDate = displayDate.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

        const moonData = getMoonPhase(displayDate);

        // Weather Icon determination
        let icon = "☀️";
        if (day.cloudCover > 50) icon = "☁️";
        if (day.windSpeed > 30) icon = "🌬️";
        if (day.swellHeight > 2.5) icon = "🌊";

        const card = document.createElement('div');
        card.className = `forecast-card ${index === 0 ? 'active' : ''}`;

        // Data attributes
        card.dataset.date = fullDate;
        card.dataset.low = day.low ? formatTime(day.low.time) : '--:--';
        card.dataset.high = day.high ? formatTime(day.high.time) : '--:--';
        card.dataset.moon = moonData.phase;
        card.dataset.illum = moonData.illumination;

        card.dataset.swell = `${day.swellHeight || '-'}m ${day.swellDir || ''}`;
        card.dataset.wind = `${day.windSpeed || '-'}kts ${day.windDir || ''}`;
        card.dataset.temp = `${day.waterTemp || '-'}°C`;
        card.dataset.cloud = `${day.cloudCover || '-'}%`;
        card.dataset.note = day.note;

        card.innerHTML = `
          <div class="forecast-day">${dayName}</div>
          <div class="forecast-icon">${icon}</div>
          <div class="forecast-temp">${day.airTemp || '--'}°C</div>
          <div class="forecast-desc">${day.weatherDesc || 'Clear'}</div>
        `;

        card.onclick = () => {
          document.querySelectorAll('.forecast-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');

          document.querySelector('.tide-date').textContent = card.dataset.date;
          document.getElementById('low-tide-time').textContent = card.dataset.low;
          document.getElementById('high-tide-time').textContent = card.dataset.high;
          document.getElementById('moon-phase').textContent = card.dataset.moon;

          if (swellEl) swellEl.textContent = card.dataset.swell;
          if (windEl) windEl.textContent = card.dataset.wind;
          if (tempEl) tempEl.textContent = card.dataset.temp;
          if (cloudEl) cloudEl.textContent = card.dataset.cloud;

          const mv = document.getElementById('moon-phase');
          if (mv.nextElementSibling) mv.nextElementSibling.textContent = card.dataset.illum + ' Illumination';
          document.getElementById('bio-note').textContent = card.dataset.note;
        };

        forecastGrid.appendChild(card);
      });
    }
  };

  // Fetch Logic
  try {
    const CACHE_KEY = 'kirshia_ocean_cache_v6'; // New unified Cache
    const CACHE_SKEW = 1000 * 60 * 60 * 5; // 5 Hours

    // Check Cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if ((Date.now() - timestamp) < CACHE_SKEW) {
        const todayStr = getLocalDateStr(new Date());
        if (data[0] && data[0].date === todayStr) {
          console.log("Using cached unified data");
          renderUI(data);
          return;
        }
      }
    }

    console.log("Fetching fresh ocean data...");
    const now = new Date();
    const startStr = getLocalDateStr(now);
    const future = new Date(now);
    future.setDate(future.getDate() + 7);
    const endStr = getLocalDateStr(future);

    // 1. Fetch Stormglass Tides
    // (Still need Stormglass for accurate Tide Extremes)
    const tidePromise = fetch(`https://api.stormglass.io/v2/tide/extremes/point?lat=${lat}&lng=${lng}&start=${startStr}&end=${endStr}`, {
      headers: { 'Authorization': key }
    });

    // 2. Fetch Open-Meteo Weather (Wind, Cloud, Temp)
    // Using 'forecast' endpoint
    const omWeatherPromise = fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,wind_speed_10m_max,wind_direction_10m_dominant,cloud_cover_mean,weather_code&timezone=auto`);

    // 3. Fetch Open-Meteo Marine (Swell, Wave Dir)
    const omMarinePromise = fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&daily=wave_height_max,wave_direction_dominant&timezone=auto`);

    const [tideRes, weatherRes, marineRes] = await Promise.all([tidePromise, omWeatherPromise, omMarinePromise]);

    if (!tideRes.ok) throw new Error("Tide API Error");
    if (!weatherRes.ok) throw new Error("Weather API Error");
    if (!marineRes.ok) throw new Error("Marine API Error");

    const tideData = await tideRes.json();
    const weatherData = await weatherRes.json();
    const marineData = await marineRes.json();

    // Process & Merge Data
    const grouped = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const dateStr = getLocalDateStr(d);
      grouped[dateStr] = {
        date: dateStr,
        low: null,
        high: null,
        swellHeight: 0, swellDir: '',
        windSpeed: 0, windDir: '',
        waterTemp: 14,
        airTemp: 0,
        cloudCover: 0,
        weatherDesc: 'Fine',
        note: ''
      };
    }

    // Fill Tides
    tideData.data.forEach(item => {
      // item.time is ISO (UTC). Convert to Local Date String for matching
      const itemDateLocal = getLocalDateStr(new Date(item.time));
      if (grouped[itemDateLocal]) {
        if (item.type === 'low' && !grouped[itemDateLocal].low) grouped[itemDateLocal].low = item;
        if (item.type === 'high' && !grouped[itemDateLocal].high) grouped[itemDateLocal].high = item;
      }
    });

    const getDirStr = (deg) => {
      const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      return dirs[Math.round(deg / 45) % 8];
    };

    const getWeatherText = (code) => {
      if (code === 0) return "Clear Skies";
      if (code < 3) return "Partly Cloudy";
      if (code < 50) return "Foggy";
      if (code < 80) return "Rainy";
      return "Stormy";
    };

    const wDaily = weatherData.daily;
    const mDaily = marineData.daily;

    wDaily.time.forEach((dateKey, idx) => {
      if (grouped[dateKey]) {
        // Open-Meteo returns km/h. Convert to Knots (1 km/h = 0.539957 knots).
        const windKph = wDaily.wind_speed_10m_max[idx];
        const windKnots = Math.round(windKph / 1.852);

        grouped[dateKey].windSpeed = windKnots;
        grouped[dateKey].windDir = getDirStr(wDaily.wind_direction_10m_dominant[idx]);
        grouped[dateKey].cloudCover = Math.round(wDaily.cloud_cover_mean[idx]);
        grouped[dateKey].airTemp = Math.round(wDaily.temperature_2m_max[idx]);
        grouped[dateKey].weatherDesc = getWeatherText(wDaily.weather_code[idx]);
      }
    });

    mDaily.time.forEach((dateKey, idx) => {
      if (grouped[dateKey]) {
        const waveH = mDaily.wave_height_max[idx];
        grouped[dateKey].swellHeight = waveH ? waveH.toFixed(1) : '1.0';
        grouped[dateKey].swellDir = getDirStr(mDaily.wave_direction_dominant[idx]);
        const isSE = grouped[dateKey].windDir.includes('S') || grouped[dateKey].windDir.includes('E');
        grouped[dateKey].waterTemp = isSE ? 11 : 14;
      }
    });

    const dailyData = Object.values(grouped);
    dailyData.forEach(day => {
      day.note = getBioNote(day);
    });

    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: dailyData
    }));

    renderUI(dailyData);

  } catch (err) {
    console.error("Ocean data fetch failed", err);
    lowTideEl.textContent = "Unavailable";
    if (forecastGrid) forecastGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center">Data unavailable. Please try again later.</div>';
  }
};

// Initialize
setupTideWidget();

// --- Mobile Nav Animation Logic ---
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("is-active");
  });
  // Also reset if clicking link
  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("is-active");
    });
  });
}

// --- Urgency Badge Logic ---
const urgencyDateEl = document.getElementById("next-tour-date");
if (urgencyDateEl) {
  // Find next Friday or Saturday
  const today = new Date();
  const nextDate = new Date(today);
  // Simple logic: If Mon-Thu, show this Friday. If Fri-Sun, show next Friday.
  // (Simplified: just show date 3 days from now for demo 'urgency')
  nextDate.setDate(today.getDate() + 3);

  const options = { month: 'short', day: 'numeric' };
  urgencyDateEl.textContent = nextDate.toLocaleDateString('en-ZA', options);
}

// --- Multi-Step Booking Logic ---
window.selectVibe = (vibe) => {
  const step1 = document.getElementById('booking-step-1');
  const form = document.getElementById('booking-form');
  const input = document.getElementById('selected-tour');
  const display = document.getElementById('selected-vibe-display');

  if (step1 && form && input) {
    input.value = vibe;
    display.textContent = vibe;

    // Animate transition
    gsap.to(step1, {
      opacity: 0,
      y: -20,
      duration: 0.3,
      onComplete: () => {
        step1.style.display = 'none';
        form.style.display = 'grid'; // Form is grid layout
        gsap.fromTo(form, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
      }
    });
  }
};

window.resetVibe = () => {
  const step1 = document.getElementById('booking-step-1');
  const form = document.getElementById('booking-form');

  gsap.to(form, {
    opacity: 0,
    y: 20,
    duration: 0.3,
    onComplete: () => {
      form.style.display = 'none';
      step1.style.display = 'block';
      gsap.fromTo(step1, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4 });
    }
  });
};

/* --- Mobile Experiences Slider Logic --- */
(() => {
  const container = document.getElementById('exp-slider-container-mobile');
  if (!container) return; // Only run if mobile container exists

  const dotsContainer = document.getElementById('dotsContainer');
  const cards = container.querySelectorAll('.exp-card-wrapper');
  const nextBtn = document.getElementById('nextBtnMobile');
  const prevBtn = document.getElementById('prevBtnMobile');

  if (cards.length === 0) return;

  // 1. Create Dots based on card count
  let dots = [];
  if (dotsContainer) {
    dotsContainer.innerHTML = ''; // Clear existing
  }

  cards.forEach((card, index) => {
    // Add click listener to card itself
    card.addEventListener('click', () => {
      scrollToSlide(index);
    });

    if (!dotsContainer) {
      return;
    }

    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      scrollToSlide(index);
    });
    dotsContainer.appendChild(dot);
  });

  if (dotsContainer) {
    dots = Array.from(dotsContainer.querySelectorAll('.dot'));
  }
  // State to track current index for buttons
  let currentIndex = 0;

  const getMetrics = () => {
    const firstCard = cards[0];
    if (!firstCard) {
      return { step: 0, paddingLeft: 0 };
    }

    const containerStyles = window.getComputedStyle(container);
    const gapValue = parseFloat(containerStyles.columnGap || containerStyles.gap || '0') || 0;
    const paddingLeft = parseFloat(containerStyles.paddingLeft || '0') || 0;
    const cardWidth = firstCard.offsetWidth || 0;

    return { step: cardWidth + gapValue, paddingLeft };
  };

  const clampIndex = (index) => Math.max(0, Math.min(index, cards.length - 1));

  const updateDots = (activeIndex) => {
    if (dots.length === 0) return;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  };

  // 2. Function to scroll to specific slide
  function scrollToSlide(index) {
    if (!cards[0]) return;

    // Bounds check
    const safeIndex = clampIndex(index);

    const { step, paddingLeft } = getMetrics();
    const targetLeft = step * safeIndex + paddingLeft;
    if (typeof container.scrollTo === 'function') {
      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth'
      });
    } else {
      container.scrollLeft = targetLeft;
    }
    // Update index immediately for button usage
    currentIndex = safeIndex;
    updateDots(currentIndex);
  }

  // 3. Update Dots on Scroll
  container.addEventListener('scroll', () => {
    const { step, paddingLeft } = getMetrics();
    if (!step) return;

    const scrollLeft = container.scrollLeft;
    const activeIndex = clampIndex(Math.round((scrollLeft - paddingLeft) / step));

    // Sync our local state
    currentIndex = activeIndex;
    updateDots(activeIndex);
  });

  // 4. Button Logic
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      scrollToSlide(currentIndex + 1);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      scrollToSlide(currentIndex - 1);
    });
  }
})();
