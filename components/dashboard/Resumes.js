
import * as Icon from "react-bootstrap-icons"
const data = [
    {
        title: "Avy",
        img: "1.png"
    },
    {
        title: "Mark",
        img: "2.png"
    },
    {
        title: "Avy",
        img: "3.png"
    },
    {
        title: "Mark",
        img: "4.png"
    },
    {
        title: "Avy",
        img: "5.png"
    },
    {
        title: "Avy",
        img: "6.png"
    },
    {
        title: "Mark",
        img: "7.png"
    },
    {
        title: "Avy",
        img: "8.png"
    },
    {
        title: "Mark",
        img: "9.png"
    },
    {
        title: "Avy",
        img: "10.png"
    }
]

const Resumes = () => {
    return (
        <>
            {data.map((item, i) => (
                <div className="bg-white border border-pgray-200 p-5 rounded-2xl flex justify-between items-center mb-5">
                    <div className="flex items-center">
                        <img src={`/images/avatar/${item.img}`} className="rounded-2xl mr-4 w-14" alt="prexjob" />
                        <div className="card-title">
                            <h6>{item.title}</h6>
                            <p className="text-sm text-gray-500">React Developer</p>
                        </div>
                    </div>
                    <span className="text-sm text-gray-400">Chicago, US</span>
                    <div className="flex items-center">
                        <span className="h-6 flex items-center bg-primary-100 text-primary-500 mx-1 rounded-xl px-3 py-2">
                            <Icon.Eye />
                        </span>
                        <span className="h-6 flex items-center bg-primary-100 text-primary-500 mx-1 rounded-xl px-3 py-2">
                            <Icon.Check />
                        </span>
                        <span className="h-6 flex items-center bg-primary-100 text-primary-500 mx-1 rounded-xl px-3 py-2">
                            <Icon.X />
                        </span>
                        <span className="h-6 flex items-center bg-primary-100 text-primary-500 mx-1 rounded-xl px-3 py-2">
                            <Icon.Trash />
                        </span>
                    </div>
                </div>
            )
            )}
        </>
    )
}

export default Resumes