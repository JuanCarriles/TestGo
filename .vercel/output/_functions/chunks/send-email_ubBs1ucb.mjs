import { Resend } from 'resend';

const prerender = false;
function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const POST = async ({ request }) => {
  try {
    const body = await request.json();
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
      contactEmail
    } = body;
    if (!nombres || !apellidos || !email || !celular || !fechaNacimiento || !area || !contactEmail) {
      return new Response(
        JSON.stringify({ error: "Faltan campos obligatorios." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "El formato del correo electrónico del postulante no es válido." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!emailRegex.test(contactEmail)) {
      return new Response(
        JSON.stringify({ error: "El formato del correo de destino no es válido." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const parsedDate = new Date(fechaNacimiento);
    if (isNaN(parsedDate.getTime())) {
      return new Response(
        JSON.stringify({ error: "La fecha de nacimiento no es válida." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (linkedin && linkedin.trim().length > 0) {
      try {
        new URL(linkedin);
      } catch {
        return new Response(
          JSON.stringify({ error: "La URL de LinkedIn proporcionada no es válida." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }
    if (cv) {
      if (/[.]{2}|[\/]/.test(cv.filename)) {
        return new Response(
          JSON.stringify({ error: "El nombre del archivo contiene caracteres no permitidos." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      const allowedExtensions = [".pdf", ".doc", ".docx", ".xls", ".xlsx"];
      const ext = cv.filename.toLowerCase().substring(cv.filename.lastIndexOf("."));
      if (!allowedExtensions.includes(ext)) {
        return new Response(
          JSON.stringify({ error: "Formato de archivo no permitido. Solo se aceptan PDF, Word y Excel." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ];
      if (!allowedMimeTypes.includes(cv.type)) {
        return new Response(
          JSON.stringify({ error: "El tipo de archivo no está permitido." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      const maxBase64Length = 5 * 1024 * 1024 * 1.37;
      if (cv.content.length > maxBase64Length) {
        return new Response(
          JSON.stringify({ error: "El archivo supera el límite máximo permitido de 5MB." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
      const cleanContent = cv.content.includes(",") ? cv.content.split(",")[1] : cv.content;
      if (!base64Regex.test(cleanContent)) {
        return new Response(
          JSON.stringify({ error: "El contenido del archivo adjunto no es un Base64 válido." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }
    const safeNombres = escapeHtml(nombres);
    const safeApellidos = escapeHtml(apellidos);
    const safeEmail = escapeHtml(email);
    const safeCelular = escapeHtml(celular);
    const safeFecha = escapeHtml(fechaNacimiento);
    const safeArea = escapeHtml(area);
    const safeLinkedin = linkedin ? escapeHtml(linkedin) : "";
    const safeComentarios = comentarios ? escapeHtml(comentarios) : "";
    const resendApiKey = "re_DrwzYxi7_4xLopn2dBi8v89BPEdmwZjXk";
    if (!resendApiKey) ;
    if (!resendApiKey.startsWith("re_")) {
      return new Response(
        JSON.stringify({ error: "Configuración de email incorrecta." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const resend = new Resend(resendApiKey);
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
          ` : ""}
          ${cv ? '<p style="margin-top: 20px; padding: 12px 16px; background: #ebf8ff; border-radius: 8px; color: #2b6cb0; font-size: 14px;">📎 CV adjunto en este email.</p>' : ""}
        </div>
        <div style="background: #f7fafc; padding: 16px 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #a0aec0; font-size: 12px; margin: 0; text-align: center;">Este email fue enviado automáticamente desde el formulario de GO Centro Médico.</p>
        </div>
      </div>
    `;
    const attachments = cv?.filename && cv?.content ? [{ filename: cv.filename, content: Buffer.from(cv.content, "base64") }] : void 0;
    console.log("[SERVER] Intentando enviar email con Resend...");
    console.log("[SERVER] API Key configurada (empieza con):", resendApiKey.substring(0, 8));
    console.log("[SERVER] Destinatario (to):", contactEmail);
    const { data, error } = await resend.emails.send({
      from: "GO Centro Médico <onboarding@resend.dev>",
      to: [contactEmail],
      replyTo: safeEmail,
      subject: `Nueva postulación: ${safeNombres} ${safeApellidos} — ${safeArea}`,
      html: messageHtml,
      attachments
    });
    console.log("[SERVER] Respuesta de Resend -> Data:", data, "| Error:", error);
    if (error) {
      console.error("[SERVER] Resend error real:", error);
      return new Response(
        JSON.stringify({ error: error.message || "Error al enviar el email." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ success: true, id: data?.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido al enviar el email.";
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
