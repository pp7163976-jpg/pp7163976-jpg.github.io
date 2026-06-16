// State management for user custom descriptions
const state = {
  text1: "I dont know from where I should start,there a lot in my mind from a while so I made this website only for you.I know I made mistakes ,directly or indirectly my words hurt you, I am bad at expressing myself with words but  with actions lets see.",
  text2: "When you take picture of moon,you never say the moon is ugly .You just say the camera coundent capture how beautiful it really is.Now imagine the Moon is You. Whenever you doubt yourself remember,its never you that lacking, people can't capture your true beauty.",
  text3: "I want to take responsibility for my actions. It was never my intention to make you feel this way.You are gorgious anyone with a good heart and eyes can see that but that's the least intreasting about you according to me.You dont have to go like I have a thought or anything you can direct say to me that I am crossing my limits .",
  text4: "Please forgive me..."
};

// Affirmation words celebrating beauty in imperfection
const affirmations = [
  "Perfectly Imperfect", "Flawed & Beautiful", "Authentic", "Uniquely You", 
  "Masterpiece", "Loved as You Are", "Whole", "Strong in Cracks", 
  "One of a Kind", "Brave", "Real", "Worth Loving", "Radiant", "Resilient",
  "Gold-Seamed", "Beautifully Made", "Graceful", "Pure Gold"
];

let floatingInterval = null;

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  initNoButtonBehavior();
  setupContenteditableSync();
  initMusic();
});

// Setup blur listener to auto-sync contenteditable edits to internal state
function setupContenteditableSync() {
  document.addEventListener('blur', (e) => {
    if (e.target.hasAttribute('contenteditable')) {
      const id = e.target.id;
      const textVal = e.target.textContent.trim();
      
      if (id === 'text-1') {
        state.text1 = textVal || state.text1;
      } else if (id === 'text-2') {
        state.text2 = textVal || state.text2;
      } else if (id === 'text-3') {
        state.text3 = textVal || state.text3;
      } else if (id === 'text-4') {
        state.text4 = textVal || state.text4;
      }
    }
  }, true); // Use capture phase to catch all blur events
}

// Start generating floating hearts, stars, and words (triggered on entering Card 2)
function startFloatingElements() {
  if (floatingInterval) return;
  
  const container = document.getElementById('bg-decorations');
  
  // Spawn initial cluster
  for (let i = 0; i < 15; i++) {
    spawnRandomElement(container, true);
  }
  
  // Continuous spawn loop
  floatingInterval = setInterval(() => {
    spawnRandomElement(container, false);
  }, 900);
}

function spawnRandomElement(container, randomizeStartHeight = false) {
  const rand = Math.random();
  if (rand < 0.35) {
    createFloatingHeart(container, randomizeStartHeight);
  } else if (rand < 0.70) {
    createFloatingStar(container, randomizeStartHeight);
  } else {
    createFloatingWord(container, randomizeStartHeight);
  }
}

// Helper to configure basic float animation properties
function applyFloatingPhysics(el, durationRange, scaleRange, randomizeHeight) {
  const duration = durationRange[0] + Math.random() * (durationRange[1] - durationRange[0]);
  el.style.left = `${Math.random() * 100}vw`;
  el.style.animationDuration = `${duration}s`;
  
  const scale = scaleRange[0] + Math.random() * (scaleRange[1] - scaleRange[0]);
  el.style.setProperty('--scale', scale);
  
  if (randomizeHeight) {
    const delay = -(Math.random() * duration);
    el.style.animationDelay = `${delay}s`;
  } else {
    el.style.animationDelay = '0s';
  }

  // Remove element from DOM once it goes off-screen
  setTimeout(() => {
    el.remove();
  }, (duration + 1) * 1000);
}

function createFloatingHeart(container, randomizeHeight) {
  const heart = document.createElement('div');
  heart.classList.add('floating-heart');
  container.appendChild(heart);
  applyFloatingPhysics(heart, [7, 13], [0.4, 0.9], randomizeHeight);
}

function createFloatingStar(container, randomizeHeight) {
  const star = document.createElement('div');
  star.classList.add('floating-star');
  container.appendChild(star);
  applyFloatingPhysics(star, [8, 14], [0.5, 1.1], randomizeHeight);
}

function createFloatingWord(container, randomizeHeight) {
  const word = document.createElement('div');
  word.classList.add('floating-word');
  
  // Select a random empowering word
  const randomIndex = Math.floor(Math.random() * affirmations.length);
  word.textContent = affirmations[randomIndex];
  
  container.appendChild(word);
  applyFloatingPhysics(word, [9, 16], [0.8, 1.25], randomizeHeight);
}

// Handles transition logic and page-specific animations
function nextPage(currentPageNum) {
  const currentCard = document.getElementById(`card-${currentPageNum}`);
  const nextCard = document.getElementById(`card-${currentPageNum + 1}`);

  if (!currentCard || !nextCard) return;

  // Background state adjustment
  if (currentPageNum === 1) {
    // Leaving Card 1 -> Card 2: Lotus fades out, Moon fades in
    const lotusOverlay = document.getElementById('lotus-bg-overlay');
    const moonOverlay = document.getElementById('moon-bg-overlay');
    
    if (lotusOverlay) {
      lotusOverlay.style.opacity = '0';
      setTimeout(() => {
        lotusOverlay.style.display = 'none';
      }, 1500);
    }
    
    if (moonOverlay) {
      moonOverlay.style.opacity = '1';
    }
    
    startFloatingElements();
  }

  if (currentPageNum === 3) {
    // Leaving Card 3 -> Card 4: Moon fades out, Kintsugi fades in
    const moonOverlay = document.getElementById('moon-bg-overlay');
    const kintsugiOverlay = document.getElementById('kintsugi-bg-overlay');
    
    if (moonOverlay) {
      moonOverlay.style.opacity = '0';
      setTimeout(() => {
        moonOverlay.style.display = 'none';
      }, 1500);
    }
    
    if (kintsugiOverlay) {
      kintsugiOverlay.style.opacity = '1';
    }

    // Sync edited contents with the scrapbook summary on Card 5
    document.getElementById('scrapbook-text-1').textContent = `"${state.text1}"`;
    document.getElementById('scrapbook-text-2').textContent = `"${state.text2}"`;
  }

  // Select page-specific entry/exit animations
  let exitAnimClass = '';
  let enterAnimClass = '';

  if (currentPageNum === 1) {
    exitAnimClass = 'slide-left-exit';
    enterAnimClass = 'slide-right-enter';
  } else if (currentPageNum === 2) {
    exitAnimClass = 'slide-left-exit';
    enterAnimClass = 'slide-right-enter';
  } else if (currentPageNum === 3) {
    exitAnimClass = 'zoom-exit';
    enterAnimClass = 'zoom-enter';
  } else if (currentPageNum === 4) {
    exitAnimClass = 'slide-down-exit';
    enterAnimClass = 'float-up-enter';
  }

  // Perform transition
  currentCard.classList.add(exitAnimClass);
  nextCard.classList.add('active');
  nextCard.classList.add(enterAnimClass);

  // Clean up transition helper classes after completion
  setTimeout(() => {
    currentCard.classList.remove('active');
    currentCard.classList.remove(exitAnimClass);
    nextCard.classList.remove(enterAnimClass);
  }, 900);
}

function handleYesClick(event) {
  const btn = event.currentTarget;
  // If the button is not focused yet, focus it so they can edit it.
  // A second click when already focused triggers the accept animation!
  if (document.activeElement !== btn) {
    btn.focus();
    return;
  }
  forgiveAccept();
}

// Teleporting No Button
function initNoButtonBehavior() {
  const btnNo = document.getElementById('btn-no');
  
  btnNo.addEventListener('mouseover', moveNoButton);
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveNoButton();
  });
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
  });
}

function moveNoButton() {
  const btnNo = document.getElementById('btn-no');
  
  // If the user is currently editing the "No" button label, don't teleport it!
  if (document.activeElement === btnNo) return;

  const cardBody = document.querySelector('#card-4 .card-body');
  const container = document.getElementById('choice-container');

  const cardRect = cardBody.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const btnRect = btnNo.getBoundingClientRect();

  // Bounding rect safety box relative to container top-left
  const minX = cardRect.left - containerRect.left + 15;
  const maxX = cardRect.right - containerRect.left - btnRect.width - 15;
  const minY = cardRect.top - containerRect.top + 15;
  const maxY = cardRect.bottom - containerRect.top - btnRect.height - 15;

  let randomX = Math.random() * (maxX - minX) + minX;
  let randomY = Math.random() * (maxY - minY) + minY;

  randomX = Math.max(minX, Math.min(randomX, maxX));
  randomY = Math.max(minY, Math.min(randomY, maxY));

  btnNo.style.left = `${randomX}px`;
  btnNo.style.top = `${randomY}px`;
}

// Accept Flow (Yes button)
function forgiveAccept() {
  const yesBtn = document.getElementById('btn-yes');
  const yesRect = yesBtn.getBoundingClientRect();
  
  const particleCount = 45;
  const container = document.getElementById('particle-container');
  const pageContainer = document.querySelector('.app-container');
  const containerRect = pageContainer.getBoundingClientRect();
  
  const originX = yesRect.left - containerRect.left + (yesRect.width / 2);
  const originY = yesRect.top - containerRect.top + (yesRect.height / 2);

  // Trigger particle burst
  for (let i = 0; i < particleCount; i++) {
    createHeartParticle(container, originX, originY);
  }

  // Pre-load scrapbook content
  document.getElementById('scrapbook-text-1').textContent = `"${state.text1}"`;
  document.getElementById('scrapbook-text-2').textContent = `"${state.text2}"`;

  // Wait for burst animation and transition
  setTimeout(() => {
    nextPage(4);
  }, 1200);
}

function createHeartParticle(container, x, y) {
  const particle = document.createElement('div');
  particle.classList.add('particle-heart');
  
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  
  const angle = Math.random() * Math.PI * 2;
  const velocity = 3 + Math.random() * 9;
  const vx = Math.cos(angle) * velocity;
  const vy = Math.sin(angle) * velocity - 2.5; 
  
  const scale = 0.45 + Math.random() * 0.75;
  particle.style.transform = `translate(-50%, -50%) rotate(-45deg) scale(${scale})`;
  
  container.appendChild(particle);

  let posX = x;
  let posY = y;
  let currentVx = vx;
  let currentVy = vy;
  let opacity = 1;
  const gravity = 0.16;
  
  const interval = setInterval(() => {
    posX += currentVx;
    posY += currentVy;
    currentVy += gravity;
    currentVx *= 0.975;
    opacity -= 0.02;
    
    particle.style.left = `${posX}px`;
    particle.style.top = `${posY}px`;
    particle.style.opacity = opacity;
    
    if (opacity <= 0) {
      clearInterval(interval);
      particle.remove();
    }
  }, 16);
}

// Background Music Logic
let userMuted = false;

function initMusic() {
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-toggle');
  if (!bgMusic || !musicBtn) return;

  bgMusic.volume = 0.15; // Keep it soft

  // Play/pause toggle event
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMusic();
  });

  // Autoplay compliance click listener
  const startAutoplay = () => {
    if (!userMuted && bgMusic.paused) {
      bgMusic.play().then(() => {
        musicBtn.classList.remove('muted');
        musicBtn.classList.add('playing');
      }).catch((err) => {
        console.log("Autoplay blocked:", err);
        musicBtn.classList.remove('playing');
        musicBtn.classList.add('muted');
      });
    }
    document.removeEventListener('click', startAutoplay);
    document.removeEventListener('touchstart', startAutoplay);
  };

  document.addEventListener('click', startAutoplay);
  document.addEventListener('touchstart', startAutoplay);
}

function toggleMusic() {
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-toggle');
  if (!bgMusic || !musicBtn) return;

  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      userMuted = false;
      musicBtn.classList.remove('muted');
      musicBtn.classList.add('playing');
    }).catch((err) => {
      console.error("Failed to play audio:", err);
    });
  } else {
    bgMusic.pause();
    userMuted = true;
    musicBtn.classList.remove('playing');
    musicBtn.classList.add('muted');
  }
}

// Previous Page navigation logic
function prevPage(currentPageNum) {
  const currentCard = document.getElementById(`card-${currentPageNum}`);
  const prevCard = document.getElementById(`card-${currentPageNum - 1}`);

  if (!currentCard || !prevCard) return;

  // Background overlays reverse transition
  if (currentPageNum === 2) {
    const lotusOverlay = document.getElementById('lotus-bg-overlay');
    const moonOverlay = document.getElementById('moon-bg-overlay');
    
    if (lotusOverlay) {
      lotusOverlay.style.display = 'block';
      void lotusOverlay.offsetWidth; // Force reflow
      lotusOverlay.style.opacity = '1';
    }
    
    if (moonOverlay) {
      moonOverlay.style.opacity = '0';
      setTimeout(() => {
        if (!document.getElementById('card-2').classList.contains('active')) {
          moonOverlay.style.display = 'none';
        }
      }, 1500);
    }
    
    stopFloatingElements();
  }

  if (currentPageNum === 3) {
    const moonOverlay = document.getElementById('moon-bg-overlay');
    const kintsugiOverlay = document.getElementById('kintsugi-bg-overlay');
    
    if (moonOverlay) {
      moonOverlay.style.display = 'block';
      void moonOverlay.offsetWidth; // Force reflow
      moonOverlay.style.opacity = '1';
    }
    
    if (kintsugiOverlay) {
      kintsugiOverlay.style.opacity = '0';
    }
  }

  // Determine transition classes based on pages
  let exitAnimClass = '';
  let enterAnimClass = '';

  if (currentPageNum === 2) {
    exitAnimClass = 'slide-right-exit';
    enterAnimClass = 'slide-left-enter';
  } else if (currentPageNum === 3) {
    exitAnimClass = 'zoom-exit-reverse';
    enterAnimClass = 'zoom-enter-reverse';
  } else if (currentPageNum === 4 || currentPageNum === 5) {
    exitAnimClass = 'slide-down-exit';
    enterAnimClass = 'float-up-enter';
  }

  // Trigger transition
  currentCard.classList.add(exitAnimClass);
  prevCard.classList.add('active');
  prevCard.classList.add(enterAnimClass);

  // Cleanup classes
  setTimeout(() => {
    currentCard.classList.remove('active');
    currentCard.classList.remove(exitAnimClass);
    prevCard.classList.remove(enterAnimClass);
  }, 900);
}

// Stop floating background decoration elements
function stopFloatingElements() {
  if (floatingInterval) {
    clearInterval(floatingInterval);
    floatingInterval = null;
  }
  
  const container = document.getElementById('bg-decorations');
  if (container) {
    const floaters = container.querySelectorAll('.floating-heart, .floating-star, .floating-word');
    floaters.forEach(el => el.remove());
  }
}
