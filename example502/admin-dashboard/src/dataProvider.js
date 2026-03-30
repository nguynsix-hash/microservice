import { fetchUtils } from 'react-admin';
import axios from 'axios';

const apiUrl = 'http://localhost:8900';

export const dataProvider = {
    getList: async (resource, params) => {
        let url = '';
        if (resource === 'users') url = `${apiUrl}/accounts/users`;
        if (resource === 'products') url = `${apiUrl}/catalog/products`;
        if (resource === 'orders') url = `${apiUrl}/shop/orders`;

        const { data } = await axios.get(url);
        return {
            data: data,
            total: data.length,
        };
    },
    getOne: async (resource, params) => {
        let url = '';
        if (resource === 'users') url = `${apiUrl}/accounts/users/${params.id}`;
        if (resource === 'products') url = `${apiUrl}/catalog/products/${params.id}`;
        if (resource === 'orders') url = `${apiUrl}/shop/order/${params.id}`;

        const { data } = await axios.get(url);
        return { data };
    },
    update: async (resource, params) => {
        let url = '';
        if (resource === 'users') {
            url = `${apiUrl}/accounts/users/${params.id}`;
            const { data } = await axios.put(url, params.data);
            return { data };
        }
        if (resource === 'products') {
            url = `${apiUrl}/catalog/admin/products/${params.id}`;
            const { data } = await axios.put(url, params.data);
            return { data };
        }
        if (resource === 'orders') {
            url = `${apiUrl}/shop/order/${params.id}/status?status=${params.data.status}`;
            const { data } = await axios.put(url);
            return { data };
        }
    },
    create: async (resource, params) => {
        let url = '';
        if (resource === 'users') {
            url = `${apiUrl}/accounts/users`;
            const { data } = await axios.post(url, params.data);
            return { data };
        }
        if (resource === 'products') {
            url = `${apiUrl}/catalog/admin/products`;
            const { data } = await axios.post(url, params.data);
            return { data };
        }
        return { data: { ...params.data, id: Date.now() } };
    },
    delete: async (resource, params) => {
        let url = '';
        if (resource === 'users') url = `${apiUrl}/accounts/users/${params.id}`;
        if (resource === 'products') url = `${apiUrl}/catalog/admin/products/${params.id}`;
        
        await axios.delete(url);
        return { data: { id: params.id } };
    },
    getMany: async (resource, params) => {
        return { data: [] };
    },
    getManyReference: async (resource, params) => {
        return { data: [], total: 0 };
    },
    deleteMany: async () => { return { data: [] }; },
    updateMany: async () => { return { data: [] }; },
};
