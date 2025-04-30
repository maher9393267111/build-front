
const data = [
    {
        title: "Finance",
        count: 20,
        percent: 20
    },
    {
        title: "Technology",
        count: 50,
        percent: 50
    },
    {
        title: "Customer service",
        count: 30,
        percent: 30
    },
    {
        title: "Healthcare",
        count: 45,
        percent: 45
    },
    {
        title: "Engineering",
        count: 80,
        percent: 80
    },
    {
        title: "Design",
        count: 70,
        percent: 70
    },
    {
        title: "Education",
        count: 65,
        percent: 65
    },
    {
        title: "Administration",
        count: 85,
        percent: 85
    },
]

const SearchKeyword = () => {
    return (
        <>

            {data.map((item, i) => (

                <div className="grid grid-cols-3 my-5 border-b pb-5 last:border-0 last:pb-0 last:mb-0">
                    <h6 className="text-base">{item.title}</h6>
                    <div className="flex items-center col-span-2">
                        <div className="mr-3 text-sm text-pgray-400">{item.count}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${item.percent}%` }} />
                        </div>
                    </div>
                </div>
            ))}

        </>
    )
}

export default SearchKeyword

