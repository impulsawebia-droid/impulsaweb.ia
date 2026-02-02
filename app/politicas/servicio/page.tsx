export default function PoliticaServicioPage() {
  return (
    <>
      <h2>Política de Servicio y Entregas</h2>
      <p>
        <strong>Última actualización:</strong>{" "}
        {new Date().toLocaleDateString("es-CO")}
      </p>

      <h3>1. Inicio del proyecto</h3>
      <p>
        El proyecto inicia cuando: (a) se confirme el pago (total o anticipo) o
        se apruebe el contraentrega y (b) el brief esté diligenciado con la
        información necesaria.
      </p>

      <h3>2. Tiempos de entrega</h3>
      <p>
        Los tiempos varían según el plan, la complejidad y la disponibilidad de
        contenido. Los tiempos se pueden pausar si falta información o recursos.
      </p>

      <h3>3. Contenido y materiales</h3>
      <ul>
        <li>El cliente es responsable de entregar logo, textos e imágenes si aplica.</li>
        <li>
          Si no hay contenido disponible, se podrá usar contenido temporal para
          avanzar o pausar el proceso.
        </li>
      </ul>

      <h3>4. Publicación y dominio</h3>
      <p>
        La publicación puede requerir accesos a dominio/hosting. Si el cliente no
        los provee, se entregará el sitio publicado en un entorno alterno (preview)
        o mediante archivos/repositorio, según se acuerde.
      </p>

      <h3>5. Cambios y alcance</h3>
      <p>
        Los cambios incluidos se limitan al número de revisiones del plan. Cambios
        que amplíen alcance (nuevas secciones, funcionalidades, rediseño completo)
        se cotizan por separado.
      </p>

      <h3>6. Soporte</h3>
      <p>
        Se ofrece soporte para errores atribuibles al desarrollo entregado dentro
        del periodo del plan. Ajustes evolutivos o nuevos requerimientos pueden
        tener costo adicional.
      </p>
    </>
  );
}
