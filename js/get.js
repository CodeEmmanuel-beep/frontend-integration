const token = localStorage.getItem("access_token");
const view = document.getElementById("vt");
const list = document.getElementById("list");
const list_c = document.getElementById("list_c");
const list_u = document.getElementById("list_u");
const complete = document.getElementById("view_c");
const incomplete = document.getElementById("view_u");
const list_o = document.getElementById("list_o");
const one = document.getElementById("view_o");
const expire = document.getElementById("view_e");
const ex = document.getElementById("list_e");

complete.addEventListener("click", () => {
  list_c.classList.remove("hidden");
  list.classList.add("hidden");
  ex.classList.add("hidden");
  list_u.classList.add("hidden");
  list_o.classList.add("hidden");
  complete.classList.add("active");
  one.classList.remove("active");
  expire.classList.remove("active");
  view.classList.remove("active");
  incomplete.classList.remove("active");
});
view.addEventListener("click", () => {
  list_c.classList.add("hidden");
  list.classList.remove("hidden");
  ex.classList.add("hidden");
  list_o.classList.add("hidden");
  list_u.classList.add("hidden");
  complete.classList.remove("active");
  one.classList.remove("active");
  expire.classList.remove("active");
  view.classList.add("active");
  incomplete.classList.remove("active");
});
incomplete.addEventListener("click", () => {
  list_c.classList.add("hidden");
  list.classList.add("hidden");
  ex.classList.add("hidden");
  list_o.classList.add("hidden");
  list_u.classList.remove("hidden");
  complete.classList.remove("active");
  one.classList.remove("active");
  expire.classList.remove("active");
  view.classList.remove("active");
  incomplete.classList.add("active");
});
one.addEventListener("click", () => {
  list_c.classList.add("hidden");
  list.classList.add("hidden");
  ex.classList.add("hidden");
  list_o.classList.remove("hidden");
  list_u.classList.add("hidden");
  complete.classList.remove("active");
  one.classList.add("active");
  expire.classList.remove("active");
  view.classList.remove("active");
  incomplete.classList.remove("active");
});
expire.addEventListener("click", () => {
  list_c.classList.add("hidden");
  list.classList.add("hidden");
  ex.classList.remove("hidden");
  list_o.classList.add("hidden");
  list_u.classList.add("hidden");
  complete.classList.remove("active");
  one.classList.remove("active");
  expire.classList.add("active");
  view.classList.remove("active");
  incomplete.classList.remove("active");
});
view.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:8000/plot/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = document.getElementById("list");
    data.innerHTML = "";
    if (res.ok) {
      const server = await res.json();
      const task = server.data?.items || [];
      console.log("check: " + task);
      if (task.length == 0) {
        data.innerHTML = "No Targets Set Yet";
      } else {
        async function addline(parent, label, value) {
          const div = document.createElement("div");
          div.textContent = `${label}: ${value}`;
          parent.appendChild(div);
        }

        task.forEach((targets) => {
          const li = document.createElement("li");
          li.style.marginBottom = "15px";
          addline(li, "ID", targets.id);
          addline(li, "User ID", targets.user_id);
          addline(li, "Target", targets.target);
          addline(li, "Amount Required", targets.amount_required_to_hit_target);
          addline(li, "Days to Target", targets.days_to_target);
          addline(li, "Day Of Target", targets.day_of_target);
          addline(li, "Monthly Income", targets.monthly_income);
          addline(li, "Amount Saved", targets.amount_saved);
          addline(li, "Complete", targets.complete);
          addline(li, "Status", targets.status);
          addline(li, "Created", targets.time_of_initial_prep);
          addline(li, "Days Remaining", targets.days_remaining);
          addline(li, "Daily Required Savings", targets.daily_required_savings);
          console.log("triggered");
          data.appendChild(li);
        });
      }
    } else {
      data.innerHTML = "Could Not Load Target";
    }
  } catch (err) {
    console.error(err);
  }
});

complete.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const comp = await fetch("http://localhost:8000/plot/completed", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const res = document.getElementById("list_c");
    res.innerHTML = "";
    if (comp.ok) {
      const result = await comp.json();
      console.log("completed response:", result);

      const generate = result.data?.items || [];
      if (generate.length == 0) {
        res.innerHTML = "<li>You Have No Completed Targets</li>";
      } else {
        function augument(parent, key, val) {
          const row = document.createElement("div");
          row.textContent = `${key}: ${val}`;
          parent.appendChild(row);
        }
        generate.forEach((completed) => {
          const li = document.createElement("li");
          li.style.marginBottom = "15px";
          augument(li, "ID", completed.id);
          augument(li, "User_ID", completed.user_id);
          augument(li, "Target", completed.target);
          augument(
            li,
            "Amount Required",
            completed.amount_required_to_hit_target
          );
          augument(li, "Days To Target", completed.days_to_target);
          augument(li, "Day Of Target", completed.day_of_target);
          augument(li, "Monthly Income", completed.monthly_income);
          augument(li, "Amount Saved", completed.amount_saved);
          augument(li, "Complete", completed.complete);
          augument(li, "Complete", completed.status);
          augument(li, "Created", completed.time_of_initial_prep);
          augument(li, "Days Remaining", completed.days_remaining);
          augument(
            li,
            "Daily Required Savings",
            completed.daily_required_savings
          );
          res.appendChild(li);
          console.log("appended: " + res);
        });
      }
    } else {
      res.innerHTML = "Could Not Load Completed Targets";
    }
  } catch (err) {
    console.error("network glitch: " + err);
  }
});
incomplete.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    incomp = await fetch("http://localhost:8000/plot/undone", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const res = document.getElementById("list_u");
    res.innerHTML = "";
    if (incomp.ok) {
      const result = await incomp.json();
      console.log("results: " + result);
      const generate = result.data?.items || [];
      if (generate.length == 0) {
        res.innerHTML = "You Have Completed All Your Targets";
      } else {
        function augumented(parent, key, val) {
          const rowed = document.createElement("div");
          rowed.textContent = `${key}: ${val}`;
          parent.appendChild(rowed);
        }
        generate.forEach((undone) => {
          const li = document.createElement("li");
          li.style.marginBottom = "15px";
          augumented(li, "ID", undone.id);
          augumented(li, "User_ID", undone.user_id);
          augumented(li, "Target", undone.target);
          augumented(
            li,
            "Amount Required",
            undone.amount_required_to_hit_target
          );
          augumented(li, "Days To Target", undone.days_to_target);
          augumented(li, "Day Of Target", undone.day_of_target);
          augumented(li, "Monthly Income", undone.monthly_income);
          augumented(li, "Amount Saved", undone.amount_saved);
          augumented(li, "Complete", undone.complete);
          augumented(li, "Complete", undone.status);
          augumented(li, "Created", undone.time_of_initial_prep);
          augumented(li, "Days Remaining", undone.days_remaining);
          augumented(
            li,
            "Daily Required Savings",
            undone.daily_required_savings
          );
          res.appendChild(li);
          console.log("appended: " + res);
        });
      }
    } else {
      res.innerHTML = "Could Not Load Undone Target";
    }
  } catch (err) {
    console.error("network glitch: " + err);
  }
});
one.addEventListener("click", async (e) => {
  e.preventDefault();
  const id = document.getElementById("target_id").value;
  function messaging(text, type = "info") {
    const show = document.getElementById("message");
    show.textContent = text;
    show.className = "message";
    show.classList.add(type);
    show.classList.remove("hidden");
  }

  if (!id) {
    messaging("Please enter a number", "error");
    return;
  }
  try {
    v_one = await fetch(`http://localhost:8000/plot/view_one?task_id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const res = document.getElementById("list_o");
    res.innerHTML = "";
    if (v_one.ok) {
      const result = await v_one.json();
      console.log("results: ", result);
      const item = result.data;
      if (!item) {
        res.innerHTML = "Invalid id";
      } else {
        function augumented(parent, key, val) {
          const rowed = document.createElement("div");
          rowed.textContent = `${key}: ${val}`;
          parent.appendChild(rowed);
        }
        const li = document.createElement("li");
        li.style.marginBottom = "15px";
        augumented(li, "ID", item.id);
        augumented(li, "User_ID", item.user_id);
        augumented(li, "Target", item.target);
        augumented(li, "Amount Required", item.amount_required_to_hit_target);
        augumented(li, "Days To Target", item.days_to_target);
        augumented(li, "Day Of Target", item.day_of_target);
        augumented(li, "Monthly Income", item.monthly_income);
        augumented(li, "Amount Saved", item.amount_saved);
        augumented(li, "Complete", item.complete);
        augumented(li, "Complete", item.status);
        augumented(li, "Created", item.time_of_initial_prep);
        augumented(li, "Days Remaining", item.days_remaining);
        augumented(li, "Daily Required Savings", item.daily_required_savings);
        res.appendChild(li);
        console.log("appended: " + res);
      }
    } else {
      res.innerHTML = "Could Not Load Target";
    }
  } catch (err) {
    console.error("network glitch: " + err);
  }
});
expire.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:8000/plot/expired", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = document.getElementById("list_e");
    data.innerHTML = "";
    if (res.ok) {
      const server = await res.json();
      const task = server.data?.items || [];
      console.log("check: " + task);
      if (task.length == 0) {
        data.innerHTML = "No Expired Target";
      } else {
        async function addline(parent, label, value) {
          const div = document.createElement("div");
          div.textContent = `${label}: ${value}`;
          parent.appendChild(div);
        }

        task.forEach((targets) => {
          const li = document.createElement("li");
          li.style.marginBottom = "15px";
          addline(li, "ID", targets.id);
          addline(li, "User ID", targets.user_id);
          addline(li, "Target", targets.target);
          addline(li, "Amount Required", targets.amount_required_to_hit_target);
          addline(li, "Days to Target", targets.days_to_target);
          addline(li, "Day Of Target", targets.day_of_target);
          addline(li, "Monthly Income", targets.monthly_income);
          addline(li, "Amount Saved", targets.amount_saved);
          addline(li, "Complete", targets.complete);
          addline(li, "Status", targets.status);
          addline(li, "Created", targets.time_of_initial_prep);
          addline(li, "Days Remaining", targets.days_remaining);
          addline(li, "Daily Required Savings", targets.daily_required_savings);
          console.log("triggered");
          data.appendChild(li);
        });
      }
    } else {
      data.innerHTML = "Could Not Load Target";
    }
  } catch (err) {
    console.error(err);
  }
});
