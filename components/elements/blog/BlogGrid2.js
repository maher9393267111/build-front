import Image from "next/image"
import Link from "next/link"

const BlogGrid2 = ({ item }) => {
    const { id, title, img, category, author, date } = item
    return (
        <>
            <div className="w-full mb-8 rounded-xl bg-primary-50/50 group">
                <Link href={`/blog/${id}`}>
                    <Image width="0"
                        height="0"
                        sizes="100vw"
                        style={{ width: "auto", height: "auto" }} className="h-80 w-full object-cover rounded-tl-xl rounded-tr-xl" src={`/images/blog/${img}`} alt="" />
                    <div className="pt-8 pb-2 px-5">
                        <p className="mb-3 text-sm text-primary-400 wow animate__animated animate__fadeInUp">
                            <span className="inline-block py-1 px-3 text-xs font-semibold bg-primary-100 text-primary-600 rounded-xl mr-3">{category}</span>
                            <span className="text-pgray-400 text-xs">{date}</span>
                        </p>
                        <h3 className="my-2 text-xl font-medium wow animate__animated animate__fadeInUp group-hover:text-primary-500 transition duration-200">{title}</h3>
                        <p className="text-pgray-400 leading-loose wow animate__animated animate__fadeInUp">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus eget justo et iaculis.</p>

                        <div className="inline-flex items-center fledx-wrap text-pgray-800 text-sm mt-5">
                            <div className="flex-shrink-0 relative flex items-center space-x-2 wow animate__animated animate__fadeInUp">
                                <Image
                                    className="rounded-full"
                                    width={30}
                                    height={30}
                                    src="/images/avatar/1.png"
                                    alt=""
                                />
                                <span className="block text-pgray-600 hover:text-black font-medium">Charlize Ray</span>
                            </div>
                            {/* <span className="text-pgray-500  mx-[6px] font-medium">·</span> */}
                            {/* <span className="text-pgray-500  font-normal line-clamp-1">May 20, 2023</span> */}
                        </div>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default BlogGrid2