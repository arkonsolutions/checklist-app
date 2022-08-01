import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IAppVersion } from "../models/app-version.interface";

@Injectable({providedIn: 'root'})
export class RemoteAPIService {
    
    constructor(private http: HttpClient) {}

    public getLatestAppVersion(): Observable<IAppVersion> {
        return this.http.get<IAppVersion>('https://www.arkon.solutions/api/AppStore/GetLatestAppVersion/checklist/android');
    }

    public getDownloadLinkForAppVersion(appVersion: IAppVersion): string {
        return `https://www.arkon.solutions/api/AppStore/GetAppBinaries/${appVersion.id}`;
    }
}