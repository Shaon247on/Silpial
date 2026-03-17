import LegalReferencesPage from '@/components/LegalReferencesPage/LegalReferencesPage'
import React, { Suspense } from 'react'

function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LegalReferencesPage/>
      </Suspense>
    </div>
  )
}

export default page
