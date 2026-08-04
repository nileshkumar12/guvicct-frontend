import Categories from "../category/Categories";
import MainSlider from "./MainSlider"
import SpecialCategory from "./SpecialCategory"
import Testimonials from "./Testimonials"

import React from "react";
const giftGuideItems = [
  {
    title: 'New Arrivals',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Last Minute (Pick Up Only)',
    image:
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Make It Local',
    image:
      'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Wine Gift Baskets',
    image:
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Gourmet Gift Baskets',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Pamper & Relax',
    image:
      'https://images.unsplash.com/photo-1600428877878-1a0fd85beda4?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Beer & Whiskey Gift Baskets',
    image:
      'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'New Baby',
    image:
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Healthy/Gluten Free',
    image:
      'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Gift Boxes',
    image:
      'https://images.unsplash.com/photo-1607344645866-009c320f122f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Chocolate & Snacks',
    image:
      'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Gifts Under $75',
    image:
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80',
  },
]

const Home = () => {
  return (
    <>
    <MainSlider/>
    <Categories/>
    <SpecialCategory/>
    <Testimonials/>
    
    </>
  )
}

export default Home
