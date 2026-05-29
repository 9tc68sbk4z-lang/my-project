const form = document.querySelector("#intakeForm");
const summary = document.querySelector("#summary");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const clientName = data.get("clientName").trim();
  const serviceNeed = data.get("serviceNeed");
  const revenue = Number(data.get("revenue") || 0);

  const revenueText = revenue > 0
    ? ` with about $${revenue.toLocaleString()} in monthly revenue`
    : "";

  summary.textContent = `${clientName} needs help with ${serviceNeed}${revenueText}. Next step: collect documents and schedule a review.`;
});
