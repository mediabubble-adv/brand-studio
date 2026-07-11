import { BrandOnboardingForm } from '@/components/brands/BrandOnboardingForm'

export default function NewBrandPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Add New Brand</h1>
      <p className="mt-1 mb-8 text-sm text-gray-500">
        Upload the client's brand guidelines PDF and we'll extract colors, fonts, and tone automatically.
      </p>
      <BrandOnboardingForm />
    </div>
  )
}
