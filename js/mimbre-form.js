/* ==========================================================================
   mimbre · envío del formulario
   --------------------------------------------------------------------------
   Los formularios vienen de una exportación de Webflow: no traen `action` y,
   servidos como sitio estático, recargaban la página y perdían el mensaje.
   Este archivo los intercepta y los manda a Web3Forms, que reenvía el correo
   sin exponer la dirección de destino en el código de la página.

   Para activarlo: pon la clave de acceso en MIMBRE_ACCESS_KEY. Se saca en
   web3forms.com dando un correo; no hace falta cuenta ni contraseña.
   La clave es pública por diseño: identifica al buzón, no da acceso a nada.
   ========================================================================== */
(function () {
  'use strict';

  var MIMBRE_ACCESS_KEY = '';           // <-- aquí va la clave
  var ENDPOINT = 'https://api.web3forms.com/submit';

  function bloqueDe(form) {
    var wrap = form.closest('.w-form') || form.parentElement;
    return {
      done: wrap ? wrap.querySelector('.w-form-done') : null,
      fail: wrap ? wrap.querySelector('.w-form-fail') : null
    };
  }

  function mostrar(el) { if (el) el.style.display = 'block'; }
  function ocultar(el) { if (el) el.style.display = 'none'; }

  function enviar(form, e) {
    e.preventDefault();
    var estado = bloqueDe(form);
    var boton = form.querySelector('[type="submit"]');
    var etiquetaOriginal = boton ? (boton.value || boton.textContent) : null;

    if (!MIMBRE_ACCESS_KEY) {
      ocultar(estado.done);
      mostrar(estado.fail);
      return;
    }

    if (boton) {
      boton.disabled = true;
      if (boton.value !== undefined) { boton.value = boton.dataset.wait || 'Enviando…'; }
      else { boton.textContent = boton.dataset.wait || 'Enviando…'; }
    }

    var datos = new FormData(form);
    datos.append('access_key', MIMBRE_ACCESS_KEY);
    datos.append('subject', 'mimbre.ai · mensaje nuevo desde el sitio');
    datos.append('from_name', 'Sitio de mimbre');

    fetch(ENDPOINT, {
      method: 'POST',
      body: datos,
      headers: { Accept: 'application/json' }
    })
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (r && r.success) {
          form.style.display = 'none';
          ocultar(estado.fail);
          mostrar(estado.done);
        } else {
          throw new Error('respuesta sin éxito');
        }
      })
      .catch(function () {
        ocultar(estado.done);
        mostrar(estado.fail);
      })
      .finally(function () {
        if (boton) {
          boton.disabled = false;
          if (boton.value !== undefined) { boton.value = etiquetaOriginal; }
          else { boton.textContent = etiquetaOriginal; }
        }
      });
  }

  function preparar() {
    var forms = document.querySelectorAll('form.form-contact, form#email-form');
    Array.prototype.forEach.call(forms, function (form) {
      form.setAttribute('method', 'POST');
      form.setAttribute('action', ENDPOINT);
      form.addEventListener('submit', function (e) { enviar(form, e); }, true);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preparar);
  } else {
    preparar();
  }
})();
