function messaging(text, type = "info") {
  const show = document.getElementById("message");
  show.textContent = text;
  show.className = "message";
  show.classList.add(type);
  show.classList.remove("hidden");
}
const token = localStorage.getItem("access_token");
if (!token) {
  messaging("please login first");
  window.location.href = "index.html";
}
const search = document.getElementById("see");
const searchs = document.getElementById("sea");
search.addEventListener("click", () => {
  searchs.classList.toggle("hidden");
  search.classList.toggle("active");
});
async function fetchProfile() {
  function messaging(text, type = "info") {
    const show = document.getElementById("message");
    show.textContent = text;
    show.className = "message";
    show.classList.remove("error", "success", "info");
    show.classList.add(type);
    show.classList.remove("hidden");
  }
  try {
    const res = await fetch("http://127.0.0.1:8000/info/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const result = await res.json();
      const user = result.user;
      console.log("User object:", user);

      const baseUrl = "http://localhost:8000";
      document.getElementById("userfoto").src = baseUrl + user.profile_picture;
      document.getElementById("userfotoLink").href =
        baseUrl + user.profile_picture;
      console.log("Profile picture URL:", user.profile_picture);
      document.getElementById("userName").textContent = user.name;
      document.getElementById("userUsername").textContent = user.username;
      console.log("username:", user.username);
      document.getElementById("userEmail").textContent = user.email;
      document.getElementById("userMobile").textContent = user.phone_number;
      document.getElementById("userNation").textContent = user.nationality;
      console.log("Nationality:", user.nationality);
      document.getElementById("userAge").textContent = user.age || "-";
      document.getElementById("userAdd").textContent = user.address;
    } else {
      messaging("session expired, please login again.");
      localStorage.removeItem("access_token");
      window.location.href = "index.html";
    }
  } catch (error) {
    messaging("Network error, please check your connection.", "error");
  }
}
const edit = document.getElementById("edit");
const edit_profile = document.getElementById("ed");
edit.addEventListener("click", () => {
  edit_profile.classList.toggle("hidden");
  edit.classList.toggle("active");
});

edit_profile.addEventListener("submit", async (e) => {
  e.preventDefault();
  const today = new Date();
  const dob = new Date(document.getElementById("age").value);
  const month = today.getMonth() - dob.getMonth();
  let age = dob.getFullYear() - today.getFullYear();
  if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  const data = new FormData();
  data.append("name", document.getElementById("name").value);
  data.append("email", document.getElementById("email").value);
  data.append("nationality", document.getElementById("nation").value);
  data.append("age", age);
  data.append("phone_number", document.getElementById("phone").value);
  data.append("address", document.getElementById("add").value);
  const photo = document.getElementById("pp");
  if (photo.files.length > 0) {
    data.append("profile_picture", photo.files[0]);
  }
  function messaging(text, type = "info") {
    const show = document.getElementById("message");
    show.textContent = text;
    show.className = "message";
    show.classList.add(type);
    show.classList.remove("hidden");
  }
  try {
    const res = await fetch("http://127.0.0.1:8000/info/edit_p", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token} `,
      },
      body: data,
    });
    if (res.ok) {
      messaging("Profile Update Successful", "success");
      edit_profile.reset();
    } else {
      const error = await res.json();
      messaging(
        "Could not update profile: ",
        +(error.detail || error.message),
        "error"
      );
    }
  } catch (err) {
    "Network glitch, check your connections and try again", "error" + err;
  }
});
const searches = document.getElementById("sea");
searches.addEventListener("submit", async (e) => {
  e.preventDefault();
  function messaging(text, type = "info") {
    const show = document.getElementById("message");
    show.textContent = text;
    show.className = "message";
    show.classList.remove("error", "success", "info");
    show.classList.add(type);
    show.classList.remove("hidden");
  }
  const data = document.getElementById("rch").value;
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/info/search?name=${encodeURIComponent(data)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const server = document.getElementById("profiles");
    server.innerHTML = "";
    if (res.ok) {
      const result = await res.json();
      console.log("result ", result);
      const prof = result.user?.items || [];
      console.log("result ", prof);
      if (prof.length == 0) {
        server.innerHTML = "no user with that name";
      } else {
        function emma(parent, key, value) {
          if (key === "Profile Picture" && value) {
            const img = document.createElement("img");
            img.src = value.startsWith("http")
              ? value
              : `http://127.0.0.1:8000${value}`;
            img.alt = "Profile Picture";
            img.style.width = "120px";
            img.style.height = "120px";
            img.style.objectFit = "cover";
            img.style.borderRadius = "50%";
            parent.appendChild(img);
          } else {
            const row = document.createElement("div");
            row.textContent = `${key}: ${value}`;
            parent.appendChild(row);
          }
        }

        prof.forEach((profile) => {
          const li = document.createElement("li");
          li.style.marginBottom = "20px";
          li.style.padding = "10px";
          li.style.border = "1px solid #ccc";
          li.style.borderRadius = "10px";
          li.style.listStyle = "none";
          li.style.background = "white";
          emma(li, "Profile Picture", profile.profile_picture);
          emma(li, "Full Name", profile.name);
          const btn = document.createElement("button");
          btn.textContent = "View Profile";
          btn.style.font = "2rem";
          btn.style.background = "blue";
          btn.style.color = "white";
          btn.style.padding = "10px";
          btn.style.marginBottom = "10px";
          btn.addEventListener("click", () => {
            window.location.href = `/html/connect.html?name=${encodeURIComponent(
              profile.username
            )}`;
          });
          li.appendChild(btn);
          server.appendChild(li);
          console.log("server ", server);
        });
      }
    } else {
      const error = await res.json();
      messaging(
        "Could not Load Profiles: " + (error.detail || error.message),
        "error"
      );
      console.error("error " + error);
    }
  } catch (err) {
    messaging(
      "Network error, check your connections and try again " + err,
      "error"
    );
    console.error(err);
  }
});
async function fetchActivities() {
  function messaging(text, type = "info") {
    const show = document.getElementById("message");
    show.textContent = text;
    show.classList.add(type);
    show.classList.remove("hidden");
  }
  try {
    const res = await fetch("http://localhost:8000/activity/recent", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const list = document.getElementById("activityList");
    list.innerHTML = "";
    if (res.ok) {
      const data = await res.json();
      if (data.length == 0) {
        list.innerHTML = "<li>No recent activity</li>";
      } else {
        data.forEach((act) => {
          const li = document.createElement("li");
          li.textContent = `${act.action} - ${new Date(
            act.timestamp
          ).toLocaleString()}`;
          list.appendChild(li);
        });
      }
    } else {
      list.innerHTML = "<li>Could not load activities</li>";
    }
  } catch (err) {
    console.error(err);
  }
}
fetchProfile();
fetchActivities();
