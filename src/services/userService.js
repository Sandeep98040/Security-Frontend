import axios from "axios";

const baseUrl = 'https://localhost:3005/users';
const getToken = () => `bearer ${window.localStorage.getItem('token')}`;

const register = (userData) => {
    return axios.post(`${baseUrl}/register`, userData);
};

const login = (loginCredentials) => {
    return axios.post(`${baseUrl}/login`, loginCredentials);
};

const lockAccount = (email) => {
    return axios.post(`${baseUrl}/lockAccount`, email);
};

const passwordNeedChange = () => {
    return axios.get(`${baseUrl}/passwordNeedChange`, {
        headers: { Authorization: getToken() }
    });
};

const getUser = () => {
    return axios.get(`${baseUrl}`, {
        headers: {
            Authorization: getToken()
        }
    });
};

const deleteAccount = () => {
    return axios.delete(`${baseUrl}`, {
        headers: {
            Authorization: getToken()
        }
    });
};

const changeName = (newName) => {
    return axios.put(`${baseUrl}`, newName, {
        headers: {
            Authorization: getToken()
        }
    });
};

const changePassword = (newPassword) => {
    return axios.put(`${baseUrl}/changePassword`, newPassword, {
        headers: {
            Authorization: getToken()
        }
    });
};

// Upload file or image for profile
const uploadProfileImage = (selectedImageFile) => {
    const formData = new FormData();
    formData.append('photo', selectedImageFile);

    const config = {
        headers: {
            Authorization: getToken(),
            'Content-Type': 'multipart/form-data'
        }
    };

    return axios.post(`${baseUrl}/uploads`, formData, config);
};

// Upload file or image for product
const uploadProductImage = (productId, selectedImageFile) => {
    const formData = new FormData();
    formData.append('photo', selectedImageFile);

    const config = {
        headers: {
            Authorization: getToken(),
            'Content-Type': 'multipart/form-data'
        }
    };

    return axios.post(`${baseUrl}/uploads/${productId}`, formData, config);
};

const getAllPurchaseProducts = () => {
    return axios.get(`${baseUrl}/purchase`, {
        headers: {
            Authorization: getToken()
        }
    });
};

const unlockAccount = (userId) => {
    return axios.post(`${baseUrl}/admin/unlockAccount/${userId}`, {});
};

const getLogs = async () => {
    try {
        const response = await axios.get('https://localhost:3005/admin/logs', {
            headers: {
                Authorization: getToken(), // Assuming JWT for auth
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
};

const userServices = {
    login,
    lockAccount,
    passwordNeedChange,
    getUser,
    register,
    deleteAccount,
    changeName,
    changePassword,
    uploadProductImage,
    uploadProfileImage,
    getAllPurchaseProducts,
    unlockAccount,
    getLogs
};

export default userServices;
