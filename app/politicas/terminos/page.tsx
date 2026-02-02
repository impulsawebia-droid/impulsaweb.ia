export default function TerminosPage() {
  return (
    <>
      <h2>Términos y Condiciones</h2>
      <p>
        <strong>Última actualización:</strong>{" "}
        {new Date().toLocaleDateString("es-CO")}
      </p>

      <h3>1. Alcance del servicio</h3>
      <p>
        <strong>ImpulsaWeb</strong> ofrece servicios de diseño y desarrollo web
        (landing pages, páginas de servicios, páginas web completas y soluciones
        a medida), según el plan contratado y la información entregada por el
        cliente en el formulario (brief).
      </p>

      <h3>2. Requisitos para iniciar</h3>
      <ul>
        <li>Confirmación del pago (total o anticipo) o aprobación del contraentrega.</li>
        <li>Brief diligenciado con información suficiente.</li>
        <li>Entrega de recursos necesarios (logo, textos, imágenes) si aplica.</li>
      </ul>

      <h3>3. Entregables</h3>
      <ul>
        <li>Entrega en enlace de vista previa (preview) para revisión.</li>
        <li>Entrega final y/o publicación según el plan contratado.</li>
        <li>
          Si el cliente no provee contenido, se podrá usar contenido temporal
          (placeholders) para avanzar.
        </li>
      </ul>

      <h3>4. Revisiones y cambios</h3>
      <p>
        Cada plan incluye un número limitado de rondas de cambios. Cambios que
        impliquen ampliación del alcance (nuevas secciones, funcionalidades o
        rediseño total) podrán cotizarse por separado.
      </p>

      <h3>5. Pagos y modalidades</h3>
      <ul>
        <li>
          <strong>Pago total:</strong> se inicia el proyecto tras confirmación.
        </li>
        <li>
          <strong>Anticipo:</strong> se inicia el proyecto tras confirmación del
          anticipo. El saldo se paga antes de la entrega final/publicación.
        </li>
        <li>
          <strong>Contraentrega:</strong> se toma como solicitud y está sujeta a
          aprobación; el proyecto puede requerir validación adicional.
        </li>
        <li>
          <strong>Wompi:</strong> los pagos se procesan por la pasarela. No
          almacenamos información completa de tarjetas.
        </li>
        <li>
          <strong>Nequi:</strong> si se usa como pago manual, la orden quedará
          “pendiente de confirmación” hasta validar el comprobante.
        </li>
      </ul>

      <h3>6. Responsabilidades del cliente</h3>
      <ul>
        <li>Entregar información veraz y completa en el brief.</li>
        <li>Responder aprobaciones y solicitudes de cambios en tiempos razonables.</li>
        <li>Proveer accesos a dominio/hosting cuando se requiera publicación.</li>
      </ul>

      <h3>7. Limitación de responsabilidad</h3>
      <p>
        No garantizamos resultados comerciales específicos (ventas, leads,
        conversiones), ya que dependen de factores externos como la oferta,
        calidad del tráfico, campañas de marketing, etc.
      </p>
    </>
  );
}
