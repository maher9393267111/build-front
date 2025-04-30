import RecruterProfileForm from '@components/form/RecruterProfileForm'
import Card from '@components/ui/Card'
import { Transition } from '@headlessui/react'
const RecruterModal = ({ isToggled, handleToggle }) => {
    return (
        <>
            <Transition
                show={isToggled}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed  left-0 top-0 bottom-0 right-0  flex items-center">
                    <div className="fixed  left-0 top-0 bottom-0 right-0 z-[-1px]  bg-pgray-800 bg-opacity-80" onClick={handleToggle}></div>
                    <div className="w-full max-w-[800px] mx-auto z-10">
                        <Card title="Create Recruter">

                            <RecruterProfileForm />
                        </Card>
                    </div>

                </div>
            </Transition>
        </>
    )
}

export default RecruterModal