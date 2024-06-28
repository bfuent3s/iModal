
# iModal

iModal es una librería de JavaScript que permite crear y gestionar modales de manera eficiente y moderna para aplicaciones web. Esta librería facilita la creación de múltiples modales que se superponen, gestionando automáticamente las llamadas AJAX y la navegación hacia atrás, tanto en dispositivos Android como iPhone, mediante la interpretación de botones físicos y gestos táctiles.

## Características

- **Superposición de Modales:** Permite abrir múltiples modales uno sobre otro, similar al comportamiento de aplicaciones nativas.
- **Gestión de Navegación:** Maneja el botón de atrás (o gestos) para cerrar modales, proporcionando una experiencia de usuario fluida.
- **Compatibilidad con AJAX:** Facilita las llamadas AJAX dentro de los modales.
- **Soporte para Gestos:** Compatible con gestos táctiles en dispositivos móviles para una navegación intuitiva.
- **Interfaz Intuitiva:** Diseñada para integrarse fácilmente en cualquier aplicación web, mejorando la experiencia de usuario.

## Instalación

Puedes incluirlo directamente en tu proyecto con un script tag:

\`\`\`html
<link rel="stylesheet" href="path/to/imodal.min.css">
<script src="path/to/imodal.min.js"></script>
\`\`\`

## Uso

Aquí tienes un ejemplo básico de cómo usar iModal:

\`\`\`javascript
// Inicializar iModal
const modal = new iModal();

// Abrir un modal
async function shoContent(param = null)
{
	let url_site = "https://itivos.com"; // your domain
	let controller_ajax_uri = url_site + "my_controller/ajax"; // your controller
	let action = controller_ajax_uri + "?resource=show_form" // Show a form, save , etc;
	try {
		const eventShow = new iModal();
		eventShow.title = "Title to my modal";
		eventShow.actionUri = action;
		eventShow.dataToSend = {param: param}; // If your needd send parametters to controller
		await eventShow.show();
	} catch (error) {
		console.error("General error: " + error);
	}	
} 
\`\`\`

## Opciones

- \`title\`: Título del modal.
- \`actionUri\`: Url de solicitud.
- \`dataToSend\`: Array con los datos a enviar para procesar (Si es necesario)
- \`show\`: Mostrar el modal

## Compatibilidad

iModal es compatible con los siguientes navegadores:

- Chrome
- Firefox
- Safari
- Edge
- Opera

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un issue o un pull request en el repositorio de GitHub.

## Licencia

Este proyecto está licenciado bajo la licencia MIT con una cláusula de atribución. Consulta el archivo \`LICENSE\` para más detalles.

MIT License

© [2024] [Bernardo Fuentes | Itivos Developers]

Por la presente se concede permiso, sin cargo, a cualquier persona que obtenga una copia de este software y los archivos de documentación asociados (el "Software"), para tratar en el Software sin restricciones, incluyendo sin limitación los derechos de usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software, y para permitir a las personas a quienes se les proporcione el Software a hacerlo, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A LAS GARANTÍAS DE COMERCIABILIDAD, IDONEIDAD PARA UN PROPÓSITO PARTICULAR Y NO INFRACCIÓN. EN NINGÚN CASO LOS AUTORES O TITULARES DEL COPYRIGHT SERÁN RESPONSABLES POR NINGUNA RECLAMACIÓN, DAÑO O OTRA RESPONSABILIDAD, YA SEA EN UNA ACCIÓN DE CONTRATO, AGRAVIO O DE OTRO MODO, QUE SURJA DE, FUERA DE O EN CONEXIÓN CON EL SOFTWARE O EL USO U OTRO TIPO DE ACCIONES EN EL SOFTWARE.

Se debe mantener la atribución al autor original en cualquier uso del Software. No se permite utilizar este software como parte de un proyecto cuyo objetivo principal sea competir directamente con el trabajo original sin obtener permiso previo del autor.
