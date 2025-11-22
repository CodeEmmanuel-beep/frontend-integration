const token = localStorage.getItem("access_token");
const save = document.getElementById("add");
const update = document.getElementById("update");
const del = document.getElementById("del");
const amount = document.getElementById("fund");
const up = document.getElementById("up");
const deleted = document.getElementById("deleted");
const mc = document.getElementById("mc");
const mark = document.getElementById("mark");
amount.addEventListener("click", () => {
  save.classList.remove("hidden");
  update.classList.add("hidden");
  mark.classList.add("hidden");
  deleted.classList.add("hidden");
  amount.classList.add("active");
  up.classList.remove("active");
  mc.classList.remove("active");
  del.classList.remove("active");
});
up.addEventListener("click", () => {
  save.classList.add("hidden");
  update.classList.remove("hidden");
  mark.classList.add("hidden");
  deleted.classList.add("hidden");
  amount.classList.remove("active");
  up.classList.add("active");
  mc.classList.remove("active");
  del.classList.remove("active");
});
del.addEventListener("click", () => {
  save.classList.add("hidden");
  update.classList.add("hidden");
  mark.classList.add("hidden");
  deleted.classList.remove("hidden");
  amount.classList.remove("active");
  mc.classList.remove("active");
  up.classList.remove("active");
  del.classList.add("active");
});
mc.addEventListener("click", () => {
  save.classList.add("hidden");
  update.classList.add("hidden");
  mark.classList.remove("hidden");
  deleted.classList.add("hidden");
  amount.classList.remove("active");
  mc.classList.add("active");
  up.classList.remove("active");
  del.classList.remove("active");
});
save.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    task_id: document.getElementById("id").value,
    amount_saved_for_the_day: document.getElementById("amount").value,
  };
  try {
    const res = await fetch(
      `http://localhost:8000/plot/savings?task_id=${data.task_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    function message(text, type = "info") {
      const show = document.getElementById("message");
      show.className = "message";
      show.textContent = text;
      show.classList.add(type);
      show.classList.remove("hidden");
    }
    if (res.ok) {
      const result = await res.json();
      message(
        `You have successfully added: ${data.amount_saved_for_the_day},
              to your savings`,
        "success"
      );
      save.reset();
    } else {
      const error = await res.json();
      message(
        "could not update your savings: " + (error.details || error.message),
        "error"
      );
      console.error("error: " + error);
    }
  } catch (err) {
    message("Network glitch, please check your network and try again");
    console.error("network error", err);
  }
});
update.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    task_id: document.getElementById("id1").value,
    new_target: document.getElementById("targ").value,
    new_days_to_target: parseFloat(document.getElementById("days").value),
    new_amount_required: parseFloat(document.getElementById("sum").value),
  };
  try {
    const res = await fetch(
      `http://localhost:8000/plot/update?task_id=${data.task_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    function message(text, type = "info") {
      const show = document.getElementById("message");
      show.className = "message";
      show.textContent = text;
      show.classList.add(type);
      show.classList.remove("hidden");
    }
    if (res.ok) {
      const result = await res.json();
      message("Target Successfully Updated", "success");
      update.reset();
    } else {
      const error = await res.json();
      message(
        "could not update your target: " + (error.details || error.message),
        "error"
      );
      console.error("error: " + error);
    }
  } catch (err) {
    message("Network glitch, please check your network and try again");
    console.error("network error", err);
  }
});
deleted.addEventListener("submit", async (e) => {
  e.preventDefault();

  const task_id = parseInt(document.getElementById("id2").value);

  try {
    const res = await fetch(
      `http://localhost:8000/plot/erase?task_id=${task_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    function message(text, type = "info") {
      const show = document.getElementById("message");
      show.className = "message";
      show.textContent = text;
      show.classList.add(type);
      show.classList.remove("hidden");
    }
    if (res.ok) {
      message("Target Successfully deleted", "success");
      deleted.reset();
    } else {
      const error = await res.json();
      message(
        "could not delete your target: " + (error.details || error.message),
        "error"
      );
      console.error("error: " + error);
    }
  } catch (err) {
    message("Network glitch, please check your network and try again");
    console.error("network error", err);
  }
});
update.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    task_id: document.getElementById("id1").value,
    new_target: document.getElementById("targ").value,
    new_days_to_target: parseFloat(document.getElementById("days").value),
    new_amount_required: parseFloat(document.getElementById("sum").value),
  };
  try {
    const res = await fetch(
      `http://localhost:8000/plot/update?task_id=${data.task_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    function message(text, type = "info") {
      const show = document.getElementById("message");
      show.className = "message";
      show.textContent = text;
      show.classList.add(type);
      show.classList.remove("hidden");
    }
    if (res.ok) {
      const result = await res.json();
      message("Target Successfully Updated", "success");
      update.reset();
    } else {
      const error = await res.json();
      message(
        "could not update your target: " + (error.details || error.message),
        "error"
      );
      console.error("error: " + error);
    }
  } catch (err) {
    message(
      "Network glitch, please check your network and try again" + err,
      "error"
    );
    console.error("network error", err);
  }
});
mark.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = document.getElementById("id3").value;

  try {
    const res = await fetch(`http://localhost:8000/plot/mark?task_id=${data}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    function message(text, type = "info") {
      const show = document.getElementById("message");
      show.className = "message";
      show.textContent = text;
      show.classList.add(type);
      show.classList.remove("hidden");
    }
    if (res.ok) {
      message("Target Marked Complete", "success");
      mark.reset();
    } else {
      const error = await res.json();
      message(
        "could not Mark Complete : " + (error.details || error.message),
        "error"
      );
      console.error("error: " + error);
    }
  } catch (err) {
    message("Network glitch, please check your network and try again");
    console.error("network error", err);
  }
});
