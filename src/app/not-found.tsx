import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center h-screen text-center'>
      <h2 className='text-4xl font-medium'>404 || Not Found</h2>
      <p className='mt-2'>Could not find requested resource</p>
      <Link href="/dashboard" className='text-blue-500 mt-2 underline'>Return Home</Link>
    </div>
  )
}