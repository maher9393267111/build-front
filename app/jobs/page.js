'use client'
// import jobs from "@/data/jobs"
import {
    addCategory,
    addDatePosted,
    addDestination,
    addKeyword,
    addLocation,
    addPerPage,
    addSalary,
    addSort,
    addTag,
    clearExperience,
    clearJobType,
} from "@/features/filter/filterSlice"
import {
    clearDatePostToggle,
    clearExperienceToggle,
    clearJobTypeToggle,
} from "@/features/job/jobSlice"
// import getAllJob from "@api/job/getAllJob"
import JobGrid1 from "@components/elements/job/JobGrid1"
import FilterSidebar from '@components/filter/FilterSidebar'
import Layout from "@components/layout/landing/Layout"
import NewsletterSection1 from "@components/sections/newsletter/Newsletter1"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
// export const metadata = {
//     title: 'Prexjob | Job Board Nextjs Tailwindcss Listing Directory Template',
// }
const Jobs = () => {
    const [ jobs, setJobs ] = useState([]);
    const { jobList, jobSort } = useSelector((state) => state.filter)
    // console.log(jobs);
    const {
        keyword,
        location,
        destination,
        category,
        jobType,
        datePosted,
        experience,
        salary,
        tag,
    } = jobList || {}

    const { sort, perPage } = jobSort

    const dispatch = useDispatch()

    // keyword filter on title
    const keywordFilter = (item) =>
        keyword !== ""
            ? item.jobTitle
                .toLocaleLowerCase()
                .includes(keyword.toLocaleLowerCase())
            : item

    // location filter
    const locationFilter = (item) =>
        location !== ""
            ? item?.location
                ?.toLocaleLowerCase()
                .includes(location?.toLocaleLowerCase())
            : item

    // location filter
    const destinationFilter = (item) =>
        item?.destination?.min >= destination?.min &&
        item?.destination?.max <= destination?.max

    // category filter
    const categoryFilter = (item) =>
        category !== ""
            ? item?.category?.toLocaleLowerCase() ===
            category?.toLocaleLowerCase()
            : item

    // job-type filter
    const jobTypeFilter = (item) =>
        jobType?.length !== 0 && item?.jobType !== undefined
            ? jobType?.includes(
                item?.jobType[0]?.type
                    .toLocaleLowerCase()
                    .split(" ")
                    .join("-")
            )
            : item

    // date-posted filter
    const datePostedFilter = (item) =>
        datePosted !== "all" && datePosted !== ""
            ? item?.created_at
                ?.toLocaleLowerCase()
                .split(" ")
                .join("-")
                .includes(datePosted)
            : item

    // experience level filter
    const experienceFilter = (item) =>
        experience?.length !== 0
            ? experience?.includes(
                item?.experience?.split(" ").join("-").toLocaleLowerCase()
            )
            : item

    // salary filter
    const salaryFilter = (item) =>
        item?.totalSalary?.min >= salary?.min &&
        item?.totalSalary?.max <= salary?.max

    // tag filter
    const tagFilter = (item) => (tag !== "" ? item?.tag === tag : item)

    // sort filter
    const sortFilter = (a, b) =>
        sort === "des" ? a.id > b.id && -1 : a.id < b.id && -1


    useEffect(() => {
        // getAllJob()
        //     .then(res => {
        //         setJobs(res.jobs);
        //     })
        //     .catch()
    }, []);

    let content = jobs
        // ?.filter(keywordFilter)
        // ?.filter(locationFilter)
        // ?.filter(destinationFilter)
        // ?.filter(categoryFilter)
        // ?.filter(jobTypeFilter)
        // ?.filter(datePostedFilter)
        // ?.filter(experienceFilter)
        // ?.filter(salaryFilter)
        // ?.filter(tagFilter)
        // ?.sort(sortFilter)
        // .slice(perPage.start, perPage.end !== 0 ? perPage.end : 10)
        ?.map((item, i) => (
            <JobGrid1 item={item} key={i} />
        ))

    // sort handler
    const sortHandler = (e) => {
        dispatch(addSort(e.target.value))
    }

    // per page handler
    const perPageHandler = (e) => {
        const pageData = JSON.parse(e.target.value)
        dispatch(addPerPage(pageData))
    }

    // clear all filters
    const clearAll = () => {
        dispatch(addKeyword(""))
        dispatch(addLocation(""))
        dispatch(addDestination({ min: 0, max: 100 }))
        dispatch(addCategory(""))
        dispatch(clearJobType())
        dispatch(clearJobTypeToggle())
        dispatch(addDatePosted(""))
        dispatch(clearDatePostToggle())
        dispatch(clearExperience())
        dispatch(clearExperienceToggle())
        dispatch(addSalary({ min: 0, max: 20000 }))
        dispatch(addTag(""))
        dispatch(addSort(""))
        dispatch(addPerPage({ start: 0, end: 0 }))
    }
    return (
        <>

            <Layout
                breadcrumbTitle={"Find Jobs"}
                breadcrumbSubTitle={"Search your career opportunity through 12,800 jobs"}
                breadcrumbAlign={"center"}
                headerBg="transparent"
            >

                <div className="section-padding">
                    <div className="container">
                        <div className="flex justify-between items-center my-5 border-b border-pgray-100 pb-5">

                            <div className="text">
                                Show <strong>{content?.length}</strong> jobs
                            </div>


                            <div className="flex items-center gap-3">
                                {keyword !== "" ||
                                    location !== "" ||
                                    destination?.min !== 0 ||
                                    destination?.max !== 100 ||
                                    category !== "" ||
                                    jobType?.length !== 0 ||
                                    datePosted !== "" ||
                                    experience?.length !== 0 ||
                                    salary?.min !== 0 ||
                                    salary?.max !== 20000 ||
                                    tag !== "" ||
                                    sort !== "" ||
                                    perPage.start !== 0 ||
                                    perPage.end !== 0 ? (
                                    <button
                                        onClick={clearAll}
                                        className="btn bg-green-500 text-sm min-w-[120px] rounded-md text-white py-[12px] mt-1"

                                    >
                                        Reset
                                    </button>
                                ) : undefined}

                                <select
                                    value={sort}
                                    className="input bg-primary-50/50 text-sm min-w-[100px] rounded-md px-5 appearance-none"
                                    onChange={sortHandler}
                                >
                                    <option value="">Sort by</option>
                                    <option value="asc">Newest</option>
                                    <option value="des">Oldest</option>
                                </select>


                                <select
                                    onChange={perPageHandler}
                                    className="input bg-primary-50/50 rounded-md px-5 appearance-none "
                                    value={JSON.stringify(perPage)}
                                >
                                    <option
                                        value={JSON.stringify({
                                            start: 0,
                                            end: 0,
                                        })}
                                    >
                                        All
                                    </option>
                                    <option
                                        value={JSON.stringify({
                                            start: 0,
                                            end: 10,
                                        })}
                                    >
                                        10 per page
                                    </option>
                                    <option
                                        value={JSON.stringify({
                                            start: 0,
                                            end: 20,
                                        })}
                                    >
                                        20 per page
                                    </option>
                                    <option
                                        value={JSON.stringify({
                                            start: 0,
                                            end: 30,
                                        })}
                                    >
                                        30 per page
                                    </option>
                                </select>

                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                            <FilterSidebar />
                            <div className="lg:col-span-3">
                                <div className="grid md:grid-cols-2 gap-5">
                                    {content}
                                </div>
                                {/* <Pagination /> */}
                            </div>
                        </div>
                    </div>
                </div>
                <NewsletterSection1 />
            </Layout>
        </>
    )
}

export default Jobs