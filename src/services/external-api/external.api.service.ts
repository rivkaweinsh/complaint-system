import { Injectable } from '@nestjs/common';
import axios from 'axios';


interface IResource {
    url: string;
    idKeyName: string;
    sourceName: string;
}

interface IApiResponse {
    [key: string]: any;
}

@Injectable()
export class ExternalApiService {

    private readonly IResources: IResource[];

    constructor() {
        this.IResources = [
            {
                url: 'http://localhost:8081/users/',
                idKeyName: 'userId',
                sourceName: 'users',
            },
            {
                url: 'http://localhost:8081/purchases/',
                idKeyName: 'purchaseId',
                sourceName: 'purchases',
            },
        ];
    }

    private async fetchData(url: string): Promise<IApiResponse> {
        const response = await axios.get(url);
        return response.data as IApiResponse;
    }

    async fetchResourceDataByIds(ids: Record<string, string>): Promise<Record<string, IApiResponse>> {
        const data: Record<string, IApiResponse> = {};

        const requests = this.IResources.map(async (IResource) => {
            const { url, idKeyName, sourceName } = IResource;
            const id = ids[idKeyName];
            const IResourceUrl = `${url}${id}`;
            const responseData = await this.fetchData(IResourceUrl);
            data[sourceName] = responseData;
        });

        await Promise.all(requests);

        return data;
    }

}
