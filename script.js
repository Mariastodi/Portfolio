const SELECTORS = {
  reveal: ".reveal",
  runButton: "#run-terminal",
  terminalOutput: "#terminal-output",
  currentYear: "#year",
};

const TERMINAL_LINES = [
  '<span class="prompt">$ node about-me.js</span>',
  '<span class="hello">Olá! Sou Maria Beatriz 👋</span>',
  "<span>Desenvolvedora de software e estudante de Engenharia de Software.</span>",
  "<span>Crio produtos mobile e web com tecnologia, cuidado e propósito.</span>",
  '<span class="prompt">Process finished with exit code 0 ✓</span>',
];

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function initializePointerGlow() {
  const root = document.documentElement;

  root.style.setProperty("--mouse-x", "70%");
  root.style.setProperty("--mouse-y", "10%");

  if (prefersReducedMotion) return;

  document.addEventListener(
    "pointermove",
    ({ clientX, clientY }) => {
      root.style.setProperty("--mouse-x", `${clientX}px`);
      root.style.setProperty("--mouse-y", `${clientY}px`);
    },
    { passive: true },
  );
}

function initializeScrollReveals() {
  const elements = document.querySelectorAll(SELECTORS.reveal);

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -35px" },
  );

  elements.forEach((element) => observer.observe(element));
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function createTerminalLine(markup) {
  const line = document.createElement("p");
  line.innerHTML = markup;
  return line;
}

function initializeTerminal() {
  const runButton = document.querySelector(SELECTORS.runButton);
  const output = document.querySelector(SELECTORS.terminalOutput);

  if (!runButton || !output) return;

  runButton.addEventListener("click", async () => {
    runButton.disabled = true;
    runButton.innerHTML = "<span>■</span> Running";
    output.replaceChildren();

    for (const markup of TERMINAL_LINES) {
      output.appendChild(createTerminalLine(markup));
      await wait(prefersReducedMotion ? 0 : 370);
    }

    runButton.innerHTML = "<span>↻</span> Run again";
    runButton.disabled = false;
  });
}

function updateCurrentYear() {
  const year = document.querySelector(SELECTORS.currentYear);
  if (year) year.textContent = new Date().getFullYear();
}

function initializePortfolio() {
  initializePointerGlow();
  initializeScrollReveals();
  initializeTerminal();
  updateCurrentYear();
}

initializePortfolio();
