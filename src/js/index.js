const searchInput = document.querySelector("#search");
const tableBody = document.querySelector("#table__body");
const trTableBody = document.querySelector("#trTableBody");
const showTransactionBTN = document.querySelector("#show__transactionBTN");
const showTransactionBOX = document.querySelector("#show__transactionBOX");
const showTransaction = document.querySelector("#show__transactionBTN");
const mainTableBox = document.querySelector("#main__box");
const iconDate = document.querySelector(".icon-date-reverse");
const iconPrice = document.querySelector(".icon-price-reverse");

//* flip icon and loop sorted
let isPriceSortedAsc = true;
let isDateSortedAsc = true;

//* inline and hidden button for show table
showTransactionBTN.addEventListener("click", () => {
  showTransactionBOX.style.display = "none";
  mainTableBox.style.display = "inline";
});

//* date Config
const options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

let allTransactionData = [];
const filters = {
  searchItems: "",
};

document.addEventListener("DOMContentLoaded", () => {
  axios
    .get("http://localhost:3000/transactions")
    .then((Response) => {
      allTransactionData = Response.data;
      //* show item in the DOM
      renderTransaction(allTransactionData, filters);
    })
    .catch((Error) => console.log("Error fetching data:", Error));
});

//* Search and forEach the Show in DOM
function renderTransaction(_transaction, _filter) {
  const filteredTransaction = _transaction.filter((item) => {
    const refId = String(item.refId);
    return refId.includes(_filter.searchItems.toLowerCase());
  });

  //* Clear the existing table body content
  tableBody.innerHTML = "";

  //* Upload Item Filtered in DOM
  filteredTransaction.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
              <td class="p-4">
                <p class="text-sm">${item.id}</p>
              </td>
              <td class="p-4">
                <p class="text-sm text-slate-700">${item.type}</p>
              </td>
              <td class="p-4">
                <p class="text-sm">${item.price}</p>
              </td>
              <td class="p-4">
                <p class="text-sm">${item.refId}</p>
              </td>
              <td class="p-4">
                <p class="">${new Date(item.date).toLocaleDateString(
                  "fa-IR",
                  options
                )}</p>
              </td>
    `;
    tableBody.appendChild(tr);
  });
}
searchInput.addEventListener("input", (event) => {
  filters.searchItems = event.target.value;
  renderTransaction(allTransactionData, filters);
});

//* sort by date
function sortByDate(transactions, ascending = true) {
  return transactions.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return ascending ? dateA - dateB : dateB - dateA;
  });
}
iconDate.addEventListener("click", () => {
  const sortedTransactions = sortByDate(allTransactionData, isDateSortedAsc);
  renderTransaction(sortedTransactions, filters);
  isDateSortedAsc = !isDateSortedAsc; // تغییر وضعیت مرتب‌سازی
  iconDate.style.transform = isDateSortedAsc
    ? "rotate(0deg)"
    : "rotate(180deg)";
  iconDate.style.transition = "all 800ms";
});

//* sort by price
function sortByPrice(transactions, ascending = true) {
  return transactions.sort((a, b) => {
    return ascending ? a.price - b.price : b.price - a.price;
  });
}
iconPrice.addEventListener("click", () => {
  const sortedTransactions = sortByPrice(allTransactionData, isPriceSortedAsc);
  renderTransaction(sortedTransactions, filters);
  isPriceSortedAsc = !isPriceSortedAsc; // تغییر وضعیت مرتب‌سازی
  iconPrice.style.transform = isPriceSortedAsc
    ? "rotate(0deg)"
    : "rotate(180deg)";
  iconPrice.style.transition = "all 800ms";
});
