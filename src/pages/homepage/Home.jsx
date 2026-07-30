import MainSlider from './MainSlider';
import Categories from './Categories';
import SpecialCategory from './SpecialCategory';
import Testimonials from './Testimonials';
import Footer from '../../Footer/Footer';

const productImage =
  'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=700&q=80'
const categoryImage =
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=700&q=80'

const productItems = [
  'New Arrivals',
  'Last Minute Picks',
  'Local Favorites',
  'Wine Product Baskets',
  'Gourmet Hampers',
  'Pamper & Relax',
  'Premium Spirits',
  'New Baby',
  'Healthy Choices',
  'Product Boxes',
  'Chocolate & Snacks',
  'Products Under Rs. 999',
]

const categories = [
  'Wedding',
  'Housewarming',
  'Sympathy',
  'Corporate',
  'Get Well',
  'Family Products',
  'Pet Lovers',
  'All Products',
]



const posts = [
  'Best Gourmet Product Baskets This Season',
  'Winter Wishes For Every Budget',
  'Picking The Perfect Product',
  'Simple Ways To Make Producting Memorable',
]

const Home = () => {
  return (

    <>
     <MainSlider />
    <Categories/>
    <SpecialCategory/>
    <main className="bg-slate-50 text-slate-900">
     
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-slate-900 px-6 py-10 text-center text-white">
          <h2 className="text-2xl font-bold">
            Calgary's product basket company for 20+ years
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-slate-300">
            Helping you strengthen relationships one product at a time, with
            custom baskets for personal celebrations and business producting.
          </p>
        </div>
      </section>

    <Testimonials/>

    <Footer/>
      

    </main>
        </>
  )
}

export default Home
