document.addEventListener("DOMContentLoaded", () => {
  console.log("Profile script loaded");
  token = localStorage.getItem("access_token");
  params = new URLSearchParams(window.location.search);
  console.log("Full search string:", window.location.search);
  username = params.get("name");
  console.log("name", username);
  if (username) {
    fetch(
      `http://127.0.0.1:8000/info/searchs?name=${encodeURIComponent(username)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((trick) => {
        const user = trick.user?.items?.[0];
        console.log("result", user);
        baseUrl = "http://127.0.0.1:8000";
        document.getElementById("foto").src = baseUrl + user.profile_picture;
        console.log("result", user.profile_picture);
        console.log("result", baseUrl);
        document.getElementById("fotolink").href =
          baseUrl + user.profile_picture;
        document.getElementById("name").textContent = user.name;
        console.log("result", user.name);
        document.getElementById("user").textContent = user.username;
        document.getElementById("email").textContent = user.email;
        document.getElementById("nation").textContent = user.nationality;
        const post = document.getElementById("post");
        post.innerHTML = "";
        const blogs = trick.blogs?.items || [];
        console.log("blog", blogs);
        if (blogs.length == 0) {
          post.innerHTML = "CLEAN TIMELINE";
        } else {
          function merge(parent, key, value) {
            const row = document.createElement("div");
            row.textContent = `${key}: ${value}`;
            parent.appendChild(row);
          }
          blogs.forEach((blog) => {
            const li = document.createElement("li");
            li.style.marginBottom = "20px";
            li.style.padding = "10px";
            li.style.border = "1px solid #ccc";
            li.style.borderRadius = "10px";
            li.style.listStyle = "none";
            li.style.background = "blue";
            li.style.maxwidth = "700px";
            li.style.margin = "10px auto";
            li.style.color = "white";
            merge(li, "Title", blog.title);
            merge(li, "Content", blog.content);
            merge(li, "Reactions", blog.reaction);
            merge(li, "Comment_count", blog.comments_count);
            merge(li, "React", blog.reacts_count);
            merge(li, "Comments", blog.comments);
            merge(li, "Created_at", blog.time_of_post);
            post.appendChild(li);
          });
        }
      });
  }
});
const chatbtn = document.getElementById("chatbtn");
const chat = document.getElementById("chat");
chatbtn.addEventListener("click", () => {
  chat.classList.toggle("hidden");
  chatbtn.classList.toggle("active");
});
document.addEventListener("DOMContentLoaded", () => {
  {
    async function chatter() {
      chat.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = new FormData();
        function showMessage(text, type = "info") {
          const show = document.getElementById("message");
          show.textContent = text;
          show.className = "message";
          show.classList.remove("hidden");
          show.classList.add(type);
        }
        const save = new FormData();
        const file = document.getElementById("chatpic");
        if (file.files.length > 0) {
          save.append("pics", file.files[0]);
        }
        try {
          const res = await fetch(
            `http://127.0.0.1:8000/message/send?receiver=${username}&message=${encodeURIComponent(
              document.getElementById("chatbox").value
            )}`,

            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: save,
            }
          );
          console.log("username", username);
          if (res.ok) {
            showMessage("message sent", "success");
            window.location.href = "messaging_center.html";
          } else {
            const error = await res.json();
            showMessage(
              "could not set message: " + (error.detail || error.message),
              "error"
            );
            console.error("error", error);
          }
        } catch (err) {
          showMessage("Network error, check your connections", "warning");
          console.error(err);
        }
      });
    }
    chatter();
  }
});
