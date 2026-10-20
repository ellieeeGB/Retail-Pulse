import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductPayload,
} from '../services/endpoints/products'
import type { Product } from '../types'
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

type ProductFormState = {
  product_id: string
  product_name: string
  category: string
  supplier: string
  cost_mxn: string
  price_mxn: string
  price_delivery: string
}

const emptyForm: ProductFormState = {
  product_id: '',
  product_name: '',
  category: '',
  supplier: '',
  cost_mxn: '',
  price_mxn: '',
  price_delivery: '',
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [form, setForm] = useState<ProductFormState>(emptyForm)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setForm(emptyForm)
    setErrorMessage('')
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setForm({
      product_id: String(product.product_id),
      product_name: product.product_name,
      category: product.category,
      supplier: product.supplier,
      cost_mxn: String(product.cost_mxn),
      price_mxn: String(product.price_mxn),
      price_delivery: product.price_delivery != null ? String(product.price_delivery) : '',
    })
    setErrorMessage('')
    setShowModal(true)
  }

  const closeModal = () => {
    if (saving) return
    setShowModal(false)
    setEditingProduct(null)
    setForm(emptyForm)
    setErrorMessage('')
  }

  const handleDelete = async (productId: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return

    try {
      await deleteProduct(productId)
      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('No se pudo eliminar el producto.')
    }
  }

  const handleChange = (field: keyof ProductFormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = (): string | null => {
    if (!form.product_id.trim()) return 'El ID del producto es obligatorio.'
    if (!form.product_name.trim()) return 'El nombre del producto es obligatorio.'
    if (!form.category.trim()) return 'La categoría es obligatoria.'
    if (!form.supplier.trim()) return 'El proveedor es obligatorio.'
    if (!form.cost_mxn.trim()) return 'El costo es obligatorio.'
    if (!form.price_mxn.trim()) return 'El precio es obligatorio.'

    if (Number.isNaN(Number(form.product_id))) return 'El ID del producto debe ser numérico.'
    if (Number.isNaN(Number(form.cost_mxn))) return 'El costo debe ser numérico.'
    if (Number.isNaN(Number(form.price_mxn))) return 'El precio debe ser numérico.'
    if (form.price_delivery.trim() && Number.isNaN(Number(form.price_delivery))) {
      return 'El precio de delivery debe ser numérico.'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    const validationError = validateForm()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    const payload: ProductPayload = {
      product_id: Number(form.product_id),
      product_name: form.product_name.trim(),
      category: form.category.trim(),
      supplier: form.supplier.trim(),
      cost_mxn: Number(form.cost_mxn),
      price_mxn: Number(form.price_mxn),
      price_delivery: form.price_delivery.trim() ? Number(form.price_delivery) : null,
    }

    setSaving(true)

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.product_id, payload)
      } else {
        await createProduct(payload)
      }

      await fetchProducts()
      closeModal()
    } catch (error: unknown) {
      console.error('Error saving product:', error)
      const detail = axios.isAxiosError<{ detail?: string }>(error)
        ? error.response?.data?.detail
        : undefined

      setErrorMessage(
        detail || 'No se pudo guardar el producto.'
      )
    } finally {
      setSaving(false)
    }
  }

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return products

    return products.filter((product) =>
      [
        product.product_name,
        product.category,
        product.supplier,
        String(product.product_id),
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    )
  }, [products, search])

  const summary = useMemo(() => {
    return {
      total: products.length,
      categories: new Set(products.map((p) => p.category)).size,
      suppliers: new Set(products.map((p) => p.supplier)).size,
    }
  }, [products])

  if (loading) return <div className="p-6">Cargando productos...</div>

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 px-8 py-8 text-white shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-4 py-1 text-sm font-medium">
              Catálogo
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight">Productos</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-200 md:text-base">
              Administra tu catálogo, precios, categorías y proveedores en un solo lugar.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            <PlusIcon className="h-5 w-5" />
            Nuevo producto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TopCard label="Total productos" value={String(summary.total)} />
        <TopCard label="Categorías" value={String(summary.categories)} />
        <TopCard label="Proveedores" value={String(summary.suppliers)} />
      </div>

      <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="relative max-w-md">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, categoría o proveedor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Proveedor</th>
                <th className="px-6 py-4">Costo</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Delivery</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-500">
                      <CubeIcon className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                      No se encontraron productos.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.product_id} className="hover:bg-gray-50/70">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{product.product_name}</p>
                        <p className="text-xs text-gray-500">ID #{product.product_id}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                        {product.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">{product.supplier}</td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      ${Number(product.cost_mxn).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ${Number(product.price_mxn).toFixed(2)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {product.price_delivery != null
                        ? `$${Number(product.price_delivery).toFixed(2)}`
                        : '—'}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="rounded-xl bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200 hover:text-gray-900"
                          title="Editar"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>

                        <button
                          onClick={() => handleDelete(product.product_id)}
                          className="rounded-xl bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                          title="Eliminar"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? 'Editar producto' : 'Nuevo producto'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Completa la información del producto para guardarlo en tu catálogo.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label="ID del producto"
                  value={form.product_id}
                  onChange={(value) => handleChange('product_id', value)}
                  disabled={!!editingProduct}
                  placeholder="Ej. 101"
                />

                <Field
                  label="Nombre del producto"
                  value={form.product_name}
                  onChange={(value) => handleChange('product_name', value)}
                  placeholder="Ej. Café Americano Chico 8oz"
                />

                <Field
                  label="Categoría"
                  value={form.category}
                  onChange={(value) => handleChange('category', value)}
                  placeholder="Ej. Hot Drinks"
                />

                <Field
                  label="Proveedor"
                  value={form.supplier}
                  onChange={(value) => handleChange('supplier', value)}
                  placeholder="Ej. Distribuidor Central"
                />

                <Field
                  label="Costo"
                  type="number"
                  step="0.01"
                  value={form.cost_mxn}
                  onChange={(value) => handleChange('cost_mxn', value)}
                  placeholder="Ej. 18.50"
                />

                <Field
                  label="Precio"
                  type="number"
                  step="0.01"
                  value={form.price_mxn}
                  onChange={(value) => handleChange('price_mxn', value)}
                  placeholder="Ej. 42.00"
                />

                <Field
                  label="Precio delivery"
                  type="number"
                  step="0.01"
                  value={form.price_delivery}
                  onChange={(value) => handleChange('price_delivery', value)}
                  placeholder="Opcional"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                  disabled={saving}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : editingProduct ? 'Actualizar' : 'Crear producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function TopCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  type = 'text',
  step,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  type?: string
  step?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white disabled:cursor-not-allowed disabled:bg-gray-100"
      />
    </label>
  )
}

export default Products
