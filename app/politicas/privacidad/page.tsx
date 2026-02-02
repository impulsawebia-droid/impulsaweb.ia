export default function PrivacidadPage() {
  return (
    <>
      <h2>Política de Privacidad</h2>
      <p>
        <strong>Última actualización:</strong>{" "}
        {new Date().toLocaleDateString("es-CO")}
      </p>

      <p>
        En <strong>ImpulsaWeb</strong> respetamos tu privacidad. Esta política
        describe cómo recolectamos, usamos y protegemos tu información cuando
        solicitas nuestros servicios.
      </p>

      <h3>1. Información que recolectamos</h3>
      <ul>
        <li>Datos de contacto: nombre, teléfono, correo.</li>
        <li>Información del proyecto: brief, referencias, enlaces, archivos (logo, imágenes).</li>
        <li>Datos del pedido: plan seleccionado, modalidad de pago, estado del pedido.</li>
        <li>Datos transaccionales: confirmación/estado del pago (no almacenamos datos completos de tarjetas).</li>
      </ul>

      <h3>2. Para qué usamos tus datos</h3>
      <ul>
        <li>Gestionar tu compra y el proceso de producción del sitio.</li>
        <li>Contactarte para validaciones, cambios o entrega.</li>
        <li>Soporte y seguimiento.</li>
      </ul>

      <h3>3. Compartir información con terceros</h3>
      <p>
        Podemos usar servicios de terceros (hosting, analítica, pasarela de pagos
        y herramientas operativas) para prestar el servicio. Cada proveedor maneja
        sus propias políticas.
      </p>

      <h3>4. Conservación y seguridad</h3>
      <p>
        Conservamos la información el tiempo necesario para gestionar pedidos y
        soporte. Implementamos medidas razonables de seguridad; sin embargo, ningún
        sistema es 100% infalible.
      </p>

      <h3>5. Derechos del titular</h3>
      <p>
        Puedes solicitar actualización, corrección o eliminación de tus datos por
        nuestros canales oficiales de soporte.
      </p>
    </>
  );
}
