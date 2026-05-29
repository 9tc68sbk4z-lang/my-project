const form = document.querySelector("#intakeForm");
const summary = document.querySelector("#summary");
const taxCalculator = document.querySelector("#taxCalculator");
const quarterlyProfit = document.querySelector("#quarterlyProfit");
const profitBasedTax = document.querySelector("#profitBasedTax");
const incomeTaxExpenseResult = document.querySelector("#incomeTaxExpenseResult");
const deferredAdjustment = document.querySelector("#deferredAdjustment");
const quarterlyReserve = document.querySelector("#quarterlyReserve");
const generateReport = document.querySelector("#generateReport");
const reportOutput = document.querySelector("#reportOutput");

const appState = {
  clientName: "",
  serviceNeed: "",
  intakeRevenue: 0,
  quarterlyProfit: 0,
  profitBasedTax: 0,
  incomeTaxExpense: 0,
  deferredAdjustment: 0,
  quarterlyReserve: 0,
};

const formatCurrency = (amount) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const clientName = data.get("clientName").trim();
  const serviceNeed = data.get("serviceNeed");
  const revenue = Number(data.get("revenue") || 0);

  const revenueText = revenue > 0
    ? `，月收入约 $${revenue.toLocaleString()}`
    : "";

  appState.clientName = clientName;
  appState.serviceNeed = serviceNeed;
  appState.intakeRevenue = revenue;

  summary.textContent = `${clientName} 的主要需求是${serviceNeed}${revenueText}。下一步建议：收集资料并安排一次初步复核。`;
});

taxCalculator.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(taxCalculator);
  const revenue = Number(data.get("quarterlyRevenue") || 0);
  const expenses = Number(data.get("quarterlyExpenses") || 0);
  const rate = Number(data.get("taxRate") || 0) / 100;
  const incomeTaxExpense = Number(data.get("incomeTaxExpense") || 0);
  const deferredTaxAsset = Number(data.get("deferredTaxAsset") || 0);
  const deferredTaxLiability = Number(data.get("deferredTaxLiability") || 0);

  const quarterlyProfitAmount = Math.max(revenue - expenses, 0);
  const profitBasedTaxAmount = quarterlyProfitAmount * rate;
  const deferredAdjustmentAmount = deferredTaxAsset - deferredTaxLiability;
  const quarterlyReserveAmount = Math.max(incomeTaxExpense + deferredAdjustmentAmount, 0);

  appState.quarterlyProfit = quarterlyProfitAmount;
  appState.profitBasedTax = profitBasedTaxAmount;
  appState.incomeTaxExpense = incomeTaxExpense;
  appState.deferredAdjustment = deferredAdjustmentAmount;
  appState.quarterlyReserve = quarterlyReserveAmount;

  quarterlyProfit.textContent = formatCurrency(quarterlyProfitAmount);
  profitBasedTax.textContent = formatCurrency(profitBasedTaxAmount);
  incomeTaxExpenseResult.textContent = formatCurrency(incomeTaxExpense);
  deferredAdjustment.textContent = formatCurrency(deferredAdjustmentAmount);
  quarterlyReserve.textContent = formatCurrency(quarterlyReserveAmount);
});

generateReport.addEventListener("click", () => {
  const clientName = appState.clientName || "未填写客户";
  const serviceNeed = appState.serviceNeed || "未选择服务需求";

  reportOutput.innerHTML = `
    <h3>${clientName} 初步税务服务报告</h3>
    <p>一、客户服务摘要</p>
    <p>${clientName} 当前主要需求为：${serviceNeed}。建议先完成资料清单收集、账务基础复核和税务风险初筛。</p>
    <p>二、季度税款测算摘要</p>
    <p>根据当前输入，本季度利润参考值为 ${formatCurrency(appState.quarterlyProfit)}，利润口径所得税参考值为 ${formatCurrency(appState.profitBasedTax)}。</p>
    <p>本季度所得税费用发生额为 ${formatCurrency(appState.incomeTaxExpense)}，递延税项净调整为 ${formatCurrency(appState.deferredAdjustment)}，本季度建议预留税款为 ${formatCurrency(appState.quarterlyReserve)}。</p>
    <p>三、后续建议</p>
    <p>建议复核所得税费用、递延所得税资产、递延所得税负债的形成原因，并结合企业所得税调整事项表进一步确认应纳税所得额。</p>
  `;
});
