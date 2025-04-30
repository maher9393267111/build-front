import Image from "next/image"
import Link from "next/link"

const BlogGrid3 = ({ item }) => {
    const { id, title, img, authorImg, category, author, date } = item
    return (
        <>
            <div className="w-full mb-8 bg-white rounded-2xl">
                <Link href={`/blog/${id}`}>
                    {/* <Image width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: "auto", height: "auto" }} className="h-80 w-full object-cover rounded-2xl rounded-tr-2xl" src={`/images/blog/${img}`} alt="" /> */}
                    <div className="py-8 px-5">
                        <p className="mb-3 text-sm text-primary-400 wow animate__animated animate__fadeInUp">
                            <span className="inline-block py-1 px-3 text-xs font-semibold bg-primary-100 text-primary-600 rounded-xl mr-3">{category}</span>
                            <span className="text-pgray-400 text-xs">{date}</span>
                        </p>
                        <h3 className="my-2 text-2xl font-bold wow animate__animated animate__fadeInUp">{title}</h3>
                        <p className="text-pgray-400 leading-loose wow animate__animated animate__fadeInUp">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus eget justo et iaculis.</p>

                        <div className="inline-flex items-center fledx-wrap text-pgray-800 text-sm mt-5">
                            <div className="flex-shrink-0 relative flex items-center space-x-2">
                                <Image
                                    className="rounded-full wow animate__animated animate__fadeInUp"
                                    width={30}
                                    height={30}
                                    src={`/images/avatar/${authorImg}`}
                                    alt=""
                                />
                                <span className="block text-pgray-600 hover:text-black font-medium wow animate__animated animate__fadeInUp">{author}</span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default BlogGrid3