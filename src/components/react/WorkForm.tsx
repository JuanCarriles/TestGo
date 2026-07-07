import { useState, type FormEvent, type ChangeEvent } from 'react';
import { trackEvent } from '../../lib/analytics';

interface Props {
  contactEmail: string;
}

interface FormData {
  nombres: string;
  apellidos: string;
  celular: string;
  email: string;
  fechaNacimiento: string;
  area: string;
  cv: File | null;
  linkedin: string;
  comentarios: string;
}

const initialForm: FormData = {
  nombres: '',
  apellidos: '',
  celular: '',
  email: '',
  fechaNacimiento: '',
  area: '',
  cv: null,
  linkedin: '',
  comentarios: '',
};

export default function WorkForm({ contactEmail }: Props) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mockMode, setMockMode] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Formato de archivo no permitido. Solo se aceptan PDFs e imágenes (JPG, PNG, GIF, WEBP).');
      setForm((prev) => ({ ...prev, cv: null }));
      e.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`El archivo es demasiado grande. El límite es 20 MB. Tu archivo pesa ${(file.size / (1024 * 1024)).toFixed(1)} MB.`);
      setForm((prev) => ({ ...prev, cv: null }));
      e.target.value = '';
      return;
    }

    setError('');
    setForm((prev) => ({ ...prev, cv: file }));
  };

  const readFileAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // remove data:... prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    if (form.cv) {
      if (!ALLOWED_TYPES.includes(form.cv.type)) {
        setError('Formato de archivo no permitido. Solo se aceptan PDFs e imágenes (JPG, PNG, GIF, WEBP).');
        setLoading(false);
        return;
      }
      if (form.cv.size > MAX_FILE_SIZE) {
        setError('El archivo adjunto es demasiado grande. El límite es 20 MB.');
        setLoading(false);
        return;
      }
    }

    try {
      let cvData = null;
      if (form.cv) {
        const base64 = await readFileAsBase64(form.cv);
        cvData = {
          filename: form.cv.name,
          content: base64,
          type: form.cv.type || 'application/pdf',
        };
      }

      const payload = {
        nombres: form.nombres,
        apellidos: form.apellidos,
        email: form.email,
        celular: form.celular,
        fechaNacimiento: form.fechaNacimiento,
        area: form.area,
        linkedin: form.linkedin,
        comentarios: form.comentarios,
        cv: cvData,
        contactEmail,
      };

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await res.json();

      if (!res.ok) {
        throw new Error(responseBody?.error || `Error ${res.status}`);
      }

      setSuccess(true);
      setMockMode(!!responseBody.mock);
      setForm(initialForm);
      (e.target as HTMLFormElement).reset();
      trackEvent('enviar_formulario_trabajo', { event_category: 'conversion', event_label: 'trabaja_con_nosotros' });
    } catch (err: any) {
      setError(err?.message || 'Hubo un error al enviar la postulación. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 sm:space-y-6"
    >
      {/* Nombre y Apellido */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nombres" className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-text/70 mb-1.5 sm:mb-2 font-body">
            Nombre/s <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="nombres"
            name="nombres"
            required
            value={form.nombres}
            onChange={handleChange}
            className="w-full rounded-xl border border-text/10 bg-white px-4 py-2.5 sm:py-3 text-sm text-text placeholder:text-text/30 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-body"
            placeholder="Ej: María"
          />
        </div>
        <div>
          <label htmlFor="apellidos" className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-text/70 mb-1.5 sm:mb-2 font-body">
            Apellido/s <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="apellidos"
            name="apellidos"
            required
            value={form.apellidos}
            onChange={handleChange}
            className="w-full rounded-xl border border-text/10 bg-white px-4 py-2.5 sm:py-3 text-sm text-text placeholder:text-text/30 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-body"
            placeholder="Ej: González"
          />
        </div>
      </div>

      {/* Celular y Email */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="celular" className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-text/70 mb-1.5 sm:mb-2 font-body">
            Celular <span className="text-primary">*</span>
          </label>
          <input
            type="tel"
            id="celular"
            name="celular"
            required
            value={form.celular}
            onChange={handleChange}
            className="w-full rounded-xl border border-text/10 bg-white px-4 py-2.5 sm:py-3 text-sm text-text placeholder:text-text/30 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-body"
            placeholder="Ej: 011 2345-6789"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-text/70 mb-1.5 sm:mb-2 font-body">
            Correo electrónico <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-text/10 bg-white px-4 py-2.5 sm:py-3 text-sm text-text placeholder:text-text/30 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-body"
            placeholder="Ej: nombre@email.com"
          />
        </div>
      </div>

      {/* Fecha de nacimiento y Área */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fechaNacimiento" className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-text/70 mb-1.5 sm:mb-2 font-body">
            Fecha de nacimiento <span className="text-primary">*</span>
          </label>
          <input
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            required
            value={form.fechaNacimiento}
            onChange={handleChange}
            className="w-full rounded-xl border border-text/10 bg-white px-4 py-2.5 sm:py-3 text-sm text-text placeholder:text-text/30 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-body"
          />
        </div>
        <div>
          <label htmlFor="area" className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-text/70 mb-1.5 sm:mb-2 font-body">
            Área de interés <span className="text-primary">*</span>
          </label>
          <select
            id="area"
            name="area"
            required
            value={form.area}
            onChange={handleChange}
            className="w-full rounded-xl border border-text/10 bg-white px-4 py-2.5 sm:py-3 text-sm text-text transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-body appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%236B7280%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27M6%208l4%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
          >
            <option value="">Seleccioná un área</option>
            <option value="medicina-general">Medicina general</option>
            <option value="especialista-medico">Especialista médico</option>
            <option value="enfermeria">Enfermería</option>
            <option value="imagenes">Diagnóstico por imágenes</option>
            <option value="laboratorio">Laboratorio</option>
            <option value="administracion">Administración</option>
            <option value="recepcion">Recepción</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>

      {/* CV */}
      <div>
        <label htmlFor="cv" className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-text/70 mb-1.5 sm:mb-2 font-body">
          Adjuntar currículum vitae <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <input
            type="file"
            id="cv"
            name="cv"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
            required
            onChange={handleFileChange}
            className="w-full rounded-xl border border-dashed border-text/20 bg-surface/5 px-4 py-6 sm:py-8 text-sm text-text transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-body file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/90 cursor-pointer"
          />
        </div>
        <p className="mt-2 text-xs text-text/40 font-body">Peso máximo 20 MB. Formatos: PDF, JPG, PNG, GIF, WEBP.</p>
      </div>

      {/* LinkedIn */}
      <div>
        <label htmlFor="linkedin" className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-text/70 mb-1.5 sm:mb-2 font-body">
          Perfil LinkedIn <span className="text-text/40 normal-case tracking-normal font-normal">(opcional)</span>
        </label>
        <input
          type="url"
          id="linkedin"
          name="linkedin"
          value={form.linkedin}
          onChange={handleChange}
          className="w-full rounded-xl border border-text/10 bg-white px-4 py-2.5 sm:py-3 text-sm text-text placeholder:text-text/30 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-body"
          placeholder="https://linkedin.com/in/tu-perfil"
        />
      </div>

      {/* Comentarios */}
      <div>
        <label htmlFor="comentarios" className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-text/70 mb-1.5 sm:mb-2 font-body">
          Comentario o aclaración <span className="text-text/40 normal-case tracking-normal font-normal">(opcional)</span>
        </label>
        <textarea
          id="comentarios"
          name="comentarios"
          rows={4}
          maxLength={500}
          value={form.comentarios}
          onChange={handleChange}
          className="w-full rounded-xl border border-text/10 bg-white px-4 py-2.5 sm:py-3 text-sm text-text placeholder:text-text/30 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-body resize-y"
          placeholder="Contanos por qué querés sumarte al equipo..."
        />
        <p className="mt-1.5 text-xs text-text/40 font-body">{form.comentarios.length} de 500 caracteres máximos.</p>
      </div>

      {/* Success message */}
      {success && (
        <div className={`rounded-xl border p-4 text-center ${mockMode ? 'bg-amber-50 border-amber-200' : 'bg-secondary/10 border-secondary/20'}`}>
          <p className={`text-sm font-semibold font-body ${mockMode ? 'text-amber-700' : 'text-secondary'}`}>
            {mockMode ? 'Formulario enviado (modo de prueba)' : '¡Gracias por tu interés!'}
          </p>
          <p className="text-xs text-text/60 mt-1 font-body">
            {mockMode
              ? 'El servicio de email aún no está configurado. Los datos se registraron correctamente, pero no se envió ningún correo real.'
              : 'Nos pondremos en contacto a la brevedad.'}
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center">
          <p className="text-sm font-semibold text-red-600 font-body">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg transition-all duration-500 hover:bg-primary/90 hover:shadow-glow hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-body disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? 'Enviando...' : 'Enviar mensaje'}
        {!loading && (
          <svg className="ml-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        )}
      </button>
    </form>
  );
}
