import React from 'react'
import Hero from '../components/Hero'
import Featured_collection from '../components/Featured_collection'
import About_section from '../components/About_section'
import Home_Art_Collection from '../components/Home_Art_Collection'

const Home_page = () => {

  return (
    <div>

        <Hero/>
        <Home_Art_Collection/>
        <Featured_collection/>
        <About_section/>

    </div>

  )
}

export default Home_page

