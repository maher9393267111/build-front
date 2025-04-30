
const Card = ({ children, title }) => {
    return (
        <>
            <div className="bg-white p-5 rounded-lg mb-5 border border-pgray-200">
                {title &&
                    <div className="border-b border-gray-100 pb-4 mb-5">
                        <h5 className="font-semibold text-lg text-gray-700">{title}</h5>
                    </div>
                }
                <div>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Card