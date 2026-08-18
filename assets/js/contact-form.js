/**
 * Contact Form - n8n Webhook
 * Envía los datos del formulario al webhook de n8n en formato JSON
 */
(function () {
  "use strict";

  // Producción: workflow "Contacto web brain.com.ar" en n8n
  // (webhook.brain.com.ar → crea la conversación en Chatwoot, inbox "Sitio web").
  const WEBHOOK_URL = "https://webhook.brain.com.ar/webhook/contacto-web";

  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const loadingEl = form.querySelector(".loading");
    const errorEl = form.querySelector(".error-message");
    const sentEl = form.querySelector(".sent-message");

    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const subject = document.getElementById("subjectInput").value.trim();
    const message = document.getElementById("messageInput").value.trim();

    // Ocultar mensajes previos
    loadingEl.classList.remove("d-block");
    errorEl.classList.remove("d-block");
    sentEl.classList.remove("d-block");

    // Mostrar loading
    loadingEl.classList.add("d-block");

    const data = {
      name: name,
      email: email,
      subject: subject,
      message: message,
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      loadingEl.classList.remove("d-block");

      if (response.ok) {
        sentEl.classList.add("d-block");
        form.reset();
      } else {
        errorEl.textContent = "Error al enviar el mensaje.";
        errorEl.classList.add("d-block");
      }
    } catch (error) {
      loadingEl.classList.remove("d-block");
      errorEl.textContent = "Error de conexión.";
      errorEl.classList.add("d-block");
    }
  });
})();
