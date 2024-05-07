const { default: axios } = require("axios");



const fetchSellerDetails = async(id) => {
    const authToken = localStorage.getItem('authToken');
    const headers = {
        'Authorization': `Token 29817064d00da77b8cd19585e13e02ad310f45f1`,
        // Authorization: `Token ${authToken}`,
        'Accept': 'application/json',
    };
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}users/sellerById/${id}`, { headers });
        return response.data;
    } catch (error) {
        console.error("Error fetching seller details:", error);
        throw error;
    }
}


const fetchProductsItem = async(id,page)=>{
    const authToken = localStorage.getItem('authToken');
    const headers = {
        'Authorization': `Token 29817064d00da77b8cd19585e13e02ad310f45f1`,
        // Authorization: `Token ${authToken}`,
        'Accept': 'application/json',
    };
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}products/productsBySeller/${id}/?page=${page}`, { headers });
        return response.data;
    } catch (error) {
        console.error("Error fetching seller details:", error);
        throw error;
    }
}

const OwnerProfileService = {
    fetchSellerDetails,
    fetchProductsItem
}

export default OwnerProfileService;