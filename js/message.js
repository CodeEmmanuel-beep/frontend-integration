let currentPage = 1;
let max = 1;
function messaging(text, type = "info") {
  const show = document.getElementById("message");
  console.log("show", show);
  show.textContent = text;
  show.classList.add(type);
  show.classList.remove("hidden");
}
async function chat_center(page) {
  const token = localStorage.getItem("access_token");
  const params = new URLSearchParams(window.location.search);
  receiver = params.get("name");
  if (receiver) {
  }
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/message/view_one?receiver=${encodeURIComponent(
        receiver
      )}&page=${page}&limit=5`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const str = document.getElementById("strings");
    str.innerHTML = "";
    if (res.ok) {
      const text = await res.json();
      console.log("text", text);
      const pagination = text.data?.pagination || [];
      max = Math.ceil(pagination.total / pagination.limit);
      const data = text.data?.conversations || [];
      console.log("data", data);
      if (data.length == 0) {
        str.innerHTML = "No messages";
      } else {
        for (const [conv_id, messages] of Object.entries(data))
          messages.forEach((msg) => {
            const con = document.createElement("div");
            con.className = "layout";
            const rec = document.createElement("p");
            rec.className = "rec";
            rec.textContent = msg.username;
            const user = document.createElement("p");
            user.style.display = "none";
            user.textContent = msg.receiver;
            console.log("user", user);
            const time = document.createElement("span");
            time.className = "time";
            time.textContent = msg.time_of_chat;
            const message = document.createElement("p");
            message.className = "msg";
            message.textContent = msg.message;
            const pic = document.createElement("div");
            pic.className = "pic";
            if (msg.pics) {
              const img = document.createElement("img");
              img.src = msg.pics.startsWith("http")
                ? msg.pics
                : `http://127.0.0.1:8000${msg.pics}`;
              img.style.height = "300px";
              img.style.width = "300px";
              pic.appendChild(img);
            }
            const del = document.createElement("span");
            del.className = "del";
            del.textContent = msg.delivered;
            con.appendChild(rec);
            con.appendChild(time);
            con.appendChild(message);
            con.appendChild(pic);
            con.appendChild(del);
            con.appendChild(user);
            str.appendChild(con);
          });
      }
    } else {
      const error = await res.json();
      messaging(
        "could not load messages, " + (error.detail || error.message),
        "error"
      );
      console.error("error", error);
    }
  } catch (err) {
    messaging("Network glitch, check your connection and try again");
    console.error(err);
  }
}
const next = document.getElementById("next");
const prev = document.getElementById("prev");
next.addEventListener("click", () => {
  if (currentPage < max) {
    currentPage++;
    messaging("next page", "success");
    chat_center(currentPage);
  } else {
    messaging("last page", "error");
  }
});
prev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    messaging("prev page", "success");
    chat_center(currentPage);
  } else {
    messaging("first page", "error");
  }
});
chat_center(currentPage);

document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  async function chadem() {
    const token = localStorage.getItem("access_token");
    chat.addEventListener("submit", async (e) => {
      e.preventDefault();
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
          `http://127.0.0.1:8000/message/send?receiver=${encodeURIComponent(
            receiver
          )}&message=${encodeURIComponent(
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
        console.log("username", receiver);
        if (res.ok) {
          showMessage("message sent", "success");
          window.location.reload();
        } else {
          const error = await res.json();
          console.log("error", error);
          showMessage(
            "could not set message: " + (error.detail || error.message),
            "error"
          );
          console.error("error", error);
        }
      } catch (err) {
        showMessage("Network error, check your connections", "info");
        console.error(err);
      }
    });
  }
  chadem();
});
