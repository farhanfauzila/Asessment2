class WeatherApp {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.form = document.getElementById("search-form");
    this.cityInput = document.getElementById("city-input");
    this.errorMsg = document.getElementById("error-message");
    this.weatherDisplay = document.getElementById("weather-display");
    this.cityNameEl = document.getElementById("city-name");
    this.tempEl = document.getElementById("temperature");
    this.conditionEl = document.getElementById("condition");
    this.historyList = document.getElementById("history-list");

    this.init();
  }

  init() {
    this.loadHistory();

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const city = this.cityInput.value.trim();
      if (city) this.fetchWeather(city);
    });

    this.historyList.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        this.fetchWeather(e.target.textContent);
      }
    });
  }

  async fetchWeather(city) {
    this.showError("");
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${this.apiKey}&units=metric`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      this.renderWeather(data);
      this.saveHistory(city);
    } catch (err) {
      this.showError(err.message);
    }
  }

  renderWeather(data) {
    this.cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
    this.tempEl.textContent = `🌡️ ${data.main.temp.toFixed(1)}°C`;
    this.conditionEl.textContent = `📝 ${data.weather[0].description}`;
    this.weatherDisplay.classList.remove("hidden");
  }

  showError(message) {
    if (message) {
      this.errorMsg.textContent = message;
      this.errorMsg.classList.remove("hidden");
      this.weatherDisplay.classList.add("hidden");
    } else {
      this.errorMsg.textContent = "";
      this.errorMsg.classList.add("hidden");
    }
  }

  saveHistory(city) {
    let history = JSON.parse(localStorage.getItem("weather_history")) || [];
    history = history.filter((c) => c.toLowerCase() !== city.toLowerCase());
    history.unshift(city);
    if (history.length > 5) history.pop();
    localStorage.setItem("weather_history", JSON.stringify(history));
    this.loadHistory();
  }

  loadHistory() {
    this.historyList.innerHTML = "";
    const history = JSON.parse(localStorage.getItem("weather_history")) || [];
    history.forEach((city) => {
      const li = document.createElement("li");
      li.textContent = city;
      this.historyList.appendChild(li);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Ganti 'YOUR_API_KEY' dengan API key OpenWeatherMap Anda
  new WeatherApp("6a2e2411653209f4ae2bacfce2b9231e");
});
