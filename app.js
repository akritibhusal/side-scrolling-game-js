const APP = "[data-app]";
const RUNNER = "[data-app-runner]";
const OBSTACLE = "[data-app-obstacle]";
const APP_TITLE = "[data-app-title]";
const APP_SUBTITLE = "[data-app-subtitle]";
const APP_SCORE = "[data-app-score]";

const TEXT_APP_TITLE = "START";
const TEXT_APP_SUBTITLE = "Press Space to Jump";
const TEXT_APP_END_TITLE = "GAME OVER";
const TEXT_APP_END_SUBTITLE = "Press Space to Restart";

const app = document.querySelector(APP);
const runner = document.querySelector(RUNNER);
const obstacle = document.querySelector(OBSTACLE);
const appTitle = document.querySelector(APP_TITLE);
const appSubtitle = document.querySelector(APP_SUBTITLE);
const appScore = document.querySelector(APP_SCORE);

let score = 0;
let checkDeadInterval;

const startOnKeyPress = (e) => {
  document.removeEventListener("keydown", startOnKeyPress);
  startGame();
  appTitle.style.display = "none";
  appSubtitle.style.display = "none";
  observer.observe(obstacle);
  checkDead();
};

const setAppMessage = (type) => {
  if (type === "start") {
    appTitle.innerHTML = TEXT_APP_TITLE;
    appSubtitle.innerHTML = TEXT_APP_SUBTITLE;
  } else if (type === "end") {
    appTitle.style.display = "block";
    appSubtitle.style.display = "block";
    appTitle.innerHTML = TEXT_APP_END_TITLE;
    appSubtitle.innerHTML = TEXT_APP_END_SUBTITLE;
  }
};

const updateScore = (score) => {
  appScore.innerHTML = score;
};

const checkDead = () => {
  checkDeadInterval = setInterval(() => {
    const runnerBottom = parseInt(
      window.getComputedStyle(runner).getPropertyValue("bottom")
    );
    const obstacleLeft = parseInt(
      window.getComputedStyle(obstacle).getPropertyValue("left")
    );
    if (obstacleLeft < 16 && obstacleLeft > 0 && runnerBottom < 120) {
      stopGame();
      setAppMessage("end");
    }
  }, 15);
};

const init = () => {
  document.addEventListener("keydown", startOnKeyPress);
};

const stopGame = () => {
  obstacle.classList.remove("is-sliding");
  observer.unobserve(obstacle);
  clearInterval(checkDeadInterval);
  init();
};

const startGame = () => {
  document.removeEventListener("keydown", startOnKeyPress);
  score = 0;
  updateScore(score);
  obstacle.style.right = "0px";

  setAppMessage("start");

  obstacle.classList.add("is-sliding");

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      if (!runner.classList.contains("is-jumping")) {
        runner.classList.add("is-jumping");
        setTimeout(() => {
          runner.classList.remove("is-jumping");
        }, 500);
      }
    }
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        score += 1;
        updateScore(score);
      }
    });
  },
  { threshold: 0.5 }
);

init();
