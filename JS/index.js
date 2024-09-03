// DOM element references
const fromCurrencySelect = document.querySelector(".from select");
const toCurrencySelect = document.querySelector(".to select");
const getRateButton = document.querySelector("form button");
const exchangeIcon = document.querySelector("form .reverse");
const amountInput = document.querySelector("form input");
const exchangeRateText = document.querySelector("form .result");

// Initialize currency dropdowns
function initializeCurrencySelects() {
    [fromCurrencySelect, toCurrencySelect].forEach((select, index) => {
        Object.keys(Country_List).forEach(currencyCode => {
            const isSelected = (index === 0 && currencyCode === "USD") || (index === 1 && currencyCode === "GBP");
            const option = `<option value="${currencyCode}" ${isSelected ? "selected" : ""}>${currencyCode}</option>`;
            select.insertAdjacentHTML("beforeend", option);
        });

        select.addEventListener("change", handleCurrencyChange);
    });
}

// Handle currency change
function handleCurrencyChange(event) {
    const select = event.target;
    const currencyCode = select.value;
    const flagImage = select.parentElement.querySelector("img");
    flagImage.src = `https://flagcdn.com/48x36/${Country_List[currencyCode].toLowerCase()}.png`;
}

// Fetch and display exchange rate
async function fetchExchangeRate() {
    const amount = parseFloat(amountInput.value) || 1;
    const apiKey = "c98d9a1cf1f842a241a4e0c0";
    exchangeRateText.innerText = "Getting exchange rate...";

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrencySelect.value}`);
        const data = await response.json();
        const exchangeRate = data.conversion_rates[toCurrencySelect.value];
        const convertedAmount = (amount * exchangeRate).toFixed(2);
        exchangeRateText.innerText = `${amount} ${fromCurrencySelect.value} = ${convertedAmount} ${toCurrencySelect.value}`;
    } catch (error) {
        exchangeRateText.innerText = "Something went wrong...";
        console.error("Error fetching exchange rate:", error);
    }
}

// Swap currencies
function swapCurrencies() {
    [fromCurrencySelect.value, toCurrencySelect.value] = [toCurrencySelect.value, fromCurrencySelect.value];
    [fromCurrencySelect, toCurrencySelect].forEach(select => {
        const currencyCode = select.value;
        const flagImage = select.parentElement.querySelector("img");
        flagImage.src = `https://flagcdn.com/48x36/${Country_List[currencyCode].toLowerCase()}.png`;
    });
    fetchExchangeRate();
}

// Event listeners
window.addEventListener("load", () => {
    initializeCurrencySelects();
    fetchExchangeRate();
});

getRateButton.addEventListener("click", event => {
    event.preventDefault();
    fetchExchangeRate();
});

exchangeIcon.addEventListener("click", swapCurrencies);
