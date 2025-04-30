import BlogGrid2 from "@components/elements/blog/BlogGrid2"
import BlogGrid3 from "@components/elements/blog/BlogGrid3"
import SectionTitle from "@components/elements/SectionTitle"
import data from "@data/blog.json"
const BlogSection3 = () => {
    return (
        <>

            <div className="section-padding bg-pgray-100">
                <div className="container">
                    <SectionTitle
                        style={2}
                        title="Exploring the World of Knowledge"
                        subTitle="Unleash Your Curiosity with Engaging Articles, Expert Opinions, and Inspiring Stories"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-5 mt-20">
                        {data.slice(0, 3).map((item, i) => (
                            <BlogGrid3 item={item} key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogSection3