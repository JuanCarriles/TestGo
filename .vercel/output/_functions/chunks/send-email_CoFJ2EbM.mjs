import { Resend } from 'resend';

const prerender = false;
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
    const resendApiKey = "re_XXXXXXXXX";
    if (!resendApiKey) ;
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
              <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #4a5568;">${nombres} ${apellidos}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; background: #f7fafc; border: 1px solid #e2e8f0; color: #2d3748;">Email</td>
              <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #4a5568;"><a href="mailto:${email}" style="color: #3182ce;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; background: #f7fafc; border: 1px solid #e2e8f0; color: #2d3748;">Celular</td>
              <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #4a5568;">${celular}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; background: #f7fafc; border: 1px solid #e2e8f0; color: #2d3748;">Fecha de nacimiento</td>
              <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #4a5568;">${fechaNacimiento}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; background: #f7fafc; border: 1px solid #e2e8f0; color: #2d3748;">Área de interés</td>
              <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #4a5568;">${area}</td>
            </tr>
            <tr>
              <td style="padding: 12px 16px; font-weight: 600; background: #f7fafc; border: 1px solid #e2e8f0; color: #2d3748;">LinkedIn</td>
              <td style="padding: 12px 16px; border: 1px solid #e2e8f0; color: #4a5568;">${linkedin ? `<a href="${linkedin}" style="color: #3182ce;">${linkedin}</a>` : '<span style="color: #a0aec0;">No proporcionado</span>'}</td>
            </tr>
          </table>
          ${comentarios ? `
          <div style="margin-top: 20px;">
            <h3 style="color: #2d3748; font-size: 16px; margin-bottom: 8px;">💬 Comentarios</h3>
            <p style="padding: 16px; border: 1px solid #e2e8f0; background: #f7fafc; border-radius: 8px; color: #4a5568; line-height: 1.6; margin: 0;">${comentarios}</p>
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
    const { data, error } = await resend.emails.send({
      from: "GO Centro Médico <onboarding@resend.dev>",
      to: [contactEmail],
      replyTo: email,
      subject: `Nueva postulación: ${nombres} ${apellidos} — ${area}`,
      html: messageHtml,
      attachments
    });
    if (error) {
      console.error("Resend error:", error);
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
