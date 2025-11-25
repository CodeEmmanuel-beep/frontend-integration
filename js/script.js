document.querySelectorAll(".auth-tabs button").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.add("active");
  });
});
const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const getStarted = document.getElementById("getStarted");
const auth = document.getElementById("auth");
getStarted.addEventListener("click", () => {
  console.log("get started");
  auth.scrollIntoView();
});
showLogin.addEventListener("click", () => {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  showLogin.classList.add("active");
  showRegister.classList.remove("active");
});
showRegister.addEventListener("click", () => {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  showRegister.classList.add("active");
  showLogin.classList.remove("active");
});
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const today = new Date();
  const dob = new Date(document.getElementById("dob").value);
  let age = today.getFullYear() - dob.getFullYear();
  const month = today.getMonth() - dob.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  const data = new FormData();
  data.append("name", document.getElementById("fullname").value);
  data.append("username", document.getElementById("username").value);
  data.append("email", document.getElementById("email").value);
  data.append("nationality", document.getElementById("nationality").value);
  data.append("age", parseFloat(age));
  data.append("phone_number", document.getElementById("phone"));
  data.append("address", document.getElementById("add"));
  data.append("password", document.getElementById("password").value);
  data.append(
    "confirm_password",
    document.getElementById("confirm_password").value
  );
  const file = document.getElementById("profile_picture");
  if (file.files.length > 0) {
    data.append("profile_picture", file.files[0]);
  }
  try {
    const res = await fetch("http://127.0.0.1:8000/auth/registeration", {
      method: "POST",
      body: data,
    });
    function message(text, type = "info") {
      const show = document.getElementById("message");
      show.textContent = text;
      show.className = "message";
      show.classList.add(type);
      show.classList.remove("hidden");
    }
    const result = await res.json();
    if (res.ok) {
      message("Registeration successful. Please login to continue");
      registerForm.reset();
    } else {
      message("Registeration failed: " + (result.detail || result.message));
      console.error(result);
    }
  } catch (err) {
    message("Netwrok error, please check your connection.");
  }
});
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    username: document.getElementById("lusername").value,
    password: document.getElementById("lpassword").value,
  };
  try {
    const res = await fetch("http://127.0.0.1:8000/auth/logins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    function cool(text, type = "info") {
      show = document.getElementById("message");
      (show.textContent = text),
        (show.className = "message"),
        show.classList.add(type),
        show.classList.remove("hidden");
    }
    if (res.ok) {
      const result = await res.json();
      const username = result.data?.username || result.username;
      const accessToken = result.data?.access_token || result.access_token;

      if (username && accessToken) {
        localStorage.setItem("username", username);
        localStorage.setItem("access_token", accessToken);
        console.log("Username stored in localStorage:", username);
        cool("Login successful!", "success");
      }
      cool("login successful!", "success");

      window.location.href = "dashboard.html";
    } else {
      const error = await res.json();
      console.error("Login error response:", error);
      cool("error: " + (error.detail || error.message));
    }
  } catch (err) {
    console.error("network error", err);
    cool("Network error, can you please check your connection.");
  }
});

async function auto_refresh() {
  try {
    const res = await fetch("http://localhost:8000/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      console.log("New access token:", data.access_token);
      localStorage.setItem("access_token", data.access_token);
    } else {
      const error = await res.json();
      alert("access token expired, please refresh"),
        console.error("error " + (error.detail || error.message));
    }
  } catch (err) {
    alert("Network glitch"), console.error(err);
  }
}

auto_refresh();
