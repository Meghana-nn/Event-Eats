import React from 'react'
import ItemsDisplay from '../components/ItemsDisplay'
import DisplayCaterers from '../components/DisplayCaterers'

function LandingPage() {
  return (
    <div>
        <div className='landingSection'>
             <ItemsDisplay/>
             <DisplayCaterers/>
        </div>
    </div>
  )
}

export default LandingPage