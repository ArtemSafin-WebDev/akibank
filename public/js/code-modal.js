document.addEventListener("DOMContentLoaded", () => {
  const codeModal = document.querySelector(".code-modal");
  const mainForm = document.querySelector(".exchange__form");
  if (!codeModal) return;

  const inputFields = Array.from(
    codeModal.querySelectorAll(".code-modal__input")
  );
  const statusElement = codeModal.querySelector(".code-modal__status");
  let pin = "";
  console.log("hello");
  inputFields[0].focus();
  inputFields.forEach((field, index) => {
    // Handle input event (digit entry)
    field.addEventListener("input", function (e) {
      // Allow only one digit
      if (this.value.length > 1) {
        this.value = this.value.slice(0, 1);
      }

      // Verify input is a digit
      if (!/^\d*$/.test(this.value)) {
        this.value = "";
        return;
      }

      // Move to next field if we have a digit
      if (this.value !== "" && index < inputFields.length - 1) {
        inputFields[index + 1].focus();
      }

      // Check if all fields are filled
      checkPinCompletion();
    });

    // Handle keydown events (for backspace navigation)
    field.addEventListener("keydown", function (e) {
      // Handle backspace
      if (e.key === "Backspace") {
        if (this.value === "" && index > 0) {
          // If current field is empty and not the first field,
          // move to previous field
          inputFields[index - 1].focus();
          // Prevent default to avoid double backspace
          e.preventDefault();
        }
      }
    });

    // Handle paste event
    field.addEventListener("paste", function (e) {
      e.preventDefault();

      // Get pasted content
      const pastedText = (e.clipboardData || window.clipboardData).getData(
        "text"
      );

      // Check if pasted content contains only digits
      if (!/^\d+$/.test(pastedText)) {
        return;
      }

      // Distribute the digits to the fields
      const digits = pastedText.slice(0, inputFields.length).split("");

      digits.forEach((digit, i) => {
        if (i < inputFields.length) {
          inputFields[i].value = digit;
        }
      });

      // Focus the appropriate field after pasting
      if (digits.length < inputFields.length) {
        inputFields[digits.length].focus();
      } else {
        inputFields[inputFields.length - 1].focus();
      }

      checkPinCompletion();
    });

    // For mobile: select all text when focusing an input
    field.addEventListener("focus", function () {
      setTimeout(() => {
        this.select();
      }, 0);
    });
  });

  // Function to check if PIN is complete and gather it
  function checkPinCompletion() {
    let isComplete = true;
    let newPin = "";

    inputFields.forEach((field) => {
      if (field.value === "") {
        isComplete = false;
      }
      newPin += field.value;
    });

    if (isComplete) {
      pin = newPin;
      console.log("PIN completed:", pin);
      //   showStatus("PIN entered successfully: " + pin, "success");

      // You can submit the PIN or perform other actions here
      // For example: submitPin(pin);
    }
  }

  // Function to display status messages
  function showStatus(message, type) {
    statusElement.textContent = message;
    statusElement.className = "code-modal__status " + type;

    // Hide the message after 3 seconds
    setTimeout(() => {
      statusElement.className = "code-modal__status";
    }, 3000);
  }

  // Example function to submit PIN to server (not implemented)
  // function submitPin(pin) {
  //     // Submit the PIN to your server here
  //     fetch('/api/verify-pin', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ pin: pin })
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //         if (data.success) {
  //             showStatus('PIN verified!', 'success');
  //         } else {
  //             showStatus('Invalid PIN. Please try again.', 'error');
  //             resetPinFields();
  //         }
  //     });
  // }

  // Function to reset all PIN fields
  function resetPinFields() {
    inputFields.forEach((field) => {
      field.value = "";
    });
    inputFields[0].focus();
  }

  /*if (mainForm) {
    mainForm.addEventListener("submit:valid", () => {
      codeModal.classList.add("active");
      document.body.classList.add("modal-open");
    });
  }*/
});
