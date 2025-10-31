import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import GalleryItem from './GalleryItem'
import { Star, Sparkles, Camera } from 'lucide-react'

const FEATURED_DESIGNS = [
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    title: 'Mountain Vista',
    category: 'Nature',
    popular: true
  },
  {
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=600&fit=crop',
    title: 'Ocean Waves',
    category: 'Nature',
    popular: false
  },
  {
    src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=600&fit=crop',
    title: 'Neon City',
    category: 'Urban',
    popular: true
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    title: 'Abstract Art',
    category: 'Art',
    popular: false
  },
  {
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop',
    title: 'Forest Path',
    category: 'Nature',
    popular: true
  },
  {
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    title: 'Geometric',
    category: 'Pattern',
    popular: false
  },
  {
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=600&fit=crop',
    title: 'Sunset Beach',
    category: 'Nature',
    popular: true
  },
  {
    src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=600&fit=crop',
    title: 'Space Galaxy',
    category: 'Space',
    popular: false
  }
]



export default function Page() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <MaxWidthWrapper className="py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Premium Phone Cases
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover our curated collection of stunning designs. From nature to abstract art, find the perfect case that matches your style.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-600" />
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <span>Unique Designs</span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-orange-600" />
              <span>HD Printing</span>
            </div>
          </div>
        </div>



        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FEATURED_DESIGNS.map((design, index) => (
            <GalleryItem key={index} src={design.src} title={design.title} popular={design.popular} />
          ))}
        </div>
      </MaxWidthWrapper>
    </div>
  )
}
