const STORAGE_KEY = "advaith-extra-projects";
const THEME_KEY = "advaith-theme";

const baseProjects = [
  {
    title: "ScratchMNIST",
    description: "MNIST classification neural network built from pure NumPy and mathematics.",
    tech: ["Python", "NumPy", "Neural Networks"],
    url: "https://github.com/Advaith-Sujith/ScratchMNIST",
  },
  {
    title: "IrisClassifier",
    description: "Scratch-trained neural network for the Iris dataset, reaching 99.9% accuracy.",
    tech: ["Python", "ML", "Classification"],
    url: "https://github.com/Advaith-Sujith/IrisClassifier",
  },
  {
    title: "California Housing Models",
    description: "Housing-price prediction experiments with from-scratch regression fundamentals.",
    tech: ["Python", "Regression", "Data Science"],
    url: "https://github.com/Advaith-Sujith/CaliforniaHousingRidge",
  },
  {
    title: "Task-0",
    description: "A simple MLOps-style batch processing pipeline for structured project flow.",
    tech: ["Python", "MLOps", "Pipeline"],
    url: "https://github.com/Advaith-Sujith/Task-0",
  },
  {
    title: "Lapse",
    description: "An ultra-minimal timer for staying focused without fiddling.",
    tech: ["HTML", "CSS", "JavaScript"],
    url: "https://github.com/Advaith-Sujith/Lapse",
  },
  {
    title: "Chess",
    description: "A simple chess MVP exploring game state and interaction design.",
    tech: ["Game Logic", "MVP", "MIT"],
    url: "https://github.com/Advaith-Sujith/Chess",
  },
];

function getStoredProjects() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveStoredProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function projectCard(project, index, removable = false) {
  const tech = Array.isArray(project.tech)
    ? project.tech
    : String(project.tech || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  return `
    <article class="project-card reveal" style="transition-delay: ${Math.min(index * 55, 220)}ms">
      <h3>${escapeHTML(project.title)}</h3>
      <p>${escapeHTML(project.description)}</p>
      <div class="project-meta">
        ${tech.map((item) => `<span>${escapeHTML(item)}</span>`).join("")}
      </div>
      ${
        project.url
          ? `<a class="project-link" href="${escapeAttribute(project.url)}" target="_blank" rel="noreferrer">Open project</a>`
          : ""
      }
      ${removable ? `<button class="button ghost danger" type="button" data-remove-project="${index}">Remove</button>` : ""}
    </article>
  `;
}

function renderProjects() {
  const list = document.querySelector("[data-project-list]");
  if (!list) return;

  const projects = [...baseProjects, ...getStoredProjects()];
  list.innerHTML = projects.map((project, index) => projectCard(project, index)).join("");
  observeReveals();
}

function renderExtraProjects() {
  const list = document.querySelector("[data-extra-project-list]");
  if (!list) return;

  const projects = getStoredProjects();
  list.innerHTML = projects.length
    ? projects.map((project, index) => projectCard(project, index, true)).join("")
    : `<p class="empty-state">No extra projects yet. Add one here and it will appear on the main portfolio in this browser.</p>`;
  observeReveals();
}

function setupProjectForm() {
  const form = document.querySelector("[data-project-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const projects = getStoredProjects();
    projects.unshift({
      title: data.get("title"),
      description: data.get("description"),
      tech: String(data.get("tech") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      url: data.get("url"),
    });
    saveStoredProjects(projects);
    form.reset();
    renderExtraProjects();
  });

  document.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-project]");
    if (removeButton) {
      const projects = getStoredProjects();
      projects.splice(Number(removeButton.dataset.removeProject), 1);
      saveStoredProjects(projects);
      renderExtraProjects();
    }

    if (event.target.matches("[data-clear-projects]")) {
      saveStoredProjects([]);
      renderExtraProjects();
    }
  });
}

function setupTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = saved || (prefersDark ? "dark" : "light");

  document.querySelectorAll(".theme-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem(THEME_KEY, next);
    });
  });
}

function observeReveals() {
  const elements = document.querySelectorAll(".reveal:not(.is-observed)");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  elements.forEach((element) => {
    element.classList.add("is-observed");
    observer.observe(element);
  });
}

function escapeHTML(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char];
  });
}

function escapeAttribute(value) {
  return escapeHTML(value).replace(/`/g, "&#96;");
}

setupTheme();
renderProjects();
renderExtraProjects();
setupProjectForm();
observeReveals();
