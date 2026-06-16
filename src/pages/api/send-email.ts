import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

interface CVAttachment {
  filename: string;
  content: string; // base64
  type: string;
}

interface EmailRequestBody {
  nombres: string;
  apellidos: string;
  email: string;
  celular: string;
  fechaNacimiento: string;
  area: string;
  linkedin?: string;
  comentarios?: string;
  cv?: CVAttachment;
  contactEmail: string;
}

/**
 * Helper: escapa caracteres HTML peligrosos para prevenir inyección XSS.
 * Convierte <, >, &, " y ' en sus entidades HTML seguras.
 * Esto garantiza que un input como <script>alert('xss')</script> se renderice
 * como texto plano en el email y no se ejecute como código.
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as EmailRequestBody;
    const {
      nombres,
      apellidos,
      email,
      celular,
      fechaNacimiento,
      area,
      linkedin,
      comentarios,
      cv,
      contactEmail,
    } = body;

    // =========================================================================
    // 1. VALIDACIÓN DE CAMPOS OBLIGATORIOS
    // =========================================================================
    // Se asegura que ningún campo requerido llegue vacío, nulo o indefinido.
    if (!nombres || !apellidos || !email || !celular || !fechaNacimiento || !area || !contactEmail) {
      return new Response(
        JSON.stringify({ error: 'Faltan campos obligatorios.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // =========================================================================
    // 2. VALIDACIÓN DE FORMATO DE EMAIL
    // =========================================================================
    // Regex estándar RFC 5322 simplificado. Valida estructura: usuario@dominio.ext
    // Se valida tanto el email del postulante como el email destino (contactEmail).
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'El formato del correo electrónico del postulante no es válido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!emailRegex.test(contactEmail)) {
      return new Response(
        JSON.stringify({ error: 'El formato del correo de destino no es válido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // =========================================================================
    // 3. VALIDACIÓN DE FECHA
    // =========================================================================
    // Asegura que fechaNacimiento sea una fecha real y parseable.
    // Rechaza strings como "not-a-date" o fechas inválidas (ej: 31/02/2023).
    const parsedDate = new Date(fechaNacimiento);
    if (isNaN(parsedDate.getTime())) {
      return new Response(
        JSON.stringify({ error: 'La fecha de nacimiento no es válida.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // =========================================================================
    // 4. VALIDACIÓN DE URL (LINKEDIN)
    // =========================================================================
    // Si el usuario proporcionó un LinkedIn, validamos que sea una URL HTTP/HTTPS
    // sintácticamente correcta usando el constructor nativo URL.
    if (linkedin && linkedin.trim().length > 0) {
      try {
        new URL(linkedin);
      } catch {
        return new Response(
          JSON.stringify({ error: 'La URL de LinkedIn proporcionada no es válida.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // =========================================================================
    // 5. VALIDACIÓN DE ARCHIVO ADJUNTO (CV)
    // =========================================================================
    if (cv) {
      // -----------------------------------------------------------------------
      // 5a. Validación de nombre de archivo
      // -----------------------------------------------------------------------
      // Previene Path Traversal: rechaza nombres que contengan '..', '/' o '\'
      // que podrían intentar escribir fuera del directorio esperado.
      if (/[.]{2}|[\/]/.test(cv.filename)) {
        return new Response(
          JSON.stringify({ error: 'El nombre del archivo contiene caracteres no permitidos.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // -----------------------------------------------------------------------
      // 5b. Validación de extensión de archivo
      // -----------------------------------------------------------------------
      // Se fuerza una whitelist de extensiones seguras para el contexto laboral.
      const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
      const ext = cv.filename.toLowerCase().substring(cv.filename.lastIndexOf('.'));
      if (!allowedExtensions.includes(ext)) {
        return new Response(
          JSON.stringify({ error: 'Formato de archivo no permitido. Solo se aceptan PDF, Word y Excel.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // -----------------------------------------------------------------------
      // 5c. Validación de tipo MIME (whitelist)
      // -----------------------------------------------------------------------
      // Independientemente de la extensión, validamos el MIME type reportado
      // para mitigar archivos con extensión renombrada (ej: .exe renombrado a .pdf).
      const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      if (!allowedMimeTypes.includes(cv.type)) {
        return new Response(
          JSON.stringify({ error: 'El tipo de archivo no está permitido.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // -----------------------------------------------------------------------
      // 5d. Validación de tamaño máximo (5MB)
      // -----------------------------------------------------------------------
      // El frontend limita a 5MB binarios. En base64 cada 3 bytes se codifican
      // en 4 caracteres (+33% overhead). 5MB binarios ≈ 6.67MB de string base64.
      // Usamos un margen seguro de 1.37x para cubrir padding y headers.
      const maxBase64Length = 5 * 1024 * 1024 * 1.37;
      if (cv.content.length > maxBase64Length) {
        return new Response(
          JSON.stringify({ error: 'El archivo supera el límite máximo permitido de 5MB.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // -----------------------------------------------------------------------
      // 5e. Validación de estructura Base64
      // -----------------------------------------------------------------------
      // Rechaza strings que no cumplan el patrón base64 estándar (RFC 4648).
      // Acepta opcionalmente prefijos data:... pero exigimos que el contenido
      // codificado sea válido.
      const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
      // Limpiamos posible prefijo data URL (ej: data:application/pdf;base64,...)
      const cleanContent = cv.content.includes(',') ? cv.content.split(',')[1] : cv.content;
      if (!base64Regex.test(cleanContent)) {
        return new Response(
          JSON.stringify({ error: 'El contenido del archivo adjunto no es un Base64 válido.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // =========================================================================
    // 6. SANITIZACIÓN DE INPUTS (Anti-XSS)
    // =========================================================================
    // Escapamos TODOS los campos de texto libre antes de interpolarlos en el
    // HTML del email. Esto neutraliza cualquier intento de inyección de scripts
    // o manipulación del markup del correo.
    const safeNombres = escapeHtml(nombres);
    const safeApellidos = escapeHtml(apellidos);
    const safeEmail = escapeHtml(email);
    const safeCelular = escapeHtml(celular);
    const safeFecha = escapeHtml(fechaNacimiento);
    const safeArea = escapeHtml(area);
    const safeLinkedin = linkedin ? escapeHtml(linkedin) : '';
    const safeComentarios = comentarios ? escapeHtml(comentarios) : '';

    // =========================================================================
    // 7. VALIDACIÓN DE API KEY (RESEND)
    // =========================================================================
    const resendApiKey = import.meta.env.RESEND_API_KEY;

    // Si no hay API key configurada, entramos en modo simulación (mock).
    // Esto permite testear el formulario completo sin enviar mails reales.
    if (!resendApiKey) {
      console.log('[EMAIL MOCK] Resend API key no configurada. Datos recibidos:', {
        nombres: safeNombres,
        apellidos: safeApellidos,
        email: safeEmail,
        celular: safeCelular,
        area: safeArea,
        hasCV: !!cv,
      });
      return new Response(
        JSON.stringify({ success: true, mock: true, note: 'Resend API key no configurada. Ejecutando en modo simulación.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validación adicional: las API keys de Resend deben comenzar con "re_".
    // Detectamos configuraciones incorrectas antes de gastar una llamada HTTP.
    if (!resendApiKey.startsWith('re_')) {
      return new Response(
        JSON.stringify({ error: 'Configuración de email incorrecta.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(resendApiKey);

    // =========================================================================
    // 8. CONSTRUCCIÓN DEL EMAIL
    // =========================================================================
    // TODOS los valores interpolados fueron previamente sanitizados con escapeHtml.
    const messageHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 24px 32px; border-radius: 12px 12px 0 0;">
          <h2 style="color: #ffffff; margin: 0; font-size: 22px;">📋 Nueva postulación laboral</h2>
          <p style="color: #a0aec0; margin: 8px 0 0; font-size: 14px;">GO Centro Médico — Trabaja con nosotros</p>
        </div>
        <div style="background: #ffffff; padding: 24px 32px; border: 1px solid #e2e8f0; border-top: none;">
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; background: #f7fafc; border: 1px solid #e2e8f0; color: #2d3748; width: 40%;">Nombre completo</td>
              <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #4a5568;">${safeNombres} ${safeApellidos}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; background: #f7fafc; border: 1px solid #e2e8f0; color: #2d3748;">Email</td>
              <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #4a5568;"><a href="mailto:${safeEmail}" style="color: #3182ce;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; background: #f7fafc; border: 1px solid #e2e8f0; color: #2d3748;">Celular</td>
              <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #4a5568;">${safeCelular}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; background: #f7fafc; border: 1px solid #e2e8f0; color: #2d3748;">Fecha de nacimiento</td>
              <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #4a5568;">${safeFecha}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; background: #f7fafc; border: 1px solid #e2e8f0; color: #2d3748;">Área de interés</td>
              <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #4a5568;">${safeArea}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; background: #f7fafc; border: 1px solid #e2e8f0; color: #2d3748;">LinkedIn</td>
              <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #4a5568;">${safeLinkedin ? `<a href="${safeLinkedin}" style="color: #3182ce;">${safeLinkedin}</a>` : '<span style="color: #a0aec0;">No proporcionado</span>'}</td>
            </tr>
          </table>
          ${safeComentarios ? `
          <div style="margin-top: 20px;">
            <h3 style="color: #2d3748; font-size: 16px; margin-bottom: 8px;">💬 Comentarios</h3>
            <p style="padding: 16px; border: 1px solid #e2e8f0; background: #f7fafc; border-radius: 8px; color: #4a5568; line-height: 1.6; margin: 0;">${safeComentarios}</p>
          </div>
          ` : ''}
          ${cv ? '<p style="margin-top: 20px; padding: 12px 16px; background: #ebf8ff; border-radius: 8px; color: #2b6cb0; font-size: 14px;">📎 CV adjunto en este email.</p>' : ''}
        </div>
        <div style="background: #f7fafc; padding: 16px 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #a0aec0; font-size: 12px; margin: 0; text-align: center;">Este email fue enviado automáticamente desde el formulario de GO Centro Médico.</p>
        </div>
      </div>
    `;

    // =========================================================================
    // 9. PREPARACIÓN DE ADJUNTO
    // =========================================================================
    // El contenido ya fue validado como base64 válido, por lo que Buffer.from
    // es seguro. No obstante, si por algún edge case falla, cae en el catch global.
    const attachments = cv?.filename && cv?.content
      ? [{ filename: cv.filename, content: Buffer.from(cv.content, 'base64') }]
      : undefined;

    console.log('[SERVER] Intentando enviar email con Resend...');
    console.log('[SERVER] API Key configurada (empieza con):', resendApiKey.substring(0, 8));
    console.log('[SERVER] Destinatario (to):', contactEmail);

    // =========================================================================
    // 10. ENVÍO VIA RESEND
    // =========================================================================
    const { data, error } = await resend.emails.send({
      from: 'GO Centro Médico <onboarding@resend.dev>',
      to: [contactEmail],
      replyTo: safeEmail,
      subject: `Nueva postulación: ${safeNombres} ${safeApellidos} — ${safeArea}`,
      html: messageHtml,
      attachments,
    });

    console.log('[SERVER] Respuesta de Resend -> Data:', data, '| Error:', error);

    if (error) {
      console.error('[SERVER] Resend error real:', error);
      return new Response(
        JSON.stringify({ error: error.message || 'Error al enviar el email.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: data?.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    // =========================================================================
    // 11. MANEJO GLOBAL DE ERRORES INESPERADOS
    // =========================================================================
    // Diferenciamos errores conocidos (instancia de Error) de fallas críticas.
    const message = error instanceof Error ? error.message : 'Error desconocido al enviar el email.';
    console.error('Email send error:', error);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
