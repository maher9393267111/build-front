import DatePosted from "./DatePosted"
// import DestinationRangeSlider from "./DestinationRangeSlider"
import ExperienceLevel from "./ExperienceLevel"
import LocationBox from "./LocationBox"
// import SalaryRangeSlider from "./SalaryRangeSlider"
import SearchBox from "./SearchBox"
import Tag from "./Tag"

const FilterSidebar = () => {
    return (
        <>
            <div className="mt-0">
                <div className="bg-primary-50/50 px-8 py-5 rounded-xl  wow animate__animated animate__fadeInUp mb-5">
                    <div className="block">
                        <h4 className="mb-3 text-lg">Search by Keywords</h4>
                        <div className="mb-6">
                            <SearchBox />
                        </div>
                    </div>

                    <div className="block">
                        <h4 className="mb-3 text-lg">Location</h4>
                        <div className="mb-6">
                            <LocationBox />
                        </div>
                    </div>


                    {/* <div className="block">
                        <h4 className="mb-3 text-lg">Category</h4>
                        <div className="mb-6">
                            <Categories />
                        </div>
                    </div> */}
                </div>

                <div className="bg-primary-50/50 px-8 py-5 rounded-xl  wow animate__animated animate__fadeInUp">

                    {/* <div className="mb-6">
                        <h4 className="mb-3 text-lg">Job type</h4>
                        <JobType />
                    </div> */}


                    <div className="mb-6">
                        <h4 className="mb-3 text-lg">Date Posted</h4>
                        <DatePosted />
                    </div>

                    <div className="mb-6">
                        <h4 className="mb-3 text-lg">Experience Level</h4>
                        <ExperienceLevel />
                    </div>


                    {/* 
                    <div className="mb-6">
                    <h4 className="mb-3 text-lg">Salary</h4>
                        <SalaryRangeSlider />
                    </div> */}



                    <div className="mb-6">
                        <h4 className="mb-3 text-lg">Tags</h4>
                        <Tag />
                    </div>
                </div>
            </div>
        </>
    )
}

export default FilterSidebar
