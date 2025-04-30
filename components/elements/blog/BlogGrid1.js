import Image from "next/image";
import Link from "next/link";
import { formatDate } from '@utils/dateUtils';

const BlogGrid1 = ({ item }) => {
    const { id, title, slug, featuredImage, category, excerpt, publishedAt, createdAt, viewCount } = item;
    
    return (
        <>
            <div className="w-full mb-8 bg-primary-50/50 rounded-xl hover:shadow-md transition duration-300">
                <Link href={`/blog/${id}`}>
                    {featuredImage ? (
                        <div className="w-full h-48 overflow-hidden rounded-tl-xl rounded-tr-xl">
                            <img 
                                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                                src={featuredImage?.url} 
                                alt={title} 
                            />
                        </div>
                    ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-tl-xl rounded-tr-xl">
                            <span className="text-gray-400">No image</span>
                        </div>
                    )}
                    <div className="py-8 px-5">
                        <p className="mb-3 text-sm text-primary-400 wow animate__animated animate__fadeInUp">
                            <span className="inline-block py-1 px-3 text-xs font-semibold bg-primary-100 text-primary-600 rounded-xl mr-3">
                                {category.name}
                            </span>
                            <span className="text-pgray-400 text-xs">
                                {formatDate(publishedAt || createdAt)}
                            </span>
                        </p>
                        <h3 className="my-2 text-xl font-semibold wow animate__animated animate__fadeInUp line-clamp-2">{title}</h3>
                        <p className="text-pgray-400 leading-loose wow animate__animated animate__fadeInUp line-clamp-3">
                            {excerpt || 'Click to read more about this article.'}
                        </p>
                        <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{viewCount} views </span>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    );
};

export default BlogGrid1;

// import Image from "next/image"
// import Link from "next/link"

// const BlogGrid1 = ({ item }) => {
//     const { id, title, img, category, author, date } = item
//     return (
//         <>
//             <div className="w-full mb-8 bg-primary-50/50 rounded-xl ">
//                 <Link href={`/blog/${id}`}>
//                     <Image width={300} height={200} className="w-full rounded-tl-xl rounded-tr-xl" src={`/images/blog/${img}`} alt="" />
//                     <div className="py-8 px-5">
//                         <p className="mb-3 text-sm text-primary-400 wow animate__animated animate__fadeInUp">
//                             <span className="inline-block py-1 px-3 text-xs font-semibold bg-primary-100 text-primary-600 rounded-xl mr-3">{category}</span>
//                             <span className="text-pgray-400 text-xs">{date}</span>
//                         </p>
//                         <h3 className="my-2 text-xl font-semibold wow animate__animated animate__fadeInUp">{title}</h3>
//                         <p className="text-pgray-400 leading-loose wow animate__animated animate__fadeInUp">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus eget justo et iaculis.</p>
//                     </div>
//                 </Link>
//             </div>
//         </>
//     )
// }

// export default BlogGrid1