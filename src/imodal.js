/*
MIT License

Copyright (c) 2024 Bernardo Fuentes @bfuent3s

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const modalInstances = [];
class iModal {
  constructor() {
    // Contenido HTML
    this.html = 
	  	`<div class="modal-header preview-modal">
        <h3>
          <i class="material-icons modal-close close-modal-instance">west</i>
            <span class="title">
            </span>
        </h3>
		  </div>
	    <div style="display: block;">
    		<div class="imodal-spinner"></div>
        <!-- Contenido real aquí -->
        <div>
			</div>
	  `;
    // URL para ajax
    this.actionUri = '';
    // Parámetros para enviar por ajax
    this.dataToSend = '' // Ejemplo: {isin: this.isin};
    // Método predeterminado POST; GET
    this.method = 'POST';
    // Título
    this.title = '';
    // Identificador único para el modal
    this.modalId = '';
    // full o alert
    this.type = 'full';
    // true para habilitar pantalla completa; false para deshabilitar
    this.transparent = false;
    // true para habilitar el botón de más; false para deshabilitar
    this.moreButton = false;

    /** Solo para tipo de modal confirm */
    // Título para alerta
    this.alertTitle = '';
    // Mensaje para el modal de confirmación
    this.message = '';
    // Información adicional para el modal
    this.isin = '';
    // Función de devolución de llamada para modal de confirmación
    this.confirmFuntion = '';
    /** FIN/// Solo para tipo de modal confirm */
    this.transitionDirection = 'right-to-left';
    this.showContentAfterLoad = false;
  }

   /**
   * Muestra el modal.
   * - Crea una instancia modal con las propiedades especificadas.
   * - Establece el título si se proporciona.
   * - Ajusta el z-index basado en las instancias existentes.
   * - Añade la instancia modal al body.
   * - Agrega un nuevo estado al historial del navegador.
   */
  async show() {
    let $modalInstance;

    if (this.transparent) {
      $modalInstance = $('<div class="modal-instance modal-transparent ' + this.type + '"></div>');
    } else {
      $modalInstance = $('<div class="modal-instance ' + this.type + '"></div>');
    }

    $modalInstance.html(this.html);

    var currentInstance = $(".modal-instance").length;
    var result = 1000 + currentInstance;
    $modalInstance.css('z-index', result);

    if (this.title !== "") {
      $modalInstance.find('.title').text(this.title);
    }

    if (this.moreButton) {
      $modalInstance.find(".more_button").show();
    }

    $("body").append($modalInstance);
    this.modalId = 'modal_' + Date.now();
    $modalInstance.attr('modalId', this.modalId);
    $modalInstance.attr('id', this.modalId);
    history.pushState({ modalId: this.modalId }, null, null);

    if (this.type === "full") {
      $modalInstance.addClass(`slide-${this.transitionDirection}`);
    }

    modalInstances.push(this);

    // Espera a que termine la animación de apertura antes de ejecutar fadeIn
    $modalInstance.find('.modal-content').hide();
    imodalDisableScroll();
    try {
      await new Promise(resolve => {
        $modalInstance.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', () => {
          resolve();
        });
      });

      try {
        const handleCatchError = async () => {
          this.html = await ajaxRequest(this.actionUri, this.dataToSend, this.method);

          $modalInstance.html(this.html);
          $modalInstance.find('.modal-content').fadeIn('fast');

          if (this.type === "alert") {
            $modalInstance.fadeIn("slow");
          }

          const priceInputs = document.querySelectorAll('.price');
          for (let i = 0; i < priceInputs.length; i++) {
            const input = priceInputs[i];
            if (!input.hasAttribute('data-autonumeric-initialized')) {
              new AutoNumeric(input).northAmerican();
              input.setAttribute('data-autonumeric-initialized', 'true');
            }
          }
        };

        // Llama a la función asincrónica
        await handleCatchError();
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }
  close() {
    const $modalInstance = $(`#${this.modalId}`);
	  if (this.type === "alert") {
	    $modalInstance.hide('200', () => {
	      $modalInstance.remove();
	    });
	  } else {
	    // Agrega una clase para la animación de cierre
	    $modalInstance.addClass(`slide-out-${this.transitionDirection}`);
	    // Espera a que termine la animación antes de eliminar la instancia
	    $modalInstance.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', () => {
	      $modalInstance.remove();
	    });
	  }
  }
}
//End Modal instance

class Confirm extends iModal {
  constructor() {
    super();
    this.alertTitle = '';
    this.message = '';
    this.isin = '';
    this.confirmFunction = '';
  }

  /**
   * Establece las propiedades específicas para el modal de Confirmación.
   * @param {string} alertTitle - Título para la alerta.
   * @param {string} message - Mensaje para el modal de Confirmación.
   * @param {string} isin - Información adicional para el modal.
   * @param {Function} confirmFunction - Función de devolución de llamada para el modal de Confirmación.
   */
  setConfirmProperties(alertTitle, message, isin = null, confirmFunction = null) {
    this.alertTitle = alertTitle;
    this.message = message;
    this.isin = isin;
    this.type = "alert";
    this.confirmFunction = confirmFunction;
    this.transparent = true;
    this.html = 
    	`<div class="clearDivConfirm">
    			<div class="confirm modal_confirm theme_white">
		        <div class="modal-header">
		            <span>${this.alertTitle}</span>
		        </div>
		        <div class="modal-content">
		            <span>${this.message}</span>
		        </div>
		        <div class="modal-footer">
		            <ul>
		                <li>
		                    <span onclick="${confirmFunction}" class="confirmed_dialog loading_full_screen_enable">Confirmar</span>
		                </li>
		                <li>
		                    <a href="#!">Cancelar</a>
		                </li>
		            </ul>
		    		</div> 
		    	</div>
    	 </div>
    	`;
  }

  /**
   * Muestra el modal de Confirmación.
   * Anula el método show de la clase padre (iModal).
   */
  show() {
    super.show(); // Llama al método show de la clase padre

    // Personaliza las propiedades del modal de Confirmación
    if (this.alertTitle !== "") {
      $(`#${this.modalId} .title`).text(this.alertTitle);
    }
    $(`#${this.modalId} .modal-content`).show();
    // Personalización adicional basada en las propiedades del modal de Confirmación
    // (Puedes personalizar esta parte según tus necesidades)

    // Ejemplo: Muestra el mensaje en el modal
    if (this.message !== "") {
      $(`#${this.modalId} .message`).text(this.message);
    }
    // Ejemplo: Adjunta un evento de clic al botón de Confirmar
    $(`#${this.modalId} .confirmButton`).on('click', () => {
      // Llama a la función de confirmación si se proporciona
      if (typeof this.confirmFunction === 'function') {
        this.confirmFunction();
      }
      // Cierra el modal
      //$(`#${this.modalId}`).remove();
    });
  }
}
async function ajaxRequest(url, dataToSend = false, method = "POST") {
	// Validar si dataToSend es un objeto FormData
  const isFormData = dataToSend instanceof FormData;
  const ajaxConfig = {
    url: url,
    type: method,
    contentType: isFormData ? false : 'application/x-www-form-urlencoded',
    processData: isFormData ? false : true,
    enctype: isFormData ? 'multipart/form-data' : undefined,
  };

  // Agregar la propiedad 'data' solo si dataToSend está presente
  if (dataToSend !== false) {
    ajaxConfig.data = dataToSend;
  }

  try {
    const response = await $.ajax(ajaxConfig);
    // Parsear la respuesta JSON y manejar la sesión caducada
    handleJsonResponse(response);
    return response;
  } catch (error) {
    console.error("Error: " + error);
    // Puedes decidir qué hacer en caso de error aquí (lanzar una excepción, manejar de otra manera, etc.)
    throw error;
  }
}
function handleJsonResponse(response) {
  try {
    var jsonResponse = JSON.parse(response);
    if (jsonResponse.code === 'session_no_logged') {
      var url_site = $("#url_site").val();
      var lang = $("#language").val();
      window.location.replace(url_site + lang + "/module/itivos_viaticos/app");
    }
  } catch (error) {
    // Si la respuesta no es un JSON válido, simplemente continuar
  }
}
function getLastModal()
{
	var lastInstance = $(".modal-instance:last");
	return lastInstance;
}
async function handleBackButton() {
  const lastModalInstance = modalInstances.pop();
  if (lastModalInstance) {
    lastModalInstance.close();
  }
  if (modalInstances.length === 0) {
    imodalEnableScroll();
  }
}
function getOppositeDirection(direction) {
  switch (direction) {
    case 'left-to-right':
      return 'right-to-left';
    case 'right-to-left':
      return 'left-to-right';
    case 'bottom-to-top':
      return 'top-to-bottom';
    case 'top-to-bottom':
      return 'bottom-to-top';
    default:
      return 'left-to-right'; // Valor predeterminado en caso de dirección no válida
  }
}
// Asignar la función al evento de retroceso (popstate)
$(window).on('popstate', handleBackButton);
// Boton indepenediente para  (popstate)
$("body").on('click', '.close-modal-instance', async function(event) {
  const $this = $(this);  // Almacena la referencia a $(this)
  $this.addClass('close-modal-efect');

  setTimeout(function() {
    $this.removeClass('close-modal-efect');
    handleBackButton();
  }, 500);
});
var scrollPosition;

function imodalDisableScroll() {
    scrollPosition = window.pageYOffset;
    document.body.classList.add('imodal-scroll-disabled');
}

function imodalEnableScroll() {
    document.body.classList.remove('imodal-scroll-disabled');
    window.scrollTo(0, scrollPosition);
}
