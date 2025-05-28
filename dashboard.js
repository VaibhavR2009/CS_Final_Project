import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

import { decryptName, decryptPassword, decryptEmail } from "./encrypt.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBncDHlbS6Fkgevrs2FmfrmJ-DjRaF2keM",
  authDomain: "csfinalproject-70670.firebaseapp.com",
  projectId: "csfinalproject-70670",
  storageBucket: "csfinalproject-70670.firebasestorage.app",
  messagingSenderId: "924015256737",
  appId: "1:924015256737:web:52b80d9e5186362d5f7ce0",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const uid = localStorage.getItem("uid");

function handleSignOut() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("User signed out successfully!");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      localStorage.removeItem("uid");
      window.location.href = "index.html";
    })
    .catch((error) => {
      // An error happened.
      console.error("Error signing out:", error);
      alert("Error signing out.  Error: " + error.message);
    });
}

document.getElementById("logout").addEventListener("click", () => {
  handleSignOut();
});

async function fetchUserData(uid) {
  const reference = ref(db, "users/" + uid + "/");
  try {
    const snapshot = await get(reference);
    if (snapshot.exists()) {
      const encryptedData = snapshot.val();

      const name = await decryptName(encryptedData.name);
      const email = await decryptEmail(encryptedData.email);
      const password = await decryptPassword(encryptedData.password);

      console.log("Decrypted User Info:", { name, email, password });
      return { name, email, password };
    } else {
      console.log("No data found for user:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

fetchUserData(uid).then((userData) => {
  if (userData) {
    document.getElementById("outputEmail").innerText = userData.email;
    document.getElementById("outputName").innerText = userData.name;
    document.getElementById("outputPassword").innerText = userData.password;
  }
});

// Quote functionality
async function fetchQuote() {
  try {
    const quotes = [
      {
        content:
          "The best way to get started is to quit talking and begin doing.",
        author: "Walt Disney",
      },
      {
        content: "Don't let yesterday take up too much of today.",
        author: "Will Rogers",
      },
      {
        content:
          "It's not whether you get knocked down, it's whether you get up.",
        author: "Vince Lombardi",
      },
      {
        content:
          "If you are working on something exciting, it will keep you motivated.",
        author: "Steve Jobs",
      },
      {
        content: "Success is not in what you have, but who you are.",
        author: "Bo Bennett",
      },
      {
        content:
          "Hardships often prepare ordinary people for an extraordinary destiny.",
        author: "C.S. Lewis",
      },
      {
        content:
          "Success usually comes to those who are too busy to be looking for it.",
        author: "Henry David Thoreau",
      },
      {
        content:
          "The harder you work for something, the greater you’ll feel when you achieve it.",
        author: "Anonymous",
      },
      { content: "Dream bigger. Do bigger.", author: "Anonymous" },
      {
        content: "Don’t watch the clock; do what it does. Keep going.",
        author: "Sam Levenson",
      },
    ];
    function getRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      return quotes[randomIndex];
    }

    function displayQuote() {
      const quote = getRandomQuote();
      document.getElementById("quote").textContent = `"${quote.content}"`;
      document.getElementById("author").textContent = `- ${quote.author}`;
    }

    displayQuote();
  } catch (error) {
    document.getElementById("quote").textContent = "Could not load quote.";
    document.getElementById("author").textContent = "";
  }
}

window.toggleDarkMode = function () {
  document.body.classList.toggle("dark-mode");
};

// Fetch quote on load
fetchQuote();

// Weather app
const apiKey = "a927ab1cb1e410621db61301af35c30a";
const url = "https://api.openweathermap.org/data/2.5/weather";

const getWeather = async (zip) => {
  try {
    const response = await fetch(
      `${url}?zip=${zip}&appid=${apiKey}&units=imperial`,
    );
    const data = await response.json();
    if (data.cod === 200) {
      updateWeatherUI(data);
    } else {
      alert("City not found. Please try again.");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

const updateWeatherUI = (data) => {
  const cityName = document.getElementById("city-name");
  const temperature = document.getElementById("temperature");
  const description = document.getElementById("description");
  const windSpeed = document.getElementById("wind-speed");
  const weatherCard = document.querySelector(".weather-card");

  function capitalizeWords(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  temperature.textContent = `${Math.round(data.main.temp)}°`;
  description.textContent = capitalizeWords(data.weather[0].description);
  windSpeed.textContent = `Wind: ${data.wind.speed} mph`;

  // Set background of the weather card based on the weather
  setWeatherCardBackground(data.weather[0].main);
};

const setWeatherCardBackground = (weather) => {
  const weatherCard = document.querySelector(".weather-card");

  // Remove any previous weather class to reset the background
  weatherCard.classList.remove(
    "clear-weather",
    "cloudy-weather",
    "rainy-weather",
    "snowy-weather",
    "default-weather",
  );

  switch (weather.toLowerCase()) {
    case "clear":
      weatherCard.classList.add("clear-weather");
      break;
    case "clouds":
      weatherCard.classList.add("cloudy-weather");
      break;
    case "rain":
      weatherCard.classList.add("rainy-weather");
      break;
    case "snow":
      weatherCard.classList.add("snowy-weather");
      break;
    default:
      weatherCard.classList.add("default-weather");
  }
};

document.getElementById("get-weather-btn").addEventListener("click", () => {
  const zip = document.getElementById("zip-input").value;
  if (zip) {
    getWeather(zip);
  } else {
    alert("Please enter a ZIP code.");
  }
});
