import * as Icon from "react-bootstrap-icons"
const data = [
    {
        title: "Interview Schedules",
        count: 256,
        growth: "positive",
        scroe: 41,
        icon: <><Icon.CalendarCheck /></>
    },
    {
        title: "Applied Jobs",
        count: 652,
        growth: "negative",
        scroe: 29,
        icon: <><Icon.FileEarmarkArrowUp /></>
    },
    {
        title: "Task Bids Won",
        count: 357,
        growth: "negative",
        scroe: 25,
        icon: <><Icon.Award /></>
    },
    {
        title: "Application Sent",
        count: 159,
        growth: "positive",
        scroe: 12,
        icon: <><Icon.Envelope /></>
    },
    {
        title: "Profile Viewed",
        count: 456,
        growth: "positive",
        scroe: 35,
        icon: <><Icon.Eye /></>
    },
    {
        title: "New Messages",
        count: 258,
        growth: "positive",
        scroe: 20,
        icon: <><Icon.ChatDots /></>
    },
    {
        title: "Articles Added",
        count: 167,
        growth: "negative",
        scroe: 18,
        icon: <><Icon.JournalPlus /></>
    },
    {
        title: "CV Added",
        count: 349,
        growth: "positive",
        scroe: 15,
        icon: <><Icon.FileEarmarkPerson /></>
    },
]
const WidgetStats = () => {
    return (
        <>
            {data.map((item, i) => (
                <div className="flex bg-white py-3 px-5 rounded-lg border border-pgray-200">
                    <div className="mr-3 text-3xl text-primary-500 mt-2">
                        {item.icon}
                    </div>
                    <div className="mb-2 w-full">
                        <h3 className="flex items-center justify-between mt-1 mb-1">
                            {item.count}
                            {item.growth === "positive" &&
                                <span className="text-sm flex items-center ml-5 text-green-500">
                                    <Icon.Plus className="mr-1 " />
                                    {item.scroe}<span>%</span>
                                </span>
                            }
                            {item.growth === "negative" &&
                                <span className="text-sm flex items-center ml-5 text-red-500">
                                    <Icon.Dash className="mr-1 " />
                                    {item.scroe}<span>%</span>
                                </span>
                            }
                        </h3>
                        <p className="text-sm text-pgray-400">{item.title}</p>
                    </div>
                </div>
            ))}
        </>
    )
}

export default WidgetStats