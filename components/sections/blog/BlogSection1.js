import BlogGrid1 from "@components/elements/blog/BlogGrid1"
import SectionTitle from "@components/elements/SectionTitle"

const BlogSection1 = ({ blogs = [] }) => {
    return (
        <>
            <div className="section-padding">
                <div className="container">
                    <SectionTitle
                        style={2}
                        title="Exploring the World of Knowledge"
                        subTitle="Unleash Your Curiosity with Engaging Articles, Expert Opinions, and Inspiring Stories"
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 gap-7 mt-20 ">
                        {blogs.length === 0 ? (
                            <div className="col-span-3 text-center text-gray-500">No articles found.</div>
                        ) : (
                            blogs.map((item) => (
                                <BlogGrid1 item={item} key={item.id} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BlogSection1