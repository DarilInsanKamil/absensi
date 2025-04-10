import React from 'react'

const Page = async () => {
    const id = 2
    const res = await fetch("http://localhost:3000/api/guru/" + id)
    const profile = await res.json();
  return (
    <div>Profile: {JSON.stringify(profile)}</div>
  )
}

export default Page