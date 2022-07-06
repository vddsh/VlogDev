import React, {useState} from 'react';
import {sanityClient} from '../../sanity';
import Header from '../../components/header';
import {GetStaticProps} from 'next';
import {Post} from '../../typings';
import {urlFor} from '../../sanity';
import PortableText from 'react-portable-text';
import {SubmitHandler, useForm} from 'react-hook-form';

interface Props {
  post: Post;
}

interface IEFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

function Post({post}: Props) {
  const [submitted, setSubmitted] = useState(false);


  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IEFormInput>();

  const onSubmit: SubmitHandler<IEFormInput> = async (data) => {
    await fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(() => {
      console.log(data);
      setSubmitted(true);
    }).catch((err) => {
      console.log(err);
    });

  };

  return (
    <main>
      <Header/>
      <img className="w-full h-40 object-cover rounded" src={urlFor(post.mainImage).url()} alt=""/>
      <article className="max-w-3xl mx-auto p-5">
        <div className="flex items-center space-x-2 justify-center rounded p-1 bg-gray-100">
          <img className="h-10 w-10 rounded-full" src={urlFor(post.author.image).url()} alt=""/>
          <p className="font-extralight text-sm">Blog post by <span className='font-normal'>{post.author.name}</span> - Published
            at {new Date(post._createdAt).toLocaleString()}</p>
        </div>
        <h1 className="text-5xl mt-10 text-center">{post.title}</h1>
        <h2 className="text-2xl my-2 italic font-light text-gray-500 mb-2 text-center">{post.description}</h2>
        <div className="my-10">
          <PortableText
            className=''
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h3: (props: any) => (
                <h3 className='text-2xl font-bold my-5 py-5' {...props}/>
              ),
              h4: (props: any) => (
                <h4 className='text-1xl font-bold my-3 py-3' {...props}/>
              )
            }}
          />
        </div>
      </article>
      <hr className="max-w-lg my-5 mx-auto border border-blue-500"/>
      {submitted ? (
        <div className="flex flex-col py-10 my-10 bg-pink-200 max-w-2xl mx-auto rounded">
          <h3 className="font-bold text-3xl mx-auto text-white">Thanks for submitting</h3>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mx-auto p-5 max-w-2xl mb-10">
          <input {...register('_id')} type="hidden" name="_id" value={post._id}/>
          <h2 className="text-3xl py-10">Leave a comment below</h2>
          <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input
              {...register('name', {required: true})}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-blue-500 outline-none focus:ring"
              placeholder="John Doe" type="text"/>
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input
              {...register('email', {required: true})}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-blue-500 outline-none focus:ring"
              placeholder="JohnDoe@email.com" type="email"/>
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Comment</span>
            <textarea
              {...register('comment', {required: true})}
              className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-blue-500 outline-none focus:ring"
              placeholder="John Doe" rows={8}/>
          </label>
          <div className="flex flex-col p-5">
            {errors.name && (<span className="text-red-600">- Name Field is Required</span>)}
            {errors.email && (<span className="text-red-600">- Email Field is Required</span>)}
            {errors.comment && (<span className="text-red-600">- Comment Field is Required</span>)}
          </div>
          <input type="submit"
                 className="shadow text-white bg-blue-600 py-2 rounded cursor-pointer hover:bg-blue-500 focus:shadow-outline focus:outline-none"/>
        </form>
      )}

      <div className='flex flex-col p-10 my-10 mx-auto max-w-2xl shadow-gray-400 shadow'>
        <h3 className='text-4xl py-2'>Comments</h3>
        <hr className='pb-2 border-blue-500'/>
        {post.comments.map(comment =>
          <div key={comment._id}>
            <p><span className='text-blue-500'>{comment.name}:</span>{comment.comment}</p>
          </div>)}
      </div>

    </main>
  );
}

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"] {
  _id,
  slug {
    current
  }
}`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: any) => ({
    params: {
      slug: post.slug.current
    }
  }));

  return {
    paths,
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const query = `*[_type == "post" && slug.current == $slug][0] {
  _id,
 _createdAt,
  title,
  author -> {
  name,
  image,
},
'comments': *[_type == "comment" && post._ref == ^._id && approved == true],
description,
mainImage,
slug,
body
}`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      post,
    },
  };
};