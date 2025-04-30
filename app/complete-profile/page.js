'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/features/updateProfile/profile";

const CompleteProfile = () => {
    const [formData, setFormData] = useState({
        fullname: "",
        date_of_birth: "",
        phone: "",
        address: "",
        education: "",
        experience: "",
        skills: "",
        social_media_links: "",
    });
    const [step, setStep] = useState(1); // Quản lý bước
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleNext = () => {
        setStep((prevStep) => prevStep + 1);
    };

    const handlePrevious = () => {
        setStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(1, formData); // Giả sử userId = 1
            setSuccess("Profile updated successfully!");
            setTimeout(() => router.push("/"), 2000);
        } catch (err) {
            setError(err.message || "An error occurred while updating your profile.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded space-y-4 w-96">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                {step === 1 && (
                    <>
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                id="fullname"
                                name="fullname"
                                type="text"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="input bg-primary-100 w-full rounded border-gray-300"
                                required
                            />
                        </div>
                        {/* Date of Birth */}
                        <div>
                            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <input
                                id="date_of_birth"
                                name="date_of_birth"
                                type="date"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="input bg-primary-100 w-full rounded border-gray-300"
                                required
                            />
                        </div>
                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input bg-primary-100 w-full rounded border-gray-300"
                                required
                            />
                        </div>
                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                className="input bg-primary-100 w-full rounded border-gray-300"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                        >
                            Next
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        {/* Education */}
                        <div>
                            <label htmlFor="education" className="block text-sm font-medium text-gray-700">Education</label>
                            <textarea
                                id="education"
                                name="education"
                                value={formData.education}
                                onChange={handleChange}
                                className="input bg-primary-100 w-full rounded border-gray-300"
                            />
                        </div>
                        {/* Experience */}
                        <div>
                            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience</label>
                            <textarea
                                id="experience"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="input bg-primary-100 w-full rounded border-gray-300"
                            />
                        </div>
                        {/* Skills */}
                        <div>
                            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills</label>
                            <textarea
                                id="skills"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                className="input bg-primary-100 w-full rounded border-gray-300"
                            />
                        </div>
                        {/* Social Media Links */}
                        <div>
                            <label htmlFor="social_media_links" className="block text-sm font-medium text-gray-700">Social Media Links</label>
                            <input
                                id="social_media_links"
                                name="social_media_links"
                                type="text"
                                value={formData.social_media_links}
                                onChange={handleChange}
                                className="input bg-primary-100 w-full rounded border-gray-300"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Previous
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Save and Continue
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default CompleteProfile;
