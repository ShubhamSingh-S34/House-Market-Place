import React from 'react'
import { Link } from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import CardSlider from '../components/CardSlider'
function Explore() {
  return (
    <div className='explore'>
      <header>
        <p className='pageHeader'> Exlpore </p>
      </header>
      <main>
        {/* SLIDER */}
        <CardSlider />
        <p className='exploreCategoryHeading'>
          Categories
        </p>
        <div className='exploreCategories'>
          <Link to='/category/rent'>
            <img className='exploreCategoryImg' src={rentCategoryImage} alt='rent' />
            <p className='exploreCategoryName'>Place for Rent</p>
          </Link>
          <Link to='/category/sell'>
            <img className='exploreCategoryImg' src={sellCategoryImage} alt='sell' />
            <p className='exploreCategoryName'>Place for Sell</p>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Explore