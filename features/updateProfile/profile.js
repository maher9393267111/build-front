export const updateProfile = async (userId, data) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/applicant/profile/update/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
    }
    return await response.json();
};
