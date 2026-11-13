(function () {
  "use strict";

  var boton = document.querySelector(".menu-btn");
  var menu = document.getElementById("menu");
  if (boton && menu) {
    var cerrar = function () {
      boton.setAttribute("aria-expanded", "false");
      menu.classList.remove("abierto");
    };
    boton.addEventListener("click", function () {
      var abierto = boton.getAttribute("aria-expanded") === "true";
      boton.setAttribute("aria-expanded", String(!abierto));
      menu.classList.toggle("abierto", !abierto);
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) cerrar();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") cerrar();
    });
  }

  var form = document.getElementById("form-contacto");
  if (!form) return;
  var d = form.dataset;
  var enviar = form.querySelector('button[type="submit"]');
  var textoBoton = enviar.textContent;
  var estado = form.querySelector(".form-estado");
  var tocados = {};
  var reglas = {
    nombre: function (v) { return v.trim().length >= 2 ? "" : d.tENombre; },
    contacto: function (v) {
      v = v.trim();
      if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return "";
      return v.replace(/\D/g, "").length >= 7 && v.indexOf("@") < 0 ? "" : d.tEContacto;
    },
    mensaje: function (v) { return v.trim().length >= 10 ? "" : d.tEMensaje; }
  };

  function revisar(todos) {
    var valido = true;
    Object.keys(reglas).forEach(function (nombre) {
      var campo = form.elements[nombre];
      var error = reglas[nombre](campo.value);
      if (error) valido = false;
      if (todos || tocados[nombre]) {
        document.getElementById("e-" + nombre).textContent = error;
        campo.setAttribute("aria-invalid", error ? "true" : "false");
      }
    });
    enviar.disabled = !valido;
    return valido;
  }

  function ponerEstado(texto, tipo, enlace) {
    estado.textContent = texto;
    estado.className = "form-estado " + (tipo || "");
    if (enlace) {
      var a = document.createElement("a");
      a.href = enlace.href;
      a.textContent = " " + enlace.texto;
      if (enlace.href.indexOf("http") === 0) { a.target = "_blank"; a.rel = "noopener"; }
      estado.appendChild(a);
    }
  }

  function mensajeDe(datos) {
    var partes = ["Hola, soy " + datos.nombre + "."];
    if (datos.interes) partes.push("Me interesa: " + datos.interes + ".");
    partes.push(datos.mensaje);
    partes.push("Mi contacto: " + datos.contacto);
    return partes.join("\n");
  }

  function canalDirecto(datos) {
    var texto = mensajeDe(datos);
    if (d.whatsapp) return { href: "https://wa.me/" + d.whatsapp + "?text=" + encodeURIComponent(texto), texto: "WhatsApp" };
    if (d.email) return { href: "mailto:" + d.email + "?subject=" + encodeURIComponent(document.title) + "&body=" + encodeURIComponent(texto), texto: d.email };
    return null;
  }

  ["nombre", "contacto", "mensaje"].forEach(function (nombre) {
    var campo = form.elements[nombre];
    campo.addEventListener("input", function () { revisar(false); });
    campo.addEventListener("blur", function () { tocados[nombre] = true; revisar(false); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!revisar(true)) return;
    var datos = {
      nombre: form.elements.nombre.value.trim(),
      contacto: form.elements.contacto.value.trim(),
      mensaje: form.elements.mensaje.value.trim(),
      interes: form.elements.interes ? form.elements.interes.value : "",
      web: form.elements.web.value
    };

    if (!d.endpoint) {
      var canal = canalDirecto(datos);
      if (!canal) return;
      if (canal.href.indexOf("http") === 0) window.open(canal.href, "_blank", "noopener");
      else window.location.href = canal.href;
      ponerEstado(d.tAbierto, "ok");
      return;
    }

    enviar.disabled = true;
    enviar.textContent = d.tFEnviando;
    ponerEstado("", "");
    fetch(d.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        form.reset();
        tocados = {};
        ["nombre", "contacto", "mensaje"].forEach(function (n) {
          document.getElementById("e-" + n).textContent = "";
          form.elements[n].removeAttribute("aria-invalid");
        });
        ponerEstado(d.tOk, "ok");
      })
      .catch(function () {
        ponerEstado(d.tFallo, "error", canalDirecto(datos));
      })
      .then(function () {
        enviar.textContent = textoBoton;
        revisar(false);
      });
  });

  revisar(false);
})();
