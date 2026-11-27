/**
 * Stories — the sample conversations the phone mockups play.
 * Each story has a skin (the app it imitates), a header and a list of
 * messages. `in` is the customer, `out` is the assistant, `sys` a system note.
 * People and businesses here are fictional.
 */
window.BRAIN_STORIES = {
  turnos: {
    skin: "whatsapp",
    title: "Taller Norte",
    subtitle: "en línea",
    initials: "TN",
    color: "linear-gradient(135deg,#225DC6,#0098FF)",
    messages: [
      { from: "in", text: "Hola! Quería un turno para el service del auto la semana que viene" },
      { from: "out", text: "¡Hola, Sofía! Tengo estos horarios libres:", options: ["Mar 10:30", "Mié 16:00", "Jue 9:15"] },
      { from: "in", text: "El miércoles a las 16" },
      { from: "out", text: "Listo ✅ Te reservé el miércoles a las 16:00. Te mando la ubicación y un recordatorio el día antes." },
      { from: "sys", text: "Turno agendado · Mié 16:00" }
    ]
  },
  ventas: {
    skin: "instagram",
    title: "Repuestos del Sur",
    subtitle: "repuestos.delsur",
    initials: "RS",
    color: "linear-gradient(135deg,#F58529,#DD2A7B 55%,#8134AF)",
    messages: [
      { from: "in", text: "¿Tienen pastillas de freno para un Gol Trend 2015?" },
      { from: "out", card: { title: "Pastillas delanteras", body: "Compatibles con Gol Trend 2012 a 2018 · En stock" } },
      { from: "out", text: "¿Te armo el presupuesto con envío o retirás?" },
      { from: "in", text: "Con envío a Lanús" },
      { from: "out", text: "Listo, te mando el presupuesto en PDF 📄 Total con envío: $ 48.600. Si lo confirmás, te reservo el stock." },
      { from: "sys", text: "Presupuesto enviado · Ventas" }
    ]
  },
  mesa: {
    skin: "web",
    title: "Administración",
    subtitle: "Respondemos al instante",
    initials: "A",
    url: "administracion.com.ar",
    color: "linear-gradient(135deg,#225DC6,#0098FF)",
    messages: [
      { from: "in", text: "Hola, hay una filtración en el techo del 4° B" },
      { from: "out", text: "Lo registré como caso #4821 en Mantenimiento. ¿Me mandás una foto?" },
      { from: "in", text: "📷 Foto enviada" },
      { from: "out", text: "Gracias. Un técnico pasa mañana entre 9 y 12. Te aviso por acá cada vez que avance." },
      { from: "sys", text: "Caso #4821 · Mantenimiento · Prioridad alta" }
    ]
  },
  llamada: {
    skin: "call",
    title: "Llamada entrante",
    subtitle: "Asistente de voz",
    call: { label: "Asistente de voz", name: "Inmobiliaria Centro", status: "01:24" },
    messages: [
      { from: "in", text: "Quería saber si el sábado atienden" },
      { from: "out", text: "Sí, los sábados atendemos de 9 a 13. ¿Querés que te agende una visita?" },
      { from: "in", text: "Sí, el sábado a las 10" },
      { from: "out", text: "Agendado. Te llega la confirmación por WhatsApp." },
      { from: "sys", text: "Llamada grabada y transcripta" }
    ]
  },
  video: {
    skin: "video",
    title: "Laura · Atención",
    subtitle: "Videollamada · 02:10",
    video: true,
    messages: [
      { from: "sys", text: "Martín pasó del chat a videollamada" },
      { from: "out", text: "¡Hola, Martín! Ya leí tu consulta del chat. Mostrame el equipo así lo vemos juntos." },
      { from: "in", text: "Dale, es este de acá" }
    ]
  }
};
