import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import {
  ArrowRightIcon,
  ChartBarIcon,
  CubeTransparentIcon,
  SparklesIcon,
  BoltIcon,
  CloudIcon,
  ShoppingBagIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  CircleStackIcon,
  CheckCircleIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline'

const estadisticas = [
  { etiqueta: 'Horizonte de pronóstico', valor: '24 h' },
  { etiqueta: 'Capas de decisión', valor: '4' },
  { etiqueta: 'Motor principal', valor: 'ML + reglas' },
  { etiqueta: 'Infraestructura', valor: 'Docker' },
]

const problemas = [
  {
    titulo: 'Demanda cambiante',
    descripcion:
      'El clima, los eventos y los hábitos de compra pueden cambiar las ventas de un día a otro. Retail Pulse ayuda a anticipar esos movimientos.',
    icono: CloudIcon,
    color: 'from-sky-500 to-cyan-500',
  },
  {
    titulo: 'Inventario poco preciso',
    descripcion:
      'Evita comprar de más o quedarte sin producto usando señales claras para reabastecer en el momento correcto.',
    icono: CubeTransparentIcon,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    titulo: 'Promociones sin dirección',
    descripcion:
      'Deja atrás las promociones genéricas y descubre qué productos conviene sugerir juntos para vender mejor.',
    icono: SparklesIcon,
    color: 'from-fuchsia-500 to-violet-500',
  },
]

const soluciones = [
  {
    titulo: 'Pronóstico de demanda',
    descripcion:
      'Estima la demanda por producto usando historial de ventas, clima y contexto operativo.',
    icono: ChartBarIcon,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    titulo: 'Reabastecimiento inteligente',
    descripcion:
      'Calcula puntos de reorden y detecta productos con riesgo antes de que afecten la operación.',
    icono: BoltIcon,
    color: 'bg-amber-50 text-amber-600',
  },
  {
    titulo: 'Venta cruzada',
    descripcion:
      'Encuentra combinaciones de productos que pueden ayudarte a subir el ticket promedio.',
    icono: ShoppingBagIcon,
    color: 'bg-violet-50 text-violet-600',
  },
  {
    titulo: 'Arquitectura escalable',
    descripcion:
      'Diseño modular con API, servicios y base de datos preparados para crecer con más clientes.',
    icono: CpuChipIcon,
    color: 'bg-slate-100 text-slate-700',
  },
  {
    titulo: 'Datos centralizados',
    descripcion:
      'Unifica catálogo, ventas, inventario, clima y contexto en una sola base analítica.',
    icono: CircleStackIcon,
    color: 'bg-cyan-50 text-cyan-600',
  },
  {
    titulo: 'Seguridad y control',
    descripcion:
      'Acceso por roles, trazabilidad de acciones y una base sólida para operación confiable.',
    icono: ShieldCheckIcon,
    color: 'bg-emerald-50 text-emerald-600',
  },
]

const flujo = [
  {
    paso: '01',
    titulo: 'Captura y consolidación',
    texto:
      'Integra ventas, productos, inventario, clima y contexto en una sola capa de análisis.',
  },
  {
    paso: '02',
    titulo: 'Análisis y modelos',
    texto:
      'Procesa KPIs, detecta patrones y genera pronósticos y reglas de afinidad entre productos.',
  },
  {
    paso: '03',
    titulo: 'Sugerencias de acción',
    texto:
      'Traduce los datos en decisiones claras: reabastecer, impulsar, revisar o priorizar.',
  },
  {
    paso: '04',
    titulo: 'Visualización y seguimiento',
    texto:
      'Muestra resultados en dashboard para que el negocio pueda actuar más rápido y con menos incertidumbre.',
  },
]

const beneficios = [
  'Menos quiebres de stock en productos clave',
  'Menos desperdicio y mejor control de inventario',
  'Mayor claridad para promociones y venta cruzada',
  'Mejor lectura del negocio con KPIs accionables',
]

export default function Landing() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    negocio: '',
    correo: '',
    mensaje: '',
  })

  const enlaceDemo = useMemo(() => {
    const asunto = encodeURIComponent(
      `Solicitud de demo - ${formulario.negocio || 'Retail Pulse'}`
    )

    const cuerpo = encodeURIComponent(
      `Hola,\n\nMe interesa solicitar una demo de Retail Pulse.\n\nNombre: ${formulario.nombre || ''}\nNegocio: ${formulario.negocio || ''}\nCorreo: ${formulario.correo || ''}\nMensaje: ${formulario.mensaje || ''}\n\nQuedo pendiente.`
    )

    return `mailto:elliot.gballesteros@gmail.com?subject=${asunto}&body=${cuerpo}`
  }, [formulario])

  const actualizarCampo = (campo: string, valor: string) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }))
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div>
            <p className="text-2xl font-bold tracking-tight text-slate-950">Retail Pulse</p>
            <p className="text-sm text-slate-500">
              Inteligencia operativa para cafeterías y retail gastronómico
            </p>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            <a href="#problema" className="text-sm text-slate-600 hover:text-slate-900">
              Problema
            </a>
            <a href="#solucion" className="text-sm text-slate-600 hover:text-slate-900">
              Solución
            </a>
            <a href="#funcionamiento" className="text-sm text-slate-600 hover:text-slate-900">
              Funcionamiento
            </a>
            <a href="#contacto" className="text-sm text-slate-600 hover:text-slate-900">
              Demo
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Iniciar sesión
            </Link>
            <a
              href="#contacto"
              className="rounded-full bg-gradient-to-r from-fuchsia-600 via-violet-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:scale-[1.02]"
            >
              Solicitar demo
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.20),_transparent_30%),radial-gradient(circle_at_75%_15%,_rgba(217,70,239,0.18),_transparent_28%),radial-gradient(circle_at_70%_75%,_rgba(16,185,129,0.14),_transparent_22%),linear-gradient(to_bottom,_#ffffff,_#f8f9ff)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-4 py-1 text-sm font-medium text-violet-700">
                Pronóstico, inventario y decisiones en una sola plataforma
              </span>

              <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-950 lg:text-6xl">
                Haz que tu operación venda mejor y decida más rápido
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                Retail Pulse transforma ventas, inventario, clima y contexto en
                decisiones claras para reabastecimiento, análisis comercial y
                crecimiento del negocio.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Entrar al sistema
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>

                <a
                  href="#contacto"
                  className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Ver demo
                </a>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {estadisticas.map((item) => (
                  <div
                    key={item.etiqueta}
                    className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
                  >
                    <p className="text-xl font-bold text-slate-950">{item.valor}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.etiqueta}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-full rounded-[2rem] bg-slate-950 p-5 shadow-2xl">
                <div className="rounded-[1.5rem] bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-100">Vista ejecutiva</p>
                      <h3 className="mt-1 text-2xl font-bold">
                        Más visibilidad, menos intuición aislada
                      </h3>
                    </div>
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                      Operación en tiempo real
                    </span>
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <TarjetaCristal titulo="Pronóstico" valor="24 h" subtitulo="Demanda por producto" />
                    <TarjetaCristal titulo="Inventario" valor="Dinámico" subtitulo="Punto de reorden" />
                    <TarjetaCristal titulo="Venta cruzada" valor="Accionable" subtitulo="Sugerencias claras" />
                    <TarjetaCristal titulo="Resultados" valor="Visuales" subtitulo="KPIs y decisiones" />
                  </div>

                  <div className="mt-6 rounded-2xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-wide text-blue-100">
                      Lo que obtiene el negocio
                    </p>
                    <p className="mt-2 text-sm text-white/90">
                      Una plataforma que detecta riesgos, identifica oportunidades y
                      convierte datos operativos en acciones concretas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="problema" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-pink-50 px-4 py-1 text-sm font-medium text-pink-700">
              El reto diario
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
              Vender bien no solo depende del producto, también depende de decidir a tiempo
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Muchos negocios siguen tomando decisiones de inventario, reabastecimiento y
              promoción con base en intuición o revisiones tardías. Retail Pulse ayuda a
              convertir la operación diaria en información visible y útil.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {problemas.map((item) => (
              <div
                key={item.titulo}
                className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100"
              >
                <div className={`h-2 bg-gradient-to-r ${item.color}`} />
                <div className="p-6">
                  <div className="inline-flex rounded-2xl bg-slate-100 p-3 text-slate-700">
                    <item.icono className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">{item.titulo}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="solucion" className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
                Qué hace Retail Pulse
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                Une análisis, predicción y ejecución en una sola experiencia
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                La plataforma reúne información de distintas fuentes para generar un panel
                claro con indicadores, alertas y oportunidades de acción.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {soluciones.map((item) => (
                <div key={item.titulo} className="rounded-[2rem] bg-slate-50 p-6 ring-1 ring-slate-100">
                  <div className={`inline-flex rounded-2xl p-3 ${item.color}`}>
                    <item.icono className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-950">{item.titulo}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="funcionamiento" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <span className="inline-flex rounded-full bg-violet-50 px-4 py-1 text-sm font-medium text-violet-700">
                Cómo funciona
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
                Un flujo pensado para pasar del dato a la decisión
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Cada capa del sistema está diseñada para convertir datos dispersos en una
                guía operativa visible para quien toma decisiones.
              </p>
            </div>

            <div className="space-y-4">
              {flujo.map((item) => (
                <div
                  key={item.paso}
                  className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white">
                      {item.paso}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">{item.titulo}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.texto}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white/90">
                  Lo que ganas
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight">
                  Más control, más claridad y mejores decisiones
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-300">
                  Retail Pulse no solo organiza datos; ayuda a convertir la operación en una
                  ventaja competitiva más visible.
                </p>
              </div>

              <div className="grid gap-4">
                {beneficios.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[2rem] border border-white/10 bg-white/5 p-5"
                  >
                    <div className="mt-0.5 rounded-full bg-emerald-400/15 p-2 text-emerald-300">
                      <CheckCircleIcon className="h-5 w-5" />
                    </div>
                    <p className="text-sm leading-6 text-white/90">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <TarjetaValor
              titulo="Visibilidad"
              texto="Consulta ventas, productos líderes, inventario y recomendaciones en una sola vista."
              icono={PresentationChartLineIcon}
              color="from-blue-500 to-cyan-500"
            />
            <TarjetaValor
              titulo="Acción"
              texto="Convierte hallazgos analíticos en decisiones operativas que sí se puedan ejecutar."
              icono={BoltIcon}
              color="from-amber-500 to-orange-500"
            />
            <TarjetaValor
              titulo="Escalabilidad"
              texto="Una base modular para crecer con más clientes, más datos y más automatización."
              icono={CpuChipIcon}
              color="from-violet-500 to-fuchsia-500"
            />
          </div>
        </section>

        <section id="contacto" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 via-violet-900 to-fuchsia-900 p-8 text-white shadow-xl">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-medium">
                Solicitar demo
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                Agenda una demostración y conoce el potencial de tu operación
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-200 md:text-base">
                Cuéntanos un poco sobre tu negocio y prepararemos una demostración más enfocada
                en tus necesidades operativas.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-semibold">Ideal para:</p>
                  <p className="mt-1 text-sm text-slate-200">
                    cafeterías, panaderías, retail gastronómico y operaciones con inventario sensible.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm font-semibold">Lo que verás:</p>
                  <p className="mt-1 text-sm text-slate-200">
                    forecast, productos líderes, alertas de inventario y recomendaciones accionables.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-100">
              <h3 className="text-2xl font-bold tracking-tight text-slate-950">
                Solicitar una demo
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Llena estos datos y se abrirá tu correo con el mensaje listo para enviar.
              </p>

              <div className="mt-6 space-y-4">
                <Campo
                  etiqueta="Nombre"
                  valor={formulario.nombre}
                  onChange={(value) => actualizarCampo('nombre', value)}
                  placeholder="Tu nombre"
                />

                <Campo
                  etiqueta="Negocio"
                  valor={formulario.negocio}
                  onChange={(value) => actualizarCampo('negocio', value)}
                  placeholder="Nombre del negocio"
                />

                <Campo
                  etiqueta="Correo"
                  valor={formulario.correo}
                  onChange={(value) => actualizarCampo('correo', value)}
                  placeholder="correo@negocio.com"
                />

                <Campo
                  etiqueta="Mensaje"
                  valor={formulario.mensaje}
                  onChange={(value) => actualizarCampo('mensaje', value)}
                  placeholder="Cuéntanos qué te gustaría mejorar en tu operación"
                  multilinea
                />

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={enlaceDemo}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 via-violet-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:scale-[1.02]"
                  >
                    Enviar solicitud de demo
                    <ArrowRightIcon className="h-4 w-4" />
                  </a>

                  <Link
                    to="/login"
                    className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Ir al acceso
                  </Link>
                </div>

                <p className="text-xs text-slate-400">
                  El botón abrirá tu aplicación de correo con el asunto y mensaje listos para enviar.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function TarjetaCristal({
  titulo,
  valor,
  subtitulo,
}: {
  titulo: string
  valor: string
  subtitulo: string
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-wide text-blue-100">{titulo}</p>
      <p className="mt-2 text-2xl font-bold text-white">{valor}</p>
      <p className="mt-1 text-sm text-blue-50">{subtitulo}</p>
    </div>
  )
}

function TarjetaValor({
  titulo,
  texto,
  icono: Icono,
  color,
}: {
  titulo: string
  texto: string
  icono: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-100">
      <div className={`h-2 bg-gradient-to-r ${color}`} />
      <div className="p-6">
        <div className="inline-flex rounded-2xl bg-slate-100 p-3 text-slate-700">
          <Icono className="h-6 w-6" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-slate-950">{titulo}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{texto}</p>
      </div>
    </div>
  )
}

function Campo({
  etiqueta,
  valor,
  onChange,
  placeholder,
  multilinea = false,
}: {
  etiqueta: string
  valor: string
  onChange: (value: string) => void
  placeholder: string
  multilinea?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{etiqueta}</span>
      {multilinea ? (
        <textarea
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white"
        />
      ) : (
        <input
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:bg-white"
        />
      )}
    </label>
  )
}
