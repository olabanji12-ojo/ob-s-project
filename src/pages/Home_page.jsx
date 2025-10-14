import React from 'react'
import Hero from '../components/Hero'
import Featured_collection from '../components/Featured_collection'
import About_section from '../components/About_section'
import Art_pages from './Art_pages'

const Home_page = () => {

  return (
    <div>

        <Hero/>
        <Art_pages/>
        <Featured_collection/>
        <About_section/>

    </div>

  )
}

export default Home_page

