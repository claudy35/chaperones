
  const links = document.querySelectorAll('.nav-items a');
  const currentPath = window.location.pathname;

  links.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });


  const hamburger = document.getElementById("hamburger");
  const navItems = document.getElementById("nav-items");
  const closeBtn = document.getElementById("close-btn");
  const overlay = document.getElementById("overlay");

  hamburger.addEventListener("click", () => {
    navItems.classList.add("open");
    overlay.classList.add("show");
  });

  closeBtn.addEventListener("click", () => {
    navItems.classList.remove("open");
    overlay.classList.remove("show");
  });

  overlay.addEventListener("click", () => {
    navItems.classList.remove("open");
    overlay.classList.remove("show");
  });







  // ====== CONFIGURE THESE THREE VALUES ======
    const NGO_NAME = "Your NGO";
    const PAYPAL_DONATE_BASE =
      // Replace with your actual hosted button link from PayPal:
      // e.g., "https://www.paypal.com/donate?hosted_button_id=ABCDEFG12345"
      "https://www.paypal.com/donate?hosted_button_id=REPLACE_WITH_YOUR_ID";
    const MPESA_NUMBER = "+254720000000"; // Replace with your active M-Pesa number
    // =========================================

    // Elements
    const amountEl = document.getElementById("amount");
    const nameEl   = document.getElementById("donorName");
    const emailEl  = document.getElementById("email");
    const panels   = {
      paypal:  document.getElementById("paypalPanel"),
      mpesa:   document.getElementById("mpesaPanel"),
      cashapp: document.getElementById("cashappPanel")
    };
    const paypalBtn = document.getElementById("paypalBtn");
    const previewLinkBtn = document.getElementById("previewLink");
    const mpesaNumberEl = document.getElementById("mpesaNumber");
    const copyBtn = document.getElementById("copyMpesa");
    const copyStatus = document.getElementById("copyStatus");
    const emailAck = document.getElementById("emailAck");

    document.getElementById("year").textContent = new Date().getFullYear();
    mpesaNumberEl.textContent = MPESA_NUMBER;

    // Show/hide panels by payment method
    document.querySelectorAll('input[name="pm"]').forEach(r => {
      r.addEventListener("change", () => {
        const val = r.value;
        for (const k in panels) panels[k].hidden = (k !== val);
        syncCTAs();
      });
    });

    // Build PayPal donate link with amount + (optional) donor name
    function buildPayPalUrl() {
      const amount = parseFloat(amountEl.value || "0");
      if (!amount || amount < 1) return "#";
      const params = new URLSearchParams();
      params.set("amount", amount.toFixed(2));
      // Adjust currency here if needed (e.g., "USD"). PayPal may convert automatically.
      params.set("currency_code", "USD");
      // Some PayPal buttons support custom fields; if yours does, you can pass a memo:
      const memo = nameEl.value ? `Donation from ${nameEl.value}` : "Donation";
      params.set("message", memo);
      return PAYPAL_DONATE_BASE + "&" + params.toString();
    }

    function syncCTAs() {
      // Update PayPal CTA state
      const valid = parseFloat(amountEl.value || "0") >= 1;
      paypalBtn.href = buildPayPalUrl();
      paypalBtn.disabled = !valid;
      previewLinkBtn.disabled = !valid;

      // Update optional email acknowledgement link for M-Pesa
      const subject = encodeURIComponent(`${NGO_NAME} Donation Receipt`);
      const donor = nameEl.value ? nameEl.value : "Donor";
      const body = encodeURIComponent(
        `Hello ${NGO_NAME} Team,\n\nI just donated via M-Pesa.\n\nAmount: KES ${amountEl.value || "____"}\nSender: ${donor}\nM-Pesa Number Used: ${MPESA_NUMBER}\n\nPlease acknowledge this contribution. Thank you.\n`
      );
      emailAck.href = `mailto:${emailEl.value || ""}?subject=${subject}&body=${body}`;
    }

    amountEl.addEventListener("input", syncCTAs);
    nameEl.addEventListener("input", syncCTAs);
    emailEl.addEventListener("input", syncCTAs);

    previewLinkBtn.addEventListener("click", () => {
      const url = buildPayPalUrl();
      if (url === "#") {
        alert("Enter a valid amount (minimum 1).");
      } else {
        prompt("Copy your PayPal donation URL:", url);
      }
    });

    copyBtn.addEventListener("click", async () => {
      const text = MPESA_NUMBER;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback
          const t = document.createElement("textarea");
          t.value = text; document.body.appendChild(t);
          t.select(); document.execCommand("copy"); document.body.removeChild(t);
        }
        copyStatus.textContent = "M-Pesa number copied.";
        setTimeout(() => copyStatus.textContent = "", 2500);
      } catch (e) {
        alert("Copy failed. Please copy the number manually.");
      }
    });

    // Init
    syncCTAs();