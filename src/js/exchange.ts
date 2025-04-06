import gsap from "gsap";
import { ScrollTrigger, Flip } from "gsap/all";
import Validator from "./classes/Validator";

gsap.registerPlugin(ScrollTrigger, Flip);

export default function exchange() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".exchange")
  );
  elements.forEach((element) => {
    const btns = Array.from(
      element.querySelectorAll<HTMLButtonElement>(".exchange__nav-btn")
    );
    const items = Array.from(
      element.querySelectorAll<HTMLElement>(".exchange__tabs-item")
    );

    const marker = element.querySelector<HTMLElement>(".exchange__nav-marker");
    const nav = element.querySelector<HTMLElement>(".exchange__nav-inner");
    const forms = Array.from(
      element.querySelectorAll<HTMLFormElement>(".exchange__form")
    );

    const setActive = (index: number) => {
      const btnState = Flip.getState([marker, nav]);
      btns.forEach((btn) => btn.classList.remove("active"));
      items.forEach((item) => item.classList.remove("active"));
      btns[index]?.classList.add("active");
      items[index]?.classList.add("active");
      Flip.from(btnState, {
        duration: 0.2,
        ease: "none",
      });
    };

    setActive(0);

    btns.forEach((btn, btnIndex) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        setActive(btnIndex);
      });
    });

    forms.forEach((form) => {
      const currencyInputs = Array.from(
        form.querySelectorAll<HTMLInputElement>(
          ".exchange__form-currency-selector-radio-input"
        )
      );
      const amountInput = form.querySelector<HTMLInputElement>(
        ".exchange__form-currency-field-wrapper .exchange__form-input"
      );

      const rateOutput = form.querySelector(
        ".exchange__calculation-second-currency-rate-text"
      );
      const amountOutput = form.querySelector<HTMLElement>(
        ".exchange__calculation-first-currency-amount"
      );
      const requiredAmountOutput = form.querySelector<HTMLElement>(
        ".exchange__calculation-second-currency-amount"
      );
      const perOneOutput = form.querySelector<HTMLElement>(
        ".exchange__calculation-second-currency-rate-per-one"
      );
      const calculate = () => {
        const selectedCurrency = currencyInputs.find((input) => input.checked);
        if (!selectedCurrency) {
          console.error("Currency not selected");
          return;
        }
        const selectedCurencyValue = selectedCurrency.value
          .trim()
          .toLowerCase();
        if (!selectedCurencyValue) {
          console.error("Not selected currency value");
          return;
        }
        const selectedCurrencyRate = selectedCurrency.getAttribute("data-rate");
        if (!selectedCurrencyRate) {
          console.error("Not specified exchange rate");
          return;
        }
        const amount = amountInput?.value.trim()
          ? Number(amountInput.value.trim())
          : 435;

        const formattedRate = new Intl.NumberFormat("ru-RU", {
          style: "currency",
          currency: "RUB",
        }).format(Number(selectedCurrencyRate));

        if (rateOutput) rateOutput.textContent = formattedRate;
        const formattedAmount = new Intl.NumberFormat("ru-RU", {
          style: "currency",
          currency: selectedCurencyValue.toUpperCase(),
        }).format(Number(amount));
        if (amountOutput) amountOutput.textContent = formattedAmount;

        const requiredAmount = amount * Number(selectedCurrencyRate);
        const formattedRequiredAmount = new Intl.NumberFormat("ru-RU", {
          style: "currency",
          currency: "RUB",
        }).format(requiredAmount);
        if (requiredAmountOutput)
          requiredAmountOutput.textContent = formattedRequiredAmount;
        if (perOneOutput)
          perOneOutput.textContent = new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: selectedCurencyValue.toUpperCase(),
          }).format(1);
      };

      calculate();

      currencyInputs.forEach((input) =>
        input.addEventListener("change", calculate)
      );

      amountInput?.addEventListener("input", calculate);

      const formValidator = new Validator(form);
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        formValidator.validate();
        if (formValidator.valid) {
          const validSubmissionEvent = new CustomEvent("submit:valid");
          form.dispatchEvent(validSubmissionEvent);
        }
      });
    });
  });
}
