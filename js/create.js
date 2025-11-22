const token = localStorage.getItem("access_token");
if (!token) {
  alert("invalid access");
}
const createTarget = document.getElementById("createTarget");
createTarget.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const data = {
      target: document.getElementById("cTarget").value,
      amount_required_to_hit_target: parseFloat(
        document.getElementById("artht").value
      ),
      days_to_target: parseFloat(document.getElementById("dtt").value),
      monthly_income: parseFloat(document.getElementById("mi").value),
      amount_saved: parseFloat(document.getElementById("as").value) || 0,
    };
    const res = await fetch("http://localhost:8000/plot/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    function message(text, type = "info") {
      const show = document.getElementById("message");
      show.textContent = text;
      show.className = "message";
      show.classList.add(type);
      show.classList.remove("hidden");
    }
    if (res.ok) {
      message(
        "Target created successfully, now its time to hit the target!",
        "success"
      );
      createTarget.reset();
    } else {
      const result = await res.json();
      message("Could not set target, please try again", "error");
      console.error(result);
    }
  } catch (err) {
    message("Network error, please try again", "error");
  }
});
