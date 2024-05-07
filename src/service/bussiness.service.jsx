
const { default: axios } = require("axios");

const AddBussinessDetails = async(myResponseBody)=>{
    const authToken = localStorage.getItem('authToken');
    const headers = {
        Authorization: `Token ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
    };
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}users/updateToBusinessProflie/`, myResponseBody, { headers });
        return response;
    } catch (error) {
        console.error("Error fetching seller details:", error);
        throw error;
    }
}

const BussinessService = {
    AddBussinessDetails
}
export default BussinessService;

