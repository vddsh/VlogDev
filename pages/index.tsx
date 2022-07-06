import Head from 'next/head'
import Header from '../components/header';
import {sanityClient, urlFor} from '../sanity';
import {Post} from '../typings';
import Link from 'next/link';

interface Props {
  posts: Post[]
}

const Home = ({posts}: Props) => {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <Header/>
      <div className='flex justify-between items-center bg-pink-200 border-y border-pink-300 py-10 lg:py-0 rounded-lg'>
        <div className='px-2 space-y-5 md:px-5 lg:px-10'>
          <h1 className='text-6xl max-w-xl font-serif'>Here i'm sharing with you my experience in Front-end web development</h1>
          <h2>You can find here: fixing bugs / code examples / ect.</h2>
        </div>
        <img className='hidden md:inline-flex h-48 lg:h-96' src='/logo.png' alt='logo'/>
      </div>
      {/* post */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-2'>
        {posts.map(post =>
          <Link key={post._id} href={`/post/${post.slug.current}`}>
          <div className='group border rounded-lg cursor-pointer overflow-hidden'>
            {post.mainImage &&
            <img className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out rounded-lg ' src={urlFor(post.mainImage).url()} alt=''/>
            }
          <div className='flex justify-between p-5'>
            <div>
              <p className='font-bold text-2xl'>{post.title}</p>
              <p className='text-gray-400 italic'>{post.description} by {post.author.name}</p>
            </div>
            <img className='h-12 w-12 rounded-full' src={urlFor(post.author.image).url()!} alt=''/>
          </div>
          </div>
        </Link>)}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
 const query = `*[_type == "post"] {
  _id,
  title,
  mainImage,
  description, 
  slug,
  author -> {
  name,
  image,
}
}`

  const posts = await sanityClient.fetch(query)

  return {
   props: {
     posts,
   }
  }
}

export default Home
